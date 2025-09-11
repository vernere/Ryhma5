import { supabase } from "./supabaseClient";

/** Palauttaa Set(note_id) käyttäjän suosikeista */
export async function getFavoritesSet(uid) {
  const { data, error } = await supabase
    .from("favorites")
    .select("note_id")
    .eq("user_id", uid);

  if (error) throw error;
  return new Set((data || []).map(r => r.note_id));
}

/** Lisää suosikin (idempotentti) */
export async function addFavorite(uid, noteId) {
  const { error } = await supabase
    .from("favorites")
    .upsert({ user_id: uid, note_id: noteId }, { onConflict: "user_id,note_id" });
  if (error) throw error;
}

/** Poistaa suosikin */
export async function removeFavorite(uid, noteId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", uid)
    .eq("note_id", noteId);
  if (error) throw error;
}

/** Yhdellä funktiolla on/off */
export async function toggleFavorite(uid, noteId, nextIsFav) {
  if (nextIsFav) return addFavorite(uid, noteId);
  return removeFavorite(uid, noteId);
}
