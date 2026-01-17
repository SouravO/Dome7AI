import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const Shared = () => {
    const iframeRef = useRef(null);
    const [searchParams] = useSearchParams();

    const designId = searchParams.get("designid");


    const getIframeUrl = useCallback(async () => {
        try {
            
            if (!designId || !iframeRef.current) return;
            
            const url = `https://www.kujiale.com/xiaoguotu/pano/${designId}`;

            iframeRef.current.src = url;
        } catch (error) {
            console.log("Iframe load error:", error);
        }
    }, [designId]);

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