import { supabase } from "./supabaseClient";

/** Palauttaa Set(note_id) käyttäjän suosikeista */
export async function getFavoritesSet() {
  const { data, error } = await supabase
    .from("favorites")
    .select("note_id");  

  if (error) throw error;
  return new Set((data || []).map(r => r.note_id));
}

/** Lisää suosikin (idempotentti) */
export async function addFavorite(noteId) {
  const { error } = await supabase
    .from("favorites")
    .upsert({ note_id: noteId }, { onConflict: "note_id" });
  if (error) throw error;
}

/** Poistaa suosikin */
export async function removeFavorite(noteId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("note_id", noteId);  
  if (error) throw error;
}

/** Yhdellä funktiolla on/off */
export async function toggleFavorite(noteId, nextIsFav) {
  if (nextIsFav) return addFavorite(noteId);
  return removeFavorite(noteId);
}

 
