import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createHash } from "node:crypto";

const KJL_URL = "https://openapi.kujiale.com";
const API_PATH = "/v2/design/deletion";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

/* ---------- Signature (MD5 using WebCrypto) ---------- */
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

/* ---------- Edge Function ---------- */
Deno.serve(async (req) => {
  const { method, url } = req;

  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const u = new URL(url);
    const designId = u.searchParams.get("dsignid")

    if (!designId) {
      return new Response("Invalid designid", {
        status: 400,
        headers: corsHeaders,
      });
    }

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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("kjl_app_uid")
      .eq("id", user.id)
      .single();

    if (!profile?.kjl_app_uid || profileError) {
      return new Response("APP_UID not configured for user", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const APP_UID = profile.kjl_app_uid;
    const APP_KEY = Deno.env.get("KJL_APP_KEY")!;
    const APP_SECRET = Deno.env.get("KJL_APP_SECRET")!;

    const { sign, timestamp } = await generateSignature(APP_KEY, APP_SECRET, APP_UID);

    const params = new URLSearchParams({
      timestamp,
      appkey: APP_KEY,
      sign,
      appuid: APP_UID,
      plan_id: designId
    });

    const response = await fetch(`${KJL_URL}${API_PATH}?${params.toString()}`, {
      method: "POST",
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error("KJL API Error:", rawText);
      return new Response("KuJiaLe API failed", {
        status: 502,
        headers: corsHeaders,
      });
    }

    const result = JSON.parse(rawText);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
