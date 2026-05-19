import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { createHash } from "crypto";

admin.initializeApp();

const KJL_URL = "https://openapi.kujiale.com";
const KJL_IFRAME_BASE_URL = "https://www.kujiale.com/v/auth";
const KJL_WORKBENCH_BASE = "https://www.kujiale.com/pub/saas/workbench";

function buildDesignDetailUrl(designId: string) {
    const id = String(designId).trim();
    if (!id) {
        throw new HttpsError("invalid-argument", "designId required");
    }
    return `${KJL_WORKBENCH_BASE}/design/detail/${encodeURIComponent(id)}?gs.nav.type=auto-site`;
}

async function getAppUidForUser(uid: string): Promise<string> {
    const profilesSnapshot = await admin.firestore()
        .collection("user_profiles")
        .where("userId", "==", uid)
        .limit(1)
        .get();
    if (profilesSnapshot.empty) {
        throw new HttpsError("failed-precondition", "APP_UID not configured");
    }
    return profilesSnapshot.docs[0].data().kjl_app_uid;
}

async function fetchOpenApiToken(appUid: string): Promise<string> {
    const result = await kujialeSignedRequest(appUid, "/v2/sso/token", {
        query: { dest: "5" },
        method: "POST",
        signMode: "appuid",
    });
    if (!isKjlSuccess(result)) {
        throw new Error((result as { m?: string }).m || "SSO failed");
    }
    const token = (result as { d?: string }).d;
    if (!token) throw new Error("SSO token missing");
    return token;
}

async function persistOpenApiToken(uid: string, token: string) {
    const tokenSnapshot = await admin.firestore()
        .collection("user_tokens")
        .where("userId", "==", uid)
        .limit(1)
        .get();

    const payload = {
        open_api_token: token,
        token_expires_at: null,
    };

    if (!tokenSnapshot.empty) {
        await tokenSnapshot.docs[0].ref.set(payload, { merge: true });
    } else {
        await admin.firestore().collection("user_tokens").doc(uid).set({
            userId: uid,
            ...payload,
        }, { merge: true });
    }
}

async function ensureOpenApiToken(uid: string): Promise<string> {
    const tokenSnapshot = await admin.firestore()
        .collection("user_tokens")
        .where("userId", "==", uid)
        .limit(1)
        .get();

    const existing = tokenSnapshot.empty
        ? null
        : tokenSnapshot.docs[0].data().open_api_token;

    if (existing) return existing;

    const appUid = await getAppUidForUser(uid);
    const token = await fetchOpenApiToken(appUid);
    await persistOpenApiToken(uid, token);
    return token;
}

/**
 * Kujiale Open API signature modes (verified via test-project-detail.js):
 * - appuid: MD5(appSecret + appKey + appUid + timestamp) — design list, SSO, albumdata, copy, tags
 * - appkey: MD5(appSecret + appKey + timestamp) — renderpic, design basic, archive, render delete
 */
type KjlSignMode = "appuid" | "appkey";

type KjlRequestOptions = {
    query?: Record<string, string>;
    method?: "GET" | "POST";
    signMode: KjlSignMode;
    body?: Record<string, unknown> | unknown[];
};

type ApiDiagnostic = {
    api: string;
    signMode: KjlSignMode;
    ok: boolean;
    c?: string | number;
    m?: string;
    count?: number;
};

function generateSignature(appKey: string, appSecret: string, appUid: string | null) {
    const timestamp = Date.now().toString();
    const raw = appUid
        ? appSecret + appKey + appUid + timestamp
        : appSecret + appKey + timestamp;
    const sign = createHash("md5").update(raw, "utf8").digest("hex");
    return { sign, timestamp };
}

/** Same as designList — reads process.env (populated from Cloud env or bound secrets). */
function getKjlCredentials() {
    const appKey = (process.env.KJL_APP_KEY || "").trim();
    const appSecret = (process.env.KJL_APP_SECRET || "").trim();
    return { appKey, appSecret };
}

function getKjlCredentialsStatus() {
    const { appKey, appSecret } = getKjlCredentials();
    return {
        hasAppKey: appKey.length > 0,
        hasAppSecret: appSecret.length > 0,
    };
}

