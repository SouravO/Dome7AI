import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../src/context/useAuth";
import {
  getStoredLanguage,
  KJL_LOCALE_BY_LANG,
  LANGUAGE_CHANGE_EVENT,
} from "../src/components/GoogleTranslate";
import KujialeIframeHeader from "../src/components/KujialeIframeHeader";
import {
  appendKujialeLocaleParams,
  KJL_LOCALE_GUIDE_KEY,
} from "../src/utils/kujialeLocale";
import {
  KUJIALE_IFRAME_ALLOW,
  KUJIALE_IFRAME_REFERRER_POLICY,
  KUJIALE_IFRAME_SANDBOX,
} from "../src/utils/kujialeIframe";

const KJL_ORIGINS = new Set([
  "https://www.kujiale.com",
  "https://yun.kujiale.com",
  "http://www.kujiale.com",
  "http://yun.kujiale.com",
]);

const isAllowedKjlOrigin = (origin) => {
  if (!origin) return false;
  return KJL_ORIGINS.has(origin);
};

const safeParseMessage = (payload) => {
  if (payload == null) return null;
  if (typeof payload === "object") return payload;

  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch {
      return { raw: payload };
    }
  }

  return null;
};

const Console = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [preferredLang, setPreferredLang] = useState(getStoredLanguage);
  const [showKjlGuide, setShowKjlGuide] = useState(
    () => localStorage.getItem(KJL_LOCALE_GUIDE_KEY) !== "1"
  );

  const dest = searchParams.get("dest");
  const designId = searchParams.get("designid");

  const iframeRef = useRef(null);
  const [designerUrl, setDesignerUrl] = useState(null);

  const openDesignerInNewTab = useCallback(() => {
    if (!designerUrl) return;
    window.open(designerUrl, "_blank", "noopener,noreferrer");
  }, [designerUrl]);

  useEffect(() => {
    const onLanguageChange = (e) => {
      const code = e.detail?.code ?? getStoredLanguage();
      setPreferredLang(code);
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, onLanguageChange);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, onLanguageChange);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!isAllowedKjlOrigin(event.origin)) return;

      const data = safeParseMessage(event.data);
      if (!data?.data) return;

      const eventName = data?.data?.eventName;
      const ownProps = data?.data?.ownProps;

      if (eventName === "appcoretopbarmenuitem") {
        if (ownProps?.action === "click" && ownProps?.logKey === "avatar-quit") {
          navigate("/my-projects");
        }
      }

      if (data?.action === "kjl_logout") {
        signOut();
        navigate("/login");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, signOut]);

  const getIframeUrl = useCallback(async () => {
    try {
      const { functions } = await import("../src/lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      const lang = getStoredLanguage();
      const kjlLocale = KJL_LOCALE_BY_LANG[lang] ?? "en_US";

      const exchangeToken = httpsCallable(functions, "exchangeToken");
      await exchangeToken();

      const iframeProxy = httpsCallable(functions, "iframeProxy");
      const { data } = await iframeProxy({ locale: kjlLocale });

      if (!data?.iframeUrl || !iframeRef.current) return;

      const url = appendKujialeLocaleParams(new URL(data.iframeUrl), lang);

      if (dest) url.searchParams.set("dest", dest);
      if (designId) url.searchParams.set("designid", designId);

      const finalUrl = url.toString();
      setDesignerUrl(finalUrl);
      iframeRef.current.src = finalUrl;
    } catch (error) {
      console.log("Iframe load error:", error);
    }
  }, [dest, designId]);

  useEffect(() => {
    getIframeUrl();
  }, [getIframeUrl, preferredLang]);

  const dismissGuide = () => {
    localStorage.setItem(KJL_LOCALE_GUIDE_KEY, "1");
    setShowKjlGuide(false);
  };

  return (
    <>
      <KujialeIframeHeader reloadOnChange={false} />

      {showKjlGuide && (
        <div
          role="dialog"
          aria-labelledby="kjl-locale-guide-title"
          className="fixed top-12 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-lg z-[70] rounded-xl border border-amber-500/30 bg-neutral-950/95 px-4 py-4 text-sm text-neutral-200 shadow-xl backdrop-blur-sm"
        >
          <p id="kjl-locale-guide-title" className="font-semibold text-white mb-2">
            Kujiale opens in Chinese by default
          </p>
          <p className="text-neutral-400 leading-relaxed mb-3">
            <strong className="text-neutral-200">Chrome, Edge, and Firefox do not translate
            cross-origin iframes</strong> — only the page around them. That is why browser
            translate and our language switcher do not affect this embedded designer.
          </p>
          <p className="text-neutral-400 leading-relaxed mb-3">
            <strong className="text-neutral-200">Option A — Browser translate:</strong> click{" "}
            <strong className="text-white">Open in new tab</strong> (top-left), then use your
            browser&apos;s translate prompt (e.g. Chrome address-bar translate icon).
          </p>
          <p className="text-neutral-400 leading-relaxed mb-3">
            <strong className="text-neutral-200">Option B — English in Kujiale:</strong> avatar
            → Preferences (偏好设置) → Language → English (saved for your account).
          </p>
          <p className="text-xs text-neutral-500 mb-3">
            Kujiale supports English, 中文, and 繁體 only — not Hindi, Tamil, Telugu, or Malayalam.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                openDesignerInNewTab();
                dismissGuide();
              }}
              disabled={!designerUrl}
              className="rounded-full bg-white text-black px-4 py-1.5 text-xs font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              Open in new tab
            </button>
            <button
              type="button"
              onClick={dismissGuide}
              className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        title="Kujiale"
        data-lenis-prevent
        style={{ width: "100vw", height: "100vh", border: "none" }}
        sandbox={KUJIALE_IFRAME_SANDBOX}
        allow={KUJIALE_IFRAME_ALLOW}
        referrerPolicy={KUJIALE_IFRAME_REFERRER_POLICY}
      />
    </>
  );
};

export default Console;
