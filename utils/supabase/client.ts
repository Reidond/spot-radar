import { createClient } from "@supabase/supabase-js";
import { ofetch } from "ofetch";

const config = useRuntimeConfig();
export const supabase = createClient(config.supabase.url, config.supabase.key, {
  global: { fetch: ofetch.native.bind(globalThis) },
});
