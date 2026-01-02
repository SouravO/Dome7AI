import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash } from "node:crypto";

const KJL_URL = "https://openapi.kujiale.com";
const API_PATH = "/v2/sso/token";

/* ---------- MD5 helper ---------- */
// async function md5(input: string): Promise<string> {
//   const data = new TextEncoder().encode(input);
//   const hash = await crypto.subtle.digest("MD5", data);
//   return Array.from(new Uint8Array(hash))
//     .map(b => b.toString(16).padStart(2, "0"))
//     .join("");
// }

/* ---------- Signature ---------- */
async function generateSignature(
  appKey: string,
  appSecret: string,
  appUid: string
) {
  const timestamp = Date.now().toString();
  const raw = appSecret + appKey + appUid + timestamp;
  const sign = createHash("md5")
          .update(raw, "utf8")
          .digest("hex");
  return {
    sign,
    timestamp,
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or http://localhost:5173
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/* ---------- Edge Function ---------- */
Deno.serve(async (req) => {
  const { url, method } = req

  // This is needed if you're planning to invoke your function from a browser.
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization") ?? "",
          },
        },
      }
    );

    /* 1️⃣ Validate user */
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      return new Response("Unauthorized", { status: 401 });
    }

    /* 2️⃣ Load per-user APP_UID */
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("kjl_app_uid")
      .eq("id", user.id)
      .single();

    if (!profile || profileError) {
      return new Response("APP_UID not configured for user", { status: 400 });
    }

    const APP_UID = profile.kjl_app_uid;

    /* 3️⃣ Load global secrets */
    const APP_KEY = Deno.env.get("KJL_APP_KEY")!;
    const APP_SECRET = Deno.env.get("KJL_APP_SECRET")!;

    /* 4️⃣ Generate signature */
    const { sign, timestamp } = await generateSignature(
      APP_KEY,
      APP_SECRET,
      APP_UID
    );

    // /* 5️⃣ Call KuJiaLe SSO */
    const params = new URLSearchParams({
      timestamp,
      appkey: APP_KEY,
      sign,
      appuid: APP_UID,
      dest: "5",
    });

    const response = await fetch(
      `${KJL_URL}${API_PATH}?${params.toString()}`,
      { method: "POST" }
    );

    if (!response.ok) {
      return new Response("SSO failed", { status: 502 });
    }

    const result = await response.json();
    const token = result?.d;
    const expiresAt = null

    if (!token) {
      return new Response("Invalid SSO response", { status: 500 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! 
    );

    // /* 6️⃣ Store token (1:1) */
     const { data: pr, error: er } = await supabaseAdmin.from("user_tokens").upsert({
      id: user.id,
      open_api_token: token,
      token_expires_at: expiresAt,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
