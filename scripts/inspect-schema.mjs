/** @format */

// One-off helper to discover the actual Postgres schema behind the Supabase tables.
// Run: node scripts/inspect-schema.mjs
// It uses the anon key from .env to query the information_schema / pg_catalog
// through a lightweight RPC-free approach: fetching sample rows + checking column lists.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fallback: read .env manually (no dotenv dependency required)
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in environment. " +
      "Run with: node --env-file=.env scripts/inspect-schema.mjs",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function introspect(table) {
  const { data, error } = await supabase.from(table).select("*").limit(1);
  if (error) {
    return { table, error: error.message, columns: [] };
  }
  const columns = data && data.length ? Object.keys(data[0]) : [];
  return { table, columns, sample: data };
}

const tables = ["forms", "form_fields", "responses"];

for (const t of tables) {
  const result = await introspect(t);
  console.log(`\n== ${t} ==`);
  if (result.error) {
    console.log("ERROR:", result.error);
  } else {
    console.log("Columns:", result.columns.join(", "));
    if (result.sample?.length) {
      console.log("Sample row keys:", Object.keys(result.sample[0]));
      // Hide any secrets, just show shape
      const shape = {};
      for (const [k, v] of Object.entries(result.sample[0])) {
        shape[k] = typeof v;
      }
      console.log("Shape:", JSON.stringify(shape));
    }
  }
}
