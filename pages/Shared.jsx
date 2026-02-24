import { useCallback, useEffect, useRef } from "react";

// const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;
const appBaseUrl = 'http://localhost:5173';

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
        <iframe
            ref={iframeRef}
            title="Kujiale"
            style={{ width: "100vw", height: "100vh", border: "none" }}
            sandbox="allow-scripts allow-forms allow-same-origin"
            referrerPolicy="no-referrer"
        />
    )
}

export default Shared