import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

const BUCKET_NAME = "note-images";

export const useImagesStore = create((set, get) => ({
  uploading: false,
  error: null,

  uploadImage: async (noteId, file) => {
    if (!noteId || !file) {
      set({ error: "Note ID and file are required" });
      return null;
    }

    if (!file.type.startsWith("image/")) {
      set({ error: "File must be an image" });
      return null;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      set({ error: "Image must be less than 5MB" });
      return null;
    }

    set({ uploading: true, error: null });

    try {
      const fileExt = file.name.split(".").pop();
      const uuid = crypto.randomUUID();
      const fileName = `${uuid}.${fileExt}`;
      const filePath = `${noteId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      set({ uploading: false });
      return {
        url: urlData.publicUrl,
        path: filePath,
        fileName: fileName,
      };
    } catch (err) {
      set({ error: err.message, uploading: false });
      console.error("Failed to upload image:", err);
      return null;
    }
  },

  deleteImage: async (filePath) => {
    if (!filePath) return false;

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to delete image:", err);
      return false;
    }
  },

  deleteNoteImages: async (noteId) => {
    if (!noteId) return false;

    try {
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(noteId);

      if (listError) throw listError;

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${noteId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(filePaths);

        if (deleteError) throw deleteError;
      }

      return true;
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to delete note images:", err);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));