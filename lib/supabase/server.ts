// import { cookies } from "next/headers";
// import { createServerClient } from "@supabase/ssr";
// import type { Database } from "./types";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const createServerSupabaseClient = () => {
//   const cookieStore = cookies();

//   return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
//     cookies: {
//       getAll: async () => {
//         return (await cookieStore)
//           .getAll()
//           .map(({ name, value }) => ({ name, value }));
//       },
//       setAll: async (cookiesToSet) => {
//         for (const { name, value, options } of cookiesToSet) {
//           (await cookieStore).set(name, value, options);
//         }
//       },
//     },
//   });
// };

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createServerSupabaseClient = () =>
  createServerComponentClient({ cookies });
