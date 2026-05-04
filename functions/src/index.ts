import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { createHash } from "crypto";

admin.initializeApp();

const KJL_URL = "https://openapi.kujiale.com";
const KJL_IFRAME_BASE_URL = "https://www.kujiale.com/v/auth";

// Helper to generate KJL API Signature
function generateSignature(appKey: string, appSecret: string, appUid: string) {
    const timestamp = Date.now().toString();
    const raw = appSecret + appKey + appUid + timestamp;
    const sign = createHash("md5").update(raw, "utf8").digest("hex");
    return { sign, timestamp };
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

// 2. Design List (Fetches from KJL API)
export const designList = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const { start = 0, num = 10 } = request.data as any;

    const profilesSnapshot = await admin.firestore().collection("user_profiles").where("userId", "==", request.auth.uid).limit(1).get();
    if (profilesSnapshot.empty) {
        throw new HttpsError("failed-precondition", "APP_UID not configured");
    }

    const appUid = profilesSnapshot.docs[0].data().kjl_app_uid;
    const appKey = process.env.KJL_APP_KEY || "";
    const appSecret = process.env.KJL_APP_SECRET || "";

    const { sign, timestamp } = generateSignature(appKey, appSecret, appUid);

    const params = new URLSearchParams({
        timestamp,
        appkey: appKey,
        sign,
        appuid: appUid,
        start: String(start),
        num: String(num),
    });

    try {
        const response = await fetch(`${KJL_URL}/v2/design/list?${params.toString()}`);
        if (!response.ok) throw new Error("KJL API failed");
        return await response.json();
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 3. Delete Design (Proxies KJL deletion)
export const deleteDesign = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const { designid } = request.data as any;
    if (!designid) {
        throw new HttpsError("invalid-argument", "designid required");
    }

    const profilesSnapshot = await admin.firestore().collection("user_profiles").where("userId", "==", request.auth.uid).limit(1).get();
    if (profilesSnapshot.empty) {
        throw new HttpsError("failed-precondition", "APP_UID not configured");
    }
    const appUid = profilesSnapshot.docs[0].data().kjl_app_uid;
    const appKey = process.env.KJL_APP_KEY || "";
    const appSecret = process.env.KJL_APP_SECRET || "";

    const { sign, timestamp } = generateSignature(appKey, appSecret, appUid);

    const params = new URLSearchParams({
        timestamp,
        appkey: appKey,
        sign,
        appuid: appUid,
        plan_id: String(designid),
    });

    try {
        const response = await fetch(`${KJL_URL}/v2/design/deletion?${params.toString()}`, { method: "POST" });
        if (!response.ok) throw new Error("KJL API failed");
        return await response.json();
    } catch (err) {
        throw new HttpsError("internal", (err as Error).message);
    }
});

// 4. Exchange Token (User SSO)
export const exchangeToken = onCall(async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "User must be logged in.");

    const profilesSnapshot = await admin.firestore().collection("user_profiles").where("userId", "==", request.auth.uid).limit(1).get();
    if (profilesSnapshot.empty) {
        throw new HttpsError("failed-precondition", "APP_UID not configured");
    }
    const appUid = profilesSnapshot.docs[0].data().kjl_app_uid;
    const appKey = process.env.KJL_APP_KEY || "";
    const appSecret = process.env.KJL_APP_SECRET || "";

    const { sign, timestamp } = generateSignature(appKey, appSecret, appUid);

    const params = new URLSearchParams({
        timestamp,
        appkey: appKey,
        sign,
        appuid: appUid,
        dest: "5",
    });

    try {
        const response = await fetch(`${KJL_URL}/v2/sso/token?${params.toString()}`, { method: "POST" });
        if (!response.ok) throw new Error("SSO failed");

        const result = await response.json();
        const token = result?.d;

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

    const iframeUrl = `${KJL_IFRAME_BASE_URL}?accesstoken=${encodeURIComponent(accessToken)}&dest=${dest}`;

    return { iframeUrl };
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

        // 2. Register Kujiale Account
        const appKey = process.env.KJL_APP_KEY || "";
        const appSecret = process.env.KJL_APP_SECRET || "";
        const { sign, timestamp } = generateSignature(appKey, appSecret, newUid);

        const params = new URLSearchParams({
            timestamp,
            appkey: appKey,
            sign,
            appuid: newUid
        });

        const kjlResponse = await fetch(`${KJL_URL}/v2/register?${params.toString()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                name: name || email.split("@")[0],
                email: email,
                type: 0 // merchant sub-account
            })
        });

        if (!kjlResponse.ok) {
            console.error("KJL Registration failed HTTP status:", kjlResponse.status);
            // Optionally decide if we should delete the firebase user here
        }

        const kjlData = await kjlResponse.json();
        console.log("KJL Registration response:", kjlData);

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