function kjlErrorMessage(result: unknown): string {
    if (!result || typeof result !== "object") return "Unknown KJL error";
    return String((result as { m?: string }).m || "KJL request failed");
}

/** Single entry point for all openapi.kujiale.com calls — always pass signMode explicitly. */
async function kujialeSignedRequest(
    appUid: string,
    path: string,
    options: KjlRequestOptions,
): Promise<unknown> {
    const { query = {}, method = "GET", signMode, body } = options;
    const { appKey, appSecret } = getKjlCredentials();
    const signAppUid = signMode === "appuid" ? appUid : null;
    const { sign, timestamp } = generateSignature(appKey, appSecret, signAppUid);

    // Auth query params last so design_id / lang cannot override appkey/sign.
    const params = new URLSearchParams({
        ...query,
        timestamp,
        appkey: appKey,
        sign,
        appuid: appUid,
    });

    const headers: Record<string, string> = {};
    const init: RequestInit = { method, headers };

    if (method === "POST") {
        headers["Content-Type"] = "application/json;charset=utf-8";
        if (body !== undefined) {
            init.body = JSON.stringify(body);
        }
    }

    const url = `${KJL_URL}${path}?${params.toString()}`;
    const response = await fetch(url, init);
    const text = await response.text();
    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error(`KJL API non-JSON: ${method} ${path} (${response.status})`);
    }

    if (!response.ok) {
        throw new Error(`KJL API HTTP ${response.status}: ${method} ${path}`);
    }
    return parsed;
}

function diagnosticFromResult(
    api: string,
    signMode: KjlSignMode,
    result: unknown,
    count?: number,
): ApiDiagnostic {
    return {
        api,
        signMode,
        ok: isKjlSuccess(result),
        c: (result as { c?: string | number })?.c,
        m: (result as { m?: string })?.m,
        count,
    };
}

function isKjlSuccess(result: unknown): boolean {
    if (!result || typeof result !== "object") return false;
    const code = (result as { c?: string | number }).c;
    return code === "0" || code === 0;
}

function normalizeRenderItems(raw: unknown): Array<Record<string, unknown>> {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as Array<Record<string, unknown>>;

    if (typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        for (const key of ["result", "list", "renderPics", "pics", "items", "data"]) {
            const val = obj[key];
            if (Array.isArray(val)) return val as Array<Record<string, unknown>>;
        }
    }
    return [];
}

/** GET /v2/renderpic/list/v2 — appkey signature (Open API doc 4100, see test-project-detail.js). */
async function fetchRenderPicsV2(appUid: string, designId: string) {
    const all: Array<Record<string, unknown>> = [];
    const pageSize = 50;
    let lastResult: unknown = null;

    const fetchPage = async (id: string) => {
        const pageItems: Array<Record<string, unknown>> = [];
        let offset = 0;

        for (let page = 0; page < 10; page++) {
            const result = await kujialeSignedRequest(appUid, "/v2/renderpic/list/v2", {
                query: {
                    design_id: id,
                    start: String(offset),
                    num: String(pageSize),
                    lang: "en_US",
                },
                method: "GET",
                signMode: "appkey",
            });
            lastResult = result;
            if (!isKjlSuccess(result)) {
                const msg = (result as { m?: string }).m;
                throw new Error(msg || "renderpic/list/v2 failed");
            }

            const payload = (result as { d?: { result?: unknown; hasMore?: boolean } }).d;
            const batch = normalizeRenderItems(payload);
            if (batch.length === 0) break;

            pageItems.push(...batch);
            if (!payload?.hasMore || batch.length < pageSize) break;
            offset += batch.length;
        }
        return pageItems;
    };

    const primary = await fetchPage(designId);
    all.push(...primary);

    return { items: all, lastResult };
}

function normalizeAlbumItems(raw: unknown): Array<Record<string, unknown>> {
    if (!raw || typeof raw !== "object") return [];
    const list = (raw as { albumDataOpenApiList?: unknown }).albumDataOpenApiList;
    return Array.isArray(list) ? (list as Array<Record<string, unknown>>) : [];
}

