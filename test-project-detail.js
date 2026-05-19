/**
 * Standalone test for Kujiale project-detail APIs (renders, videos, construction).
 * Mirrors functions/src/index.ts signature modes:
 *   - appkey:  MD5(secret + key + timestamp)     → renderpic, design/basic, archive
 *   - appuid:  MD5(secret + key + appuid + ts)  → albumdata, design/list, copy
 *
 * Usage:
 *   node test-project-detail.js
 *   node test-project-detail.js path/to/config.json
 *
 * Writes: test-project-detail-results.json
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KJL_URL = "https://openapi.kujiale.com";

const DEFAULT_CONFIG_PATH = path.join(__dirname, "test-project-detail-config.json");
const RESULTS_PATH = path.join(__dirname, "test-project-detail-results.json");

function loadConfig(configPath) {
  const raw = fs.readFileSync(configPath, "utf8");
  const cfg = JSON.parse(raw);
  if (!cfg.designId || !cfg.appKey || !cfg.appSecret || !cfg.appUid) {
    throw new Error("config must include designId, appKey, appSecret, appUid");
  }
  return cfg;
}

function signAppkey(appKey, appSecret) {
  const timestamp = Date.now().toString();
  const raw = appSecret + appKey + timestamp;
  const sign = crypto.createHash("md5").update(raw, "utf8").digest("hex");
  return { sign, timestamp };
}

function signAppuid(appKey, appSecret, appUid) {
  const timestamp = Date.now().toString();
  const raw = appSecret + appKey + appUid + timestamp;
  const sign = crypto.createHash("md5").update(raw, "utf8").digest("hex");
  return { sign, timestamp };
}

async function kjlRequest(cfg, { path: apiPath, query = {}, method = "GET", signMode = "appuid" }) {
  const { sign, timestamp } =
    signMode === "appkey"
      ? signAppkey(cfg.appKey, cfg.appSecret)
      : signAppuid(cfg.appKey, cfg.appSecret, cfg.appUid);

  const params = new URLSearchParams({
    timestamp,
    appkey: cfg.appKey,
    sign,
    appuid: cfg.appUid,
    ...query,
  });

  const url = `${KJL_URL}${apiPath}?${params.toString()}`;
  const headers = {};
  if (method === "POST") {
    headers["Content-Type"] = "application/json;charset=utf-8";
  }

  const response = await fetch(url, { method, headers });
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { _raw: text.slice(0, 500), _httpStatus: response.status };
  }

  return {
    ok: response.ok,
    httpStatus: response.status,
    url: url.replace(/sign=[^&]+/, "sign=***"),
    signMode,
    body,
  };
}

function isSuccess(body) {
  const c = body?.c;
  return c === "0" || c === 0;
}

function countRenders(body) {
  const d = body?.d;
  if (!d) return 0;
  const list = d.result ?? d.list ?? [];
  return Array.isArray(list) ? list.length : 0;
}

function countAlbum(body) {
  const list = body?.d?.albumDataOpenApiList;
  return Array.isArray(list) ? list.length : 0;
}

function countArchives(body) {
  const list = body?.d?.result;
  return Array.isArray(list) ? list.length : 0;
}

async function testDesignBasic(cfg) {
  const designId = cfg.designId;
  return kjlRequest(cfg, {
    path: `/v2/design/${encodeURIComponent(designId)}/basic/v2`,
    method: "GET",
    signMode: "appkey",
  });
}

async function testRenderPics(cfg, designId, start = 0) {
  return kjlRequest(cfg, {
    path: "/v2/renderpic/list/v2",
    method: "GET",
    signMode: "appkey",
    query: {
      design_id: designId,
      start: String(start),
      num: String(cfg.renderPageSize ?? 50),
      lang: cfg.lang ?? "en_US",
    },
  });
}

async function testAlbumData(cfg, designId, sceneTypeId, lastItemId = "") {
  const query = {
    design_id: designId,
    scene_type_id: String(sceneTypeId),
    num: String(cfg.albumPageSize ?? 20),
  };
  if (lastItemId) query.last_item_id = lastItemId;
  return kjlRequest(cfg, {
    path: "/v2/render/design/albumdata",
    method: "POST",
    signMode: "appuid",
    query,
  });
}

async function testArchiveList(cfg, designId) {
  return kjlRequest(cfg, {
    path: "/v2/archive/list",
    method: "GET",
    signMode: "appkey",
    query: {
      design_id: designId,
      start: "0",
      num: String(cfg.archiveNum ?? 10),
    },
  });
}

/** Wrong signature on purpose — helps debug empty UI. */
async function testRenderPicsWrongSign(cfg, designId) {
  return kjlRequest(cfg, {
    path: "/v2/renderpic/list/v2",
    method: "GET",
    signMode: "appuid",
    query: {
      design_id: designId,
      start: "0",
      num: "10",
      lang: cfg.lang ?? "en_US",
    },
  });
}

