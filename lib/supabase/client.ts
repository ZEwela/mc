// import { createBrowserClient } from "@supabase/ssr";
// import type { Database } from "./types";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const supabase = createBrowserClient<Database>(
//   supabaseUrl,
//   supabaseAnonKey
// );

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

export const supabase = createClientComponentClient<Database>();