/** POST /v2/render/design/albumdata — Video / album tabs (doc 4098, scene_type_id). */
async function fetchDesignAlbumData(
    appUid: string,
    designId: string,
    sceneTypeId: number,
) {
    const all: Array<Record<string, unknown>> = [];
    let lastItemId = "";
    let lastResult: unknown = null;

    for (let page = 0; page < 15; page++) {
        const query: Record<string, string> = {
            design_id: designId,
            scene_type_id: String(sceneTypeId),
            num: "20",
        };
        if (lastItemId) query.last_item_id = lastItemId;

        const result = await kujialeSignedRequest(appUid, "/v2/render/design/albumdata", {
            query,
            method: "POST",
            signMode: "appuid",
        });
        lastResult = result;
        if (!isKjlSuccess(result)) {
            console.warn(
                `albumdata scene ${sceneTypeId} failed:`,
                kjlErrorMessage(result),
            );
            break;
        }

        const d = (result as { d?: Record<string, unknown> }).d;
        const batch = normalizeAlbumItems(d);
        all.push(...batch);

        const finished = d?.finished;
        const nextId = typeof d?.lastItemId === "string" ? d.lastItemId : "";
        if (finished === true || finished === "true" || !nextId || batch.length === 0) break;
        if (nextId === lastItemId) break;
        lastItemId = nextId;
    }

    return { items: all, lastResult };
}

/**
 * Video tab — scene_type_id per doc 4098.
 * Exclude scene 0 ("Still album"): it returns the same still renders as renderpic/list.
 */
const VIDEO_ALBUM_SCENE_TYPES = [
    { id: 1, label: "Growth animation" },
    { id: 2, label: "Roam video" },
    { id: 3, label: "Template video" },
    { id: 4, label: "One-click film" },
];

async function fetchAllAlbumVideos(appUid: string, designId: string) {
    const all: Array<Record<string, unknown>> = [];
    let lastResult: unknown = null;
    for (const scene of VIDEO_ALBUM_SCENE_TYPES) {
        try {
            const { items, lastResult: sceneResult } = await fetchDesignAlbumData(
                appUid,
                designId,
                scene.id,
            );
            lastResult = sceneResult;
            for (const item of items) {
                all.push({
                    ...item,
                    sceneTypeId: scene.id,
                    sceneLabel: scene.label,
                    renderPresentType:
                        item.renderPresentType != null
                            ? item.renderPresentType
                            : scene.id,
                });
            }
        } catch (err) {
            console.warn(`albumdata scene ${scene.id} failed:`, err);
        }
    }
    return { items: all, lastResult };
}

/** GET /v2/archive/list — Construction drawings tab (doc 4125). */
async function fetchConstructionArchives(appUid: string, designId: string) {
    const result = await kujialeSignedRequest(appUid, "/v2/archive/list", {
        query: {
            design_id: designId,
            start: "0",
            num: "10",
        },
        method: "GET",
        signMode: "appkey",
    });
    if (!isKjlSuccess(result)) {
        return { files: [] as Array<Record<string, unknown>>, result };
    }

    const d = (result as { d?: { result?: unknown } }).d;
    const archives = d?.result;
    if (!Array.isArray(archives)) return { files: [], result };

    const files: Array<Record<string, unknown>> = [];
    for (const archive of archives) {
        const resources = (archive as { resources?: unknown }).resources;
        if (!Array.isArray(resources)) continue;
        for (const res of resources) {
            if (res && typeof res === "object") {
                files.push(res as Record<string, unknown>);
            }
        }
    }
    return { files, result };
}

// 1. Signup (Creates Auth User + User Profile)
export const signup = onCall(async (request) => {
    const { email, password, app_uid } = request.data as any;

    if (!email || !password || !app_uid) {
        throw new HttpsError("invalid-argument", "Missing fields");
    }

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: true
        });

        await admin.firestore().collection("user_profiles").doc(userRecord.uid).set({
            userId: userRecord.uid,
            kjl_app_uid: app_uid
        });

        return { success: true };
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});

