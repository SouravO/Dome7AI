/** Prefer HTTPS for Kujiale CDN URLs (avoids mixed-content blocking on Dome7). */
export const ensureHttpsUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("//")) return `https:${url}`;
  return url.replace(/^http:\/\//i, "https://");
};

/** Common picDetailType labels from Kujiale doc 4100 appendix. */
export const PIC_DETAIL_LABELS = {
  0: "Standard",
  1: "Panorama",
  3: "Top view",
  327: "1K",
  328: "1K Top",
  329: "1K 4:3",
  331: "1K 3:4",
  333: "1K 1:1",
  580: "2K HD",
  581: "3K",
  582: "4K",
  583: "8K",
};

export const getPicQualityLabel = (picDetailType, picType) => {
  const detail = Number(picDetailType);
  if (PIC_DETAIL_LABELS[detail]) return PIC_DETAIL_LABELS[detail];
  if (Number(picType) === 1) return "Panorama";
  if (Number(picType) === 3) return "Top view";
  if (Number(picType) === 0) return "Render";
  return detail ? `Type ${detail}` : "Render";
};

const SCENE_TYPE_LABELS = {
  0: "Still image",
  1: "Growth animation",
  2: "Roam video",
  3: "Template video",
  4: "One-click film",
  5: "False color",
  6: "Koolight scene",
};

/** picType: 0 normal, 1 panorama, 3 top view — per doc 4100. */
export const normalizeRenderGalleryItems = (rawItems) => {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item, index) => {
      const rawUrl =
        item?.img ||
        item?.imgUrl ||
        item?.picUrl ||
        item?.url ||
        item?.smallImgUrl ||
        item?.thumbnail;

      const url = ensureHttpsUrl(rawUrl);
      if (!url || typeof url !== "string") return null;

      const picType = Number(item?.picType ?? 0);
      const picDetailType = item?.picDetailType ?? null;
      const isPano = picType === 1 || Boolean(item?.panoLink);
      const isTopview = picType === 3;
      const isStandard = picType === 0;

      return {
        id: String(item?.picId ?? item?.id ?? index),
        url,
        thumbUrl: ensureHttpsUrl(item?.smallImgUrl) || url,
        name: item?.roomName || getPicQualityLabel(picDetailType, picType),
        roomName: item?.roomName || null,
        picType,
        picDetailType,
        isPano,
        isTopview,
        isStandard,
        qualityLabel: getPicQualityLabel(picDetailType, picType),
        panoLink: item?.panoLink ? ensureHttpsUrl(item.panoLink) : null,
        created: item?.created ?? null,
        level: item?.level ?? null,
        favorite: Boolean(item?.favorite),
      };
    })
    .filter(Boolean);
};

export const normalizeAlbumGalleryItems = (rawItems) => {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item, index) => {
      const url = ensureHttpsUrl(item?.imgUrl || item?.smallImgUrl);
      const sceneType = Number(item?.renderPresentType ?? item?.snapshotType ?? 0);
      const label = SCENE_TYPE_LABELS[sceneType] || "Album item";
      const status = Number(item?.status ?? 1);
      const isComplete = status === 1;

      return {
        id: String(item?.picId ?? item?.snapshotId ?? item?.taskId ?? index),
        url: url || null,
        thumbUrl: ensureHttpsUrl(item?.smallImgUrl) || url,
        name: label,
        sceneType,
        created: item?.created ?? null,
        isVideo: sceneType === 2 || sceneType === 3 || sceneType === 4,
        status,
        isComplete,
        pending: !isComplete || !url,
      };
    })
    .filter(Boolean);
};

export const normalizeConstructionFiles = (rawItems) => {
  if (!Array.isArray(rawItems)) return [];

  const typeLabels = {
    1: "DXF",
    2: "JPG",
    3: "PDF",
    4: "ZIP",
    5: "JSON",
    6: "DWG",
  };

  return rawItems
    .map((item, index) => {
      const url = ensureHttpsUrl(item?.resourceUrl);
      if (!url || typeof url !== "string") return null;
      const type = Number(item?.type);
      return {
        id: String(item?.resourceId ?? index),
        url,
        thumbUrl: type === 2 ? url : null,
        name: item?.resourceName || typeLabels[type] || "Drawing",
        fileType: typeLabels[type] || "File",
        created: item?.created ?? null,
        isConstruction: true,
      };
    })
    .filter(Boolean);
};

/** Sidebar buckets aligned with Kujiale workbench (doc picType). */
export const countRenderSidebar = (items) => ({
  all: items.length,
  topview: items.filter((i) => i.isTopview).length,
  pano: items.filter((i) => i.isPano).length,
  standard: items.filter((i) => i.isStandard).length,
});

export const filterRenderSidebar = (items, key) => {
  if (key === "topview") return items.filter((i) => i.isTopview);
  if (key === "pano") return items.filter((i) => i.isPano);
  if (key === "standard") return items.filter((i) => i.isStandard);
  return items;
};

export const filterByPicType = (items, typeFilter) => {
  if (typeFilter === "pano") return items.filter((i) => i.isPano);
  if (typeFilter === "topview") return items.filter((i) => i.isTopview);
  if (typeFilter === "standard") return items.filter((i) => i.isStandard);
  return items;
};

export const pickCoverFromBasic = (basic, fallback) => {
  const info = basic?.basicInfo;
  return ensureHttpsUrl(info?.coverPic || info?.coverURL || fallback || null);
};

export const pickTitleFromBasic = (basic, fallback) => {
  const info = basic?.basicInfo;
  return info?.name || fallback || "Project";
};

export const formatProjectDate = (ms) => {
  if (!ms) return null;
  const n = Number(ms);
  if (Number.isNaN(n)) return null;
  return new Date(n).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeTime = (ms) => {
  if (!ms) return null;
  const n = Number(ms);
  if (Number.isNaN(n)) return null;
  const diff = Date.now() - n;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours} hr ago`;
  return formatProjectDate(ms);
};

const extensionFromUrl = (url) => {
  try {
    const path = new URL(url).pathname;
    const ext = path.split(".").pop()?.split("@")[0];
    if (ext && /^[a-z0-9]{2,5}$/i.test(ext)) return `.${ext.toLowerCase()}`;
  } catch {
    /* ignore */
  }
  return ".jpg";
};

const sanitizeFilename = (name) =>
  String(name || "download")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .trim() || "download";

const triggerBlobDownload = (blob, fileName) => {
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
};

/** Force file save — tries browser fetch, then Firebase proxy (CDN blocks direct <a download>). */
export const downloadUrl = async (url, filename = "download") => {
  if (!url) return;

  const base = sanitizeFilename(filename);
  const fileName = base.includes(".") ? base : `${base}${extensionFromUrl(url)}`;

  try {
    const response = await fetch(url, { referrerPolicy: "no-referrer" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    triggerBlobDownload(blob, fileName);
    return;
  } catch (err) {
    console.warn("Direct download failed, using proxy:", err);
  }

  try {
    const { functions } = await import("../lib/firebase");
    const { httpsCallable } = await import("firebase/functions");
    const proxy = httpsCallable(functions, "proxyAssetDownload");
    const { data } = await proxy({ url });
    if (!data?.base64) throw new Error("Empty proxy response");

    const binary = atob(data.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], {
      type: data.contentType || "application/octet-stream",
    });
    triggerBlobDownload(blob, fileName);
  } catch (err) {
    console.error("Proxy download failed:", err);
    throw new Error("Could not download file.");
  }
};
