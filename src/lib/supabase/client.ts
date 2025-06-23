import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// for client components
export const createSupabaseClient = () => {
  return createClientComponentClient();
};

// for server components and api routes
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type Database = any; // you'll need to generate this type from your supabase schema