/** Project gallery/detail payload — same Kujiale calls as test-project-detail.js */
async function buildProjectDetailResponse(
    authUid: string,
    designId: string,
    locale?: string,
) {
    const id = String(designId).trim();
    const appUid = await getAppUidForUser(authUid);
    const apiDiagnostics: ApiDiagnostic[] = [];

    let basicPayload: unknown = null;
    try {
        const basicResult = await kujialeSignedRequest(
            appUid,
            `/v2/design/${encodeURIComponent(id)}/basic/v2`,
            { method: "GET", signMode: "appkey" },
        );
        apiDiagnostics.push(
            diagnosticFromResult("design/basic/v2", "appkey", basicResult),
        );
        if (isKjlSuccess(basicResult)) {
            basicPayload = (basicResult as { d?: unknown }).d ?? null;
        }
    } catch (err) {
        apiDiagnostics.push({
            api: "design/basic/v2",
            signMode: "appkey",
            ok: false,
            m: (err as Error).message,
        });
        console.warn("design basic/v2 failed:", err);
    }

    let renderPics: Array<Record<string, unknown>> = [];
    let videos: Array<Record<string, unknown>> = [];
    let constructionFiles: Array<Record<string, unknown>> = [];

    const planIdFromBasic =
        basicPayload &&
        typeof basicPayload === "object" &&
        (basicPayload as { basicInfo?: { planId?: string } }).basicInfo?.planId
            ? String((basicPayload as { basicInfo: { planId: string } }).basicInfo.planId)
            : undefined;

    let renderLastResult: unknown = null;
    try {
        const primary = await fetchRenderPicsV2(appUid, id);
        renderPics = primary.items;
        renderLastResult = primary.lastResult;
        apiDiagnostics.push(
            diagnosticFromResult(
                "renderpic/list/v2",
                "appkey",
                renderLastResult,
                renderPics.length,
            ),
        );
        if (renderPics.length === 0 && planIdFromBasic && planIdFromBasic !== id) {
            const alt = await fetchRenderPicsV2(appUid, planIdFromBasic);
            apiDiagnostics.push(
                diagnosticFromResult(
                    "renderpic/list/v2 (planId)",
                    "appkey",
                    alt.lastResult,
                    alt.items.length,
                ),
            );
            if (alt.items.length > 0) {
                renderPics = alt.items;
                renderLastResult = alt.lastResult;
            }
        }
    } catch (err) {
        apiDiagnostics.push({
            api: "renderpic/list/v2",
            signMode: "appkey",
            ok: false,
            m: (err as Error).message,
        });
        console.warn("renderpic/list/v2 failed:", err);
    }

    let albumLastResult: unknown = null;
    try {
        const album = await fetchAllAlbumVideos(appUid, id);
        videos = album.items;
        albumLastResult = album.lastResult;
        apiDiagnostics.push(
            diagnosticFromResult(
                "render/design/albumdata",
                "appuid",
                albumLastResult,
                videos.length,
            ),
        );
    } catch (err) {
        apiDiagnostics.push({
            api: "render/design/albumdata",
            signMode: "appuid",
            ok: false,
            m: (err as Error).message,
        });
        console.warn("render/design/albumdata failed:", err);
    }

    try {
        const archive = await fetchConstructionArchives(appUid, id);
        constructionFiles = archive.files;
        apiDiagnostics.push(
            diagnosticFromResult(
                "archive/list",
                "appkey",
                archive.result,
                constructionFiles.length,
            ),
        );
    } catch (err) {
        apiDiagnostics.push({
            api: "archive/list",
            signMode: "appkey",
            ok: false,
            m: (err as Error).message,
        });
        console.warn("archive/list failed:", err);
    }

    const basicInfo =
        basicPayload && typeof basicPayload === "object"
            ? (basicPayload as { basicInfo?: Record<string, unknown> }).basicInfo
            : undefined;

    const accessToken = await ensureOpenApiToken(authUid);
    const detailUrl = buildDesignDetailUrl(id);
    const localeParam = typeof locale === "string" ? locale : "en_US";
    const workbenchParams = new URLSearchParams({
        accesstoken: accessToken,
        redirecturl: detailUrl,
        locale: localeParam,
        lang: localeParam,
        "qh-locale": localeParam,
    });
    const workbenchUrl = `${KJL_IFRAME_BASE_URL}?${workbenchParams.toString()}`;

    return {
        designId: id,
        planId: planIdFromBasic ?? id,
        appUid,
        basic: basicPayload,
        renders: renderPics,
        renderCount: renderPics.length,
        videos,
        videoCount: videos.length,
        constructionFiles,
        constructionCount: constructionFiles.length,
        panoUrls: {
            designPanoUrl: basicInfo?.designPanoUrl ?? null,
            designAIPanoUrl: basicInfo?.designAIPanoUrl ?? null,
        },
        workbenchUrl,
        detailUrl,
        apiDiagnostics,
        credentials: getKjlCredentialsStatus(),
    };
}

