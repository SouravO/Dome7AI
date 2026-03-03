import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../src/context/useAuth";
import { Card } from "../src/components/ui/card";

const KJL_ORIGINS = new Set([
  "https://www.kujiale.com",
  "https://yun.kujiale.com",
  "http://www.kujiale.com",
  "http://yun.kujiale.com",
]);

// const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;

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
      // sometimes it’s just a string event, allow it if needed
      return { raw: payload };
    }
  }

  return null;
};

const Console = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchParams] = useSearchParams();

  const dest = searchParams.get("dest");
  const designId = searchParams.get("designid");

  const iframeRef = useRef(null);

  const loadInIframe = useCallback((nextUrl) => {
    if (!iframeRef.current) return;

    try {
      const urlObj = new URL(nextUrl);

      // OPTIONAL: enforce only kujiale domains
      // if (!urlObj.hostname.includes("kujiale.com")) return;

      iframeRef.current.src = urlObj.toString();
    } catch {
      console.warn("Invalid URL received:", nextUrl);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!isAllowedKjlOrigin(event.origin)) {
        // If you want to debug, uncomment:
        // console.log("Blocked message from:", event.origin, event.data);
        return;
      }

      const data = safeParseMessage(event.data);
      if (!data?.data) return;


      const eventName = data?.data?.eventName
      const ownProps = data?.data?.ownProps

      if (eventName === "appcoretopbarmenuitem") {
        if (ownProps?.action === "click" && ownProps?.logKey === "avatar-quit") {
          //navigate to mydesigns
          navigate("/my-projects");
        }
      }

      // console.log("KJL Message:", data);
      // console.log("EVENT TYPE:", data?.data?.eventName)
      // console.log("ACTION", ownProps?.action, ownProps?.Click)
      // console.log("OWN PROPS:", ownProps)
      // console.log("DEFAULT PROPS:", data?.data?.defaultProps)

      // if (data.type === "OPEN_URL" && data.url) {
      //   // Condition: block some URLs if needed
      //   const shouldBlock = String(data.url).includes("some-sensitive-page");

      //   if (shouldBlock) {
      //     console.log("Blocked OPEN_URL:", data.url);
      //     // custom action
      //     alert("This action is blocked!");
      //     return;
      //   }

      //   loadInIframe(data.url);
      //   return;
      // }
      // const fr = document.querySelectorAll('iframe')[0]
      // fr.addEventListener("click", (e) => console.log(e))
      // console.log(fr.querySelectorAll('#miniapp-playground-dock'), fr.onlick((e) => console.log(e)))

      // if (eventName === 'appcoretopbarmenuitem') {
      //   if (ownProps?.action === 'click') {
      //     if (ownProps?.logKey === "help-copyLink") {
      //       //
      //     }
      //   }
      // }

      // if (eventName === 'yunturender_newgallery_click') {
      //   if (ownProps?.Click === 'share') {
      //     console.log("Share Link", ownProps)
      //     const designId = ownProps?.picid[0]
      //       navigator.clipboard.writeText(`${appBaseUrl}?designid=${designId}`);
      //   }
      // }

      if (data?.action === "kjl_logout") {
        console.log("User logged out from Kujiale");

        signOut();
        navigate("/login");
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate, signOut, loadInIframe]);

  const getIframeUrl = useCallback(async () => {
    try {
      const { functions } = await import("../src/lib/firebase");
      const { httpsCallable } = await import("firebase/functions");

      const exchangeToken = httpsCallable(functions, 'exchangeToken');
      await exchangeToken();

      const iframeProxy = httpsCallable(functions, 'iframeProxy');
      const { data } = await iframeProxy();

      if (!data?.iframeUrl || !iframeRef.current) return;

      const url = new URL(data.iframeUrl);

      if (dest) url.searchParams.set("dest", dest);
      if (designId) url.searchParams.set("designid", designId);

      iframeRef.current.src = url.toString();
    } catch (error) {
      console.log("Iframe load error:", error);
    }
  }, [dest, designId]);

  useEffect(() => {
    getIframeUrl();
  }, [getIframeUrl]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title="Kujiale"
        style={{ width: "100vw", height: "100vh", border: "none" }}
        sandbox="allow-scripts allow-forms allow-same-origin"
        referrerPolicy="no-referrer"
      />
    </>
  );
};

export default Console;
