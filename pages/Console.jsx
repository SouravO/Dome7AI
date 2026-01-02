import { useEffect, useRef } from "react";
import { supabase } from "../src/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/useAuth";

const KJL_ORIGINS = [
  "https://www.kujiale.com",
  "https://yun.kujiale.com",
  "http://www.kujiale.com",
  "http://yun.kujiale.com"
];

const Console = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth()

  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // 1️⃣ Validate origin
    //   if (!KJL_ORIGINS.includes(event.origin)) return;

      console.log("Message:", event.data);
      event.preventDefault()

      // 2️⃣ Parse message (sometimes stringified JSON)
      let data;
      try {
        data =
          typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data;
      } catch {
        console.warn("Invalid message format");
        return;
      }

      // 3️⃣ Handle Kujiale actions
      if (data.type === "OPEN_URL") {
        // 🔥 Prevent new tab — load inside iframe
        iframeRef.current.src = data.url;
      }

      if (data?.action === "kjl_logout") {
        console.log("User logged out");
        signOut()
        navigate('/login')
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate, signOut]);

  const getIframeUrl = async () => {
    try {
      // await supabase.functions.invoke("signup", {
      //   body: JSON.stringify({
      //     email: 'dome7ai@gmail.com',
      //     password: 'password',
      //     app_uid: 'ARM02'
      //   })
      // });

      await supabase.functions.invoke("exchange-token");
      const { data } = await supabase.functions.invoke("iframe-proxy");
      if (!data.iframeUrl || !iframeRef.current) return;

      iframeRef.current.src = data.iframeUrl
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getIframeUrl()
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Kujiale"
      style={{ width: "100vw", height: "100vh", border: "none" }}
      sandbox="allow-scripts allow-forms allow-same-origin"
      referrerPolicy="no-referrer"
    />
  );
}

export default Console