// 2. Design list OR project detail (same Cloud Function = same process.env as working My Projects)
export const designList = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const data = request.data as {
        designId?: string;
        locale?: string;
        start?: number;
        num?: number;
    };

    if (data?.designId) {
        return buildProjectDetailResponse(
            request.auth.uid,
            data.designId,
            data.locale,
        );
    }

    const { start = 0, num = 10 } = data;
    const appUid = await getAppUidForUser(request.auth.uid);

    try {
        const result = await kujialeSignedRequest(appUid, "/v2/design/list", {
            query: { start: String(start), num: String(num) },
            method: "GET",
            signMode: "appuid",
        });
        if (!isKjlSuccess(result)) {
            throw new HttpsError("internal", kjlErrorMessage(result));
        }
        return result;
    } catch (err) {
        if (err instanceof HttpsError) throw err;
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 3. Delete Design (Proxies KJL deletion) — sign: appuid
export const deleteDesign = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const { designid } = request.data as { designid?: string };
    if (!designid) {
        throw new HttpsError("invalid-argument", "designid required");
    }

    const appUid = await getAppUidForUser(request.auth.uid);

    try {
        const result = await kujialeSignedRequest(appUid, "/v2/design/deletion", {
            query: { plan_id: String(designid) },
            method: "POST",
            signMode: "appuid",
        });
        if (!isKjlSuccess(result)) {
            throw new HttpsError("internal", kjlErrorMessage(result));
        }
        return result;
    } catch (err) {
        if (err instanceof HttpsError) throw err;
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 4. Exchange Token (User SSO) — sign: appuid
export const exchangeToken = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const appUid = await getAppUidForUser(request.auth.uid);

    try {
        const result = await kujialeSignedRequest(appUid, "/v2/sso/token", {
            query: { dest: "5" },
            method: "POST",
            signMode: "appuid",
        });
        if (!isKjlSuccess(result)) {
            throw new HttpsError("internal", kjlErrorMessage(result));
        }
        const token = (result as { d?: string }).d;

        // Try to update existing token document based on userId, or push a new doc
        const tokenSnapshot = await admin.firestore().collection("user_tokens").where("userId", "==", request.auth.uid).limit(1).get();
        if (!tokenSnapshot.empty) {
            await tokenSnapshot.docs[0].ref.set({
                open_api_token: token,
                token_expires_at: null
            }, { merge: true });
        } else {
            // Document doesn't exist, create it with userId
            await admin.firestore().collection("user_tokens").doc(request.auth.uid).set({
                userId: request.auth.uid,
                open_api_token: token,
                token_expires_at: null
            }, { merge: true });
        }

        return { success: true };
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 5. Iframe Proxy (Get KJL URL)
export const iframeProxy = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const tokensSnapshot = await admin.firestore().collection("user_tokens").where("userId", "==", request.auth.uid).limit(1).get();
    if (tokensSnapshot.empty) throw new HttpsError("not-found", "Token not found");

    const accessToken = tokensSnapshot.docs[0].data().open_api_token;
    const dest = "1";
    const locale = typeof request.data?.locale === "string" ? request.data.locale : "en_US";

    const params = new URLSearchParams({
        accesstoken: accessToken,
        dest,
        locale,
        lang: locale,
        "qh-locale": locale,
    });

    const iframeUrl = `${KJL_IFRAME_BASE_URL}?${params.toString()}`;

    return { iframeUrl };
});

// 6. Design detail page (workbench gallery / render outputs)
export const getDesignDetailUrl = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const { designId } = request.data as { designId?: string; locale?: string };
    if (!designId) {
        throw new HttpsError("invalid-argument", "designId required");
    }

    const locale = typeof request.data?.locale === "string" ? request.data.locale : "en_US";
    const accessToken = await ensureOpenApiToken(request.auth.uid);
    const detailUrl = buildDesignDetailUrl(designId);

    const params = new URLSearchParams({
        accesstoken: accessToken,
        redirecturl: detailUrl,
        locale,
        lang: locale,
        "qh-locale": locale,
    });

    const url = `${KJL_IFRAME_BASE_URL}?${params.toString()}`;

    return { url, detailUrl };
});

