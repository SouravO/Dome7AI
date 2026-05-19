import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "../lib/lenis";

const STORAGE_KEY = "dome7-preferred-lang";
const PAGE_LANGUAGE = "en";

export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "HI", name: "हिन्दी" },
  { code: "ta", label: "TA", name: "தமிழ்" },
  { code: "te", label: "TE", name: "తెలుగు" },
  { code: "ml", label: "ML", name: "മലയാളം" },
];

export const LANGUAGE_STORAGE_KEY = STORAGE_KEY;

export const getStoredLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  return "en";
};

/** Kujiale native locales (zh / en / zh-TW only — not Google Translate) */
export const KJL_LOCALE_BY_LANG = {
  en: "en_US",
  hi: "en_US",
  ta: "en_US",
  te: "en_US",
  ml: "en_US",
};

export const LANGUAGE_CHANGE_EVENT = "dome7-language-change";

const setGoogTransCookie = (lang) => {
  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");

  const value = lang === "en" ? "" : `/${PAGE_LANGUAGE}/${lang}`;
  const expires = "max-age=31536000";

  document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  if (!isLocalhost && hostname) {
    document.cookie = `googtrans=; path=/; domain=.${hostname.replace(/^www\./, "")}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  if (value) {
    document.cookie = `googtrans=${value}; path=/; ${expires}`;
    if (!isLocalhost && hostname) {
      document.cookie = `googtrans=${value}; path=/; domain=.${hostname.replace(/^www\./, "")}; ${expires}`;
    }
  }
};

export const applyLanguage = (lang, { reload = true } = {}) => {
  const code = LANGUAGES.some((l) => l.code === lang) ? lang : "en";
  localStorage.setItem(STORAGE_KEY, code);
  setGoogTransCookie(code);
  window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { code } }));

  const select = document.querySelector("select.goog-te-combo");
  if (select && select.value !== code) {
    select.value = code;
    select.dispatchEvent(new Event("change"));
  }

  if (reload) {
    window.setTimeout(() => window.location.reload(), 50);
  }
};

const GoogleTranslate = () => {
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.google?.translate?.TranslateElement) {
      setReady(true);
      return;
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: PAGE_LANGUAGE,
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
      setReady(true);
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const syncStoredLanguage = useCallback(() => {
    const lang = getStoredLanguage();
    if (lang === "en") return;

    const tryApply = (attempt = 0) => {
      const select = document.querySelector("select.goog-te-combo");
      if (select) {
        if (select.value !== lang) {
          select.value = lang;
          select.dispatchEvent(new Event("change"));
        }
        getLenis()?.resize();
        return;
      }
      if (attempt < 25) {
        window.setTimeout(() => tryApply(attempt + 1), 200);
      }
    };

    tryApply();
  }, []);

  useEffect(() => {
    if (!ready) return;
    syncStoredLanguage();
  }, [ready, location.pathname, syncStoredLanguage]);

  return (
    <div
      id="google_translate_element"
      className="google-translate-host"
      aria-hidden="true"
    />
  );
};

export default GoogleTranslate;

export const LanguageSwitcher = ({
  className = "",
  reloadOnChange = true,
  compact = false,
}) => {
  const [current, setCurrent] = useState(getStoredLanguage);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCurrent(getStoredLanguage());
  }, []);

  const selectLanguage = (code) => {
    if (code === current) {
      setOpen(false);
      return;
    }
    setCurrent(code);
    setOpen(false);
    applyLanguage(code, { reload: reloadOnChange });
  };

  const active = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          compact
            ? "flex items-center gap-1 rounded-full border border-white/25 bg-black/50 px-[0.525rem] py-[0.315rem] text-[0.525rem] font-medium text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            : "flex items-center gap-1.5 rounded-full border border-white/25 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        }
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <svg
          className={`${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} shrink-0 opacity-80`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{active.label}</span>
        <svg
          className={`${compact ? "h-2 w-2" : "h-3 w-3"} opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[59] cursor-default"
            aria-label="Close language menu"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            aria-label="Languages"
            className={`absolute right-0 top-full z-[61] mt-2 overflow-hidden rounded-xl border border-white/15 bg-neutral-950 py-1 shadow-xl ${
              compact ? "min-w-[98px] text-xs" : "min-w-[140px]"
            }`}
          >
            {LANGUAGES.map((lang) => (
              <li key={lang.code} role="option" aria-selected={current === lang.code}>
                <button
                  type="button"
                  onClick={() => selectLanguage(lang.code)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 ${
                    current === lang.code ? "text-white" : "text-neutral-400"
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-xs font-medium opacity-60">{lang.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

/** Fixed top-right switcher for routes without StaggeredMenu */
export const FixedLanguageSwitcher = () => {
  const location = useLocation();
  const noMenuRoutes = [
    "/admin",
    "/dashboard",
    "/user-management",
  ];
  const hide =
    noMenuRoutes.some((p) => location.pathname.startsWith(p)) ||
    location.pathname.startsWith("/shared") ||
    location.pathname.startsWith("/console");

  if (hide) return null;

  const hasStaggeredMenu =
    location.pathname === "/" ||
    [
      "/login",
      "/gallery",
      "/plans",
      "/my-account",
      "/my-projects",
      "/terms-and-conditions",
      "/cookie-policy",
    ].some(
      (p) => location.pathname === p || location.pathname.startsWith(`${p}/`),
    );

  if (hasStaggeredMenu) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] pointer-events-auto">
      <LanguageSwitcher />
    </div>
  );
};
