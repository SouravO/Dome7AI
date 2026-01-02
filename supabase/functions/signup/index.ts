// Supabase Edge Runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const body = await req.json();
    const { email, password, app_uid } = body;

    if (!email || !password || !app_uid) {
      return new Response(
        "email, password and app_uid are required",
        { status: 400 }
      );
    }

    // 1️⃣ Supabase admin client (no user JWT here)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 2️⃣ Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return new Response(
        authError?.message ?? "User creation failed",
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 3️⃣ Insert user profile with app_uid
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        id: userId,
        kjl_app_uid: app_uid,
      });

    if (profileError) {
      // rollback auth user if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        "Failed to create user profile",
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
