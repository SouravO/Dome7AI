// Supabase Edge Runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const KJL_IFRAME_BASE_URL = "https://www.kujiale.com/v/auth";
const DEFAULT_DEST = "5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or http://localhost:5173
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  const {method} = req
  // This is needed if you're planning to invoke your function from a browser.
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1️⃣ Create Supabase client (JWT forwarded automatically)
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

    // 2️⃣ Ensure user is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (!user || authError) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 3️⃣ Get user's SSO token (1:1 mapping)
    const { data, error: tokenError } = await supabase
      .from("user_tokens")
      .select("open_api_token, token_expires_at")
      .eq("id", user.id)
      .single();

    if (!data || tokenError) {
      return new Response("SSO token not found", { status: 404 });
    }

    // 4️⃣ Optional expiry check
    if (
      data.token_expires_at &&
      new Date(data.token_expires_at) < new Date()
    ) {
      return new Response("SSO token expired", { status: 401 });
    }

    const accessToken = data.open_api_token;
    const dest = DEFAULT_DEST;

    // 5️⃣ Build KuJiaLe iframe URL (EXACT FORMAT YOU GAVE)
    const iframeUrl =
      `${KJL_IFRAME_BASE_URL}` +
      `?accesstoken=${encodeURIComponent(accessToken)}` +
      `&dest=${dest}`;

    // 6️⃣ Return to frontend
    return new Response(
      JSON.stringify({ iframeUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