// Deprecated: use designList({ designId }) — same handler, avoids a 2nd Cloud Run without env.
export const projectDetail = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");
    const { designId, locale } = request.data as { designId?: string; locale?: string };
    if (!designId) throw new HttpsError("invalid-argument", "designId required");
    return buildProjectDetailResponse(request.auth.uid, designId, locale);
});

/** Fetch CDN asset server-side so the browser can save a file (avoids CORS / <a download> opening a tab). */
export const proxyAssetDownload = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const { url } = request.data as { url?: string };
    if (!url || typeof url !== "string") {
        throw new HttpsError("invalid-argument", "url required");
    }
    const trimmed = url.trim();
    if (!trimmed.startsWith("https://")) {
        throw new HttpsError("invalid-argument", "url must be https");
    }

    const response = await fetch(trimmed);
    if (!response.ok) {
        throw new HttpsError("internal", `Asset fetch failed (${response.status})`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    return {
        base64: buffer.toString("base64"),
        contentType,
    };
});

// Update design title — POST /v2/design/{designId}/basic (appkey sign)
export const updateDesignName = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const { designId, name } = request.data as { designId?: string; name?: string };
    const id = String(designId || "").trim();
    const trimmedName = String(name || "").trim();
    if (!id) throw new HttpsError("invalid-argument", "designId required");
    if (!trimmedName) throw new HttpsError("invalid-argument", "name required");
    if (trimmedName.length > 120) {
        throw new HttpsError("invalid-argument", "name must be 120 characters or fewer");
    }

    const appUid = await getAppUidForUser(request.auth.uid);

    const result = await kujialeSignedRequest(
        appUid,
        `/v2/design/${encodeURIComponent(id)}/basic`,
        {
            method: "POST",
            signMode: "appkey",
            body: { name: trimmedName },
        },
    );
    if (!isKjlSuccess(result)) {
        throw new HttpsError("internal", kjlErrorMessage(result));
    }
    return result;
});

// Copy design — POST /v2/design/{designId}/copy (doc 4008)
export const copyDesign = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");
    const { designId } = request.data as { designId?: string };
    if (!designId) throw new HttpsError("invalid-argument", "designId required");

    const appUid = await getAppUidForUser(request.auth.uid);
    const id = String(designId).trim();

    const result = await kujialeSignedRequest(
        appUid,
        `/v2/design/${encodeURIComponent(id)}/copy`,
        { method: "POST", signMode: "appuid" },
    );
    if (!isKjlSuccess(result)) {
        throw new HttpsError("internal", (result as { m?: string }).m || "Copy failed");
    }
    return result;
});

// List design folders/tags — GET /v2/design/tag/list (doc 4020)
export const listDesignTags = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const { start = 0, num = 50 } = request.data as { start?: number; num?: number };
    const appUid = await getAppUidForUser(request.auth.uid);

    const result = await kujialeSignedRequest(appUid, "/v2/design/tag/list", {
        query: { start: String(start), num: String(num) },
        method: "GET",
        signMode: "appuid",
    });
    if (!isKjlSuccess(result)) {
        throw new HttpsError("internal", (result as { m?: string }).m || "Tag list failed");
    }
    return result;
});

// Move design to folder — POST /v2/design/tag/{tagId}/association (doc 4024)
export const moveDesignToTag = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const { tagId, planId } = request.data as { tagId?: string; planId?: string };
    if (!tagId || !planId) {
        throw new HttpsError("invalid-argument", "tagId and planId required");
    }

    const appUid = await getAppUidForUser(request.auth.uid);

    const result = await kujialeSignedRequest(
        appUid,
        `/v2/design/tag/${encodeURIComponent(String(tagId))}/association`,
        {
            method: "POST",
            signMode: "appuid",
            body: { planIds: [String(planId)] },
        },
    );
    if (!isKjlSuccess(result)) {
        throw new HttpsError("internal", kjlErrorMessage(result));
    }
    return result;
});