async function main() {
  const configPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : DEFAULT_CONFIG_PATH;

  const cfg = loadConfig(configPath);
  const designId = cfg.designId;
  const startedAt = new Date().toISOString();

  console.log(`\nKujiale project detail test — designId: ${designId}`);
  console.log(`Config: ${configPath}\n`);

  const results = {
    designId,
    startedAt,
    configPath,
    tests: {},
    summary: {},
  };

  // 1) Basic info
  console.log("1) GET design/basic/v2 (sign: appkey)…");
  const basic = await testDesignBasic(cfg);
  results.tests.designBasic = basic;
  const planId = basic.body?.d?.basicInfo?.planId;
  console.log(`   c=${basic.body?.c} m=${basic.body?.m || ""} planId=${planId || "—"}`);

  // 2) Renders — correct sign
  console.log("2) GET renderpic/list/v2 (sign: appkey)…");
  const renders = await testRenderPics(cfg, designId);
  results.tests.renderPicsAppkey = renders;
  const renderCount = countRenders(renders.body);
  console.log(`   c=${renders.body?.c} m=${renders.body?.m || ""} count=${renderCount} totalCount=${renders.body?.d?.totalCount ?? "—"}`);

  // 3) Renders with planId if different
  if (planId && planId !== designId) {
    console.log(`3) GET renderpic/list/v2 with planId ${planId}…`);
    const rendersPlan = await testRenderPics(cfg, planId);
    results.tests.renderPicsPlanId = rendersPlan;
    console.log(
      `   c=${rendersPlan.body?.c} count=${countRenders(rendersPlan.body)}`,
    );
  }

  // 4) Wrong sign (diagnostic)
  console.log("4) GET renderpic/list/v2 (sign: appuid — WRONG, expect sign error)…");
  const rendersWrong = await testRenderPicsWrongSign(cfg, designId);
  results.tests.renderPicsWrongSign = rendersWrong;
  console.log(`   c=${rendersWrong.body?.c} m=${rendersWrong.body?.m || ""}`);

  // 5) Album / videos per scene_type_id
  const sceneTypes = [
    { id: 0, label: "Still image" },
    { id: 1, label: "Growth animation" },
    { id: 2, label: "Roam video" },
    { id: 3, label: "Template video" },
    { id: 4, label: "One-click film" },
  ];
  results.tests.albumData = {};
  let videoTotal = 0;
  for (const scene of sceneTypes) {
    console.log(`5) POST albumdata scene_type_id=${scene.id} (${scene.label})…`);
    const album = await testAlbumData(cfg, designId, scene.id);
    const n = countAlbum(album.body);
    videoTotal += n;
    results.tests.albumData[String(scene.id)] = album;
    console.log(`   c=${album.body?.c} m=${album.body?.m || ""} items=${n}`);
  }

  // 6) Construction archives
  console.log("6) GET archive/list (sign: appkey)…");
  const archives = await testArchiveList(cfg, designId);
  results.tests.archiveList = archives;
  const archiveCount = countArchives(archives.body);
  console.log(`   c=${archives.body?.c} m=${archives.body?.m || ""} archives=${archiveCount}`);

  // Sample first render image URL if any
  const firstRender = renders.body?.d?.result?.[0];
  if (firstRender) {
    results.sampleRender = {
      picId: firstRender.picId,
      roomName: firstRender.roomName,
      img: firstRender.img,
      picType: firstRender.picType,
    };
  }

  results.summary = {
    designBasicOk: isSuccess(basic.body),
    renderCount,
    renderOk: isSuccess(renders.body),
    wrongSignFailed: !isSuccess(rendersWrong.body),
    albumItemsTotal: videoTotal,
    archiveCount,
    planId: planId || null,
    finishedAt: new Date().toISOString(),
  };

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2), "utf8");

  console.log("\n--- Summary ---");
  console.log(JSON.stringify(results.summary, null, 2));
  console.log(`\nFull responses saved to: ${RESULTS_PATH}\n`);

  if (!isSuccess(renders.body)) {
    console.error("FAIL: renderpic did not return c=0. Check signature (must be appkey).");
    process.exitCode = 1;
  } else if (renderCount === 0) {
    console.warn("WARN: API succeeded but zero renders — plan may have no images or wrong design_id.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
