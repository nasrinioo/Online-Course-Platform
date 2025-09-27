const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: { "x-my-custom-header": "my-app-name" },
  },
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await supabase.auth.signOut();
});

process.on("SIGINT", async () => {
  await supabase.auth.signOut();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await supabase.auth.signOut();
  process.exit(0);
});

module.exports = supabase;
