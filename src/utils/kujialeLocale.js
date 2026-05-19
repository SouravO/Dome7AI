import { KJL_LOCALE_BY_LANG } from "../components/GoogleTranslate";

/** Append locale hints to Kujiale iframe URL (best-effort; may require in-app language switch). */
export const appendKujialeLocaleParams = (url, langCode) => {
  const locale = KJL_LOCALE_BY_LANG[langCode] ?? "en_US";
  url.searchParams.set("locale", locale);
  url.searchParams.set("lang", locale);
  url.searchParams.set("qh-locale", locale);
  url.searchParams.set("language", locale);
  return url;
};

export const KJL_LOCALE_GUIDE_KEY = "dome7-kjl-locale-guide-dismissed";
