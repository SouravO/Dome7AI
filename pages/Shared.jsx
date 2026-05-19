import { useCallback, useEffect, useRef } from "react";
import KujialeIframeHeader from "../src/components/KujialeIframeHeader";
import {
  KUJIALE_IFRAME_ALLOW,
  KUJIALE_IFRAME_REFERRER_POLICY,
  KUJIALE_IFRAME_SANDBOX,
} from "../src/utils/kujialeIframe";

const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;

const Shared = () => {
    const iframeRef = useRef(null);

    const getIframeUrl = useCallback(async () => {
        try {
            
            if (!iframeRef.current) return;

            const currentUrl = window.location.href;

            const url = currentUrl.replace(
            `${appBaseUrl}/shared`,
            "https://www.kujiale.com"
            );
            
            iframeRef.current.src = url;
        } catch (error) {
            console.log("Iframe load error:", error);
        }
    }, []);

    useEffect(() => {
        getIframeUrl();
    }, [getIframeUrl]);

    return (
        <>
        <KujialeIframeHeader reloadOnChange={false} />
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
    )
}

export default Shared