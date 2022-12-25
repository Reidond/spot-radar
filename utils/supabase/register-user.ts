import { supabase } from "./client";

export async function registerUser(spotifyId: string) {
  const { data, error } = await supabase
    .from("spotify_users")
    .insert([{ spotify_id: spotifyId }]);

  if (error) {
    return error;
  }

  return data;
}

export async function isUserRegistered(spotifyId: string) {
  const { data, error } = await supabase
    .from("spotify_users")
    .select()
    .eq("spotify_id", spotifyId);

  if (error) {
    return false;
  }

  return data.length > 0;
}
