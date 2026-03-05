import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type SubmitPayload = {
  name?: unknown;
  score?: unknown;
  elapsedMs?: unknown;
};

const NAME_REGEX = /^[A-Za-z0-9 _.-]{2,20}$/;
const MAX_SCORE = 100000;
const MAX_ELAPSED_MS = 24 * 60 * 60 * 1000;

function validatePayload(payload: SubmitPayload): { valid: true; name: string; score: number; elapsedMs: number | null } | { valid: false; message: string } {
  const rawName = typeof payload.name === "string" ? payload.name.trim().replace(/\s+/g, " ") : "";
  const score = typeof payload.score === "number" ? payload.score : Number(payload.score);
  const elapsedMsRaw = payload.elapsedMs;
  const elapsedMs = elapsedMsRaw === undefined || elapsedMsRaw === null ? null : (typeof elapsedMsRaw === "number" ? elapsedMsRaw : Number(elapsedMsRaw));

  if (!NAME_REGEX.test(rawName)) {
    return { valid: false, message: "Name format is invalid." };
  }
  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    return { valid: false, message: "Score is invalid." };
  }
  if (elapsedMs !== null && (!Number.isInteger(elapsedMs) || elapsedMs < 0 || elapsedMs > MAX_ELAPSED_MS)) {
    return { valid: false, message: "Elapsed time is invalid." };
  }

  return { valid: true, name: rawName, score, elapsedMs };
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const tableName = Deno.env.get("SNAKE_TABLE") || "snake";

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server is not configured." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: SubmitPayload;
  try {
    payload = await req.json();
  } catch (_err) {
    return new Response(JSON.stringify({ error: "Invalid JSON payload." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const validated = validatePayload(payload);
  if (!validated.valid) {
    return new Response(JSON.stringify({ error: validated.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const { error } = await adminClient
    .from(tableName)
    .insert({
      name: validated.name,
      score: validated.score,
      elapsed_ms: validated.elapsedMs,
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