// Delete render pictures — doc 4074
export const deleteRenderPictures = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const { picIds } = request.data as { picIds?: string[] };
    if (!picIds?.length) {
        throw new HttpsError("invalid-argument", "picIds required");
    }

    const appUid = await getAppUidForUser(request.auth.uid);
    const results: Array<{ picId: string; ok: boolean; message?: string }> = [];

    for (const picId of picIds) {
        try {
            const result = await kujialeSignedRequest(
                appUid,
                `/v2/renderpic/${encodeURIComponent(picId)}/deletion`,
                { method: "POST", signMode: "appkey" },
            );
            results.push({
                picId,
                ok: isKjlSuccess(result),
                message: (result as { m?: string }).m,
            });
        } catch (err) {
            results.push({ picId, ok: false, message: (err as Error).message });
        }
    }

    return { results };
});

// Admin Helper
const isAdmin = (auth: any) => {
    if (!auth || !auth.token) return false;
    return auth.token.email === "zettaaitechnologies@gmail.com" || auth.token.admin === true;
};

// 6. Admin: List Users
export const listUsers = onCall(async (request) => {
    if (!isAdmin(request.auth)) {
        throw new HttpsError("permission-denied", "Only admins can perform this action.");
    }

    try {
        const listUsersResult = await admin.auth().listUsers(1000);
        return listUsersResult.users.map((user) => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            admin: user.customClaims?.admin === true || user.email === "zettaaitechnologies@gmail.com",
            disabled: user.disabled
        }));
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 7. Admin: Toggle Admin Status
export const toggleAdmin = onCall(async (request) => {
    if (!isAdmin(request.auth)) {
        throw new HttpsError("permission-denied", "Only admins can perform this action.");
    }

    const { uid, adminStatus } = request.data as any;
    if (!uid) {
        throw new HttpsError("invalid-argument", "Missing uid");
    }

    try {
        await admin.auth().setCustomUserClaims(uid, { admin: adminStatus });
        return { success: true };
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 7b. Admin: Toggle User Status (Enable/Disable)
export const toggleUserStatus = onCall(async (request) => {
    if (!isAdmin(request.auth)) {
        throw new HttpsError("permission-denied", "Only admins can perform this action.");
    }

    const { uid, disabled } = request.data as any;
    if (!uid) {
        throw new HttpsError("invalid-argument", "Missing uid");
    }

    try {
        await admin.auth().updateUser(uid, { disabled });
        
        // Optionally, we can also revoke refresh tokens so they are logged out immediately
        if (disabled) {
            await admin.auth().revokeRefreshTokens(uid);
        }
        
        return { success: true };
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 8. Admin: Register User
export const adminRegisterUser = onCall(async (request) => {
    if (!isAdmin(request.auth)) {
        throw new HttpsError("permission-denied", "Only admins can perform this action.");
    }

    const { email, password, name } = request.data as any;
    if (!email || !password) {
        throw new HttpsError("invalid-argument", "Missing email or password");
    }

    try {
        // 1. Create Firebase Auth User
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name || email.split("@")[0],
            emailVerified: true
        });

        const newUid = userRecord.uid;

        // 2. Register Kujiale Account — sign: appuid
        const kjlData = await kujialeSignedRequest(newUid, "/v2/register", {
            method: "POST",
            signMode: "appuid",
            body: {
                name: name || email.split("@")[0],
                email: email,
                type: 0,
            },
        });
        if (!isKjlSuccess(kjlData)) {
            console.error("KJL Registration failed:", kjlErrorMessage(kjlData));
        } else {
            console.log("KJL Registration OK");
        }

        // 3. Create user_profiles doc
        await admin.firestore().collection("user_profiles").doc(newUid).set({
            userId: newUid,
            kjl_app_uid: newUid,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // 4. Create user_tokens doc
        await admin.firestore().collection("user_tokens").doc(newUid).set({
            userId: newUid,
            open_api_token: null,
            token_expires_at: null,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return { success: true, uid: newUid };
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});
