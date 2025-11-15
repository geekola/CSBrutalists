import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AuthRequest {
  username: string;
  password: string;
}

// Simple password verification (in production, use proper bcrypt)
function verifyPassword(plain: string, hashed: string): boolean {
  // For simplicity, we're using a basic comparison
  // In production, use bcryptjs: https://deno.land/x/bcrypt
  return plain === hashed;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { username, password }: AuthRequest = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing credentials" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=*`,
      {
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: "Authentication failed" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const users: Array<{ id: string; username: string; password_hash: string; is_active: boolean }> = await response.json();

    if (users.length === 0 || !users[0].is_active) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const user = users[0];
    const passwordMatch = verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, username: user.username }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Authentication error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});