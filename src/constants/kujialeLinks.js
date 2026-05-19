/** Kujiale SaaS account admin (opens in a new tab). */
export const KUJIALE_ACCOUNT_ADMIN_URL =
  "https://www.kujiale.com/pub/saas/admin/index?gs.nav.type=auto-site";

const KJL_WORKBENCH_BASE = "https://www.kujiale.com/pub/saas/workbench";

/** Public workbench plan detail URL (user may need to sign in on Kujiale). */
export const buildKujialeWorkbenchDetailUrl = (designId) => {
  const id = String(designId || "").trim();
  if (!id) return null;
  return `${KJL_WORKBENCH_BASE}/design/detail/${encodeURIComponent(id)}?gs.nav.type=auto-site`;
};
