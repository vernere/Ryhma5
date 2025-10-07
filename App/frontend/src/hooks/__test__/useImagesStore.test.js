import { test, expect, beforeEach, mock, describe, spyOn } from "bun:test";
import { useImagesStore } from "../useImagesStore";
import { mockSupabase } from "./constants";

mock.module("@/lib/supabaseClient", () => ({
  supabase: mockSupabase,
}));

global.crypto = {
  randomUUID: mock(() => "test-uuid-123"),
};

// Mock console.error to suppress error logs during tests
const consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  useImagesStore.setState({
    uploading: false,
    error: null,
  });

  mockSupabase.storage.from.mockClear();
  global.crypto.randomUUID.mockClear();
  consoleErrorSpy.mockClear();
});

describe("useImagesStore", () => {
  test("Initial state", () => {
    const { uploading, error } = useImagesStore.getState();
    
    expect(uploading).toBe(false);
    expect(error).toBe(null);
  });

  test("clearError clears the error state", () => {
    const { clearError } = useImagesStore.getState();
    
    useImagesStore.setState({ error: "Test error" });
    expect(useImagesStore.getState().error).toBe("Test error");
    
    clearError();
    expect(useImagesStore.getState().error).toBe(null);
  });

  describe("uploadImage", () => {
    test("rejects upload when noteId is missing", async () => {
      const { uploadImage } = useImagesStore.getState();
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      
      const result = await uploadImage(null, mockFile);
      
      expect(result).toBe(null);
      expect(useImagesStore.getState().error).toBe("Note ID and file are required");
    });

    test("rejects upload when file is missing", async () => {
      const { uploadImage } = useImagesStore.getState();
      
      const result = await uploadImage("note123", null);
      
      expect(result).toBe(null);
      expect(useImagesStore.getState().error).toBe("Note ID and file are required");
    });

    test("rejects non-image files", async () => {
      const { uploadImage } = useImagesStore.getState();
      const mockFile = new File(["test"], "test.txt", { type: "text/plain" });
      
      const result = await uploadImage("note123", mockFile);
      
      expect(result).toBe(null);
      expect(useImagesStore.getState().error).toBe("File must be an image");
    });

    test("rejects files larger than 5MB", async () => {
      const { uploadImage } = useImagesStore.getState();
      const largeMockFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", { 
        type: "image/jpeg" 
      });
      
      const result = await uploadImage("note123", largeMockFile);
      
      expect(result).toBe(null);
      expect(useImagesStore.getState().error).toBe("Image must be less than 5MB");
    });

    test("successfully uploads valid image", async () => {
      const { uploadImage } = useImagesStore.getState();
      const mockFile = new File(["test image data"], "test.jpg", { type: "image/jpeg" });
      
      const mockStorageRef = {
        upload: mock(() => Promise.resolve({ 
          data: { path: "note123/test-uuid-123.jpg" }, 
          error: null 
        })),
        getPublicUrl: mock(() => ({ 
          data: { publicUrl: "https://example.com/note123/test-uuid-123.jpg" } 
        })),
        remove: mock(),
        list: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await uploadImage("note123", mockFile);
      
      expect(result).toEqual({
        url: "https://example.com/note123/test-uuid-123.jpg",
        path: "note123/test-uuid-123.jpg",
        fileName: "test-uuid-123.jpg",
      });
      expect(useImagesStore.getState().uploading).toBe(false);
      expect(useImagesStore.getState().error).toBe(null);
      expect(mockSupabase.storage.from).toHaveBeenCalledWith("note-images");
    });

    test("sets uploading state during upload", async () => {
      const { uploadImage } = useImagesStore.getState();
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      
      const mockStorageRef = {
        upload: mock(() => new Promise(resolve => {
          expect(useImagesStore.getState().uploading).toBe(true);
          resolve({ data: { path: "test/path" }, error: null });
        })),
        getPublicUrl: mock(() => ({ 
          data: { publicUrl: "https://example.com/test" } 
        })),
        remove: mock(),
        list: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      await uploadImage("note123", mockFile);
      
      expect(useImagesStore.getState().uploading).toBe(false);
    });

    test("handles upload error", async () => {
      const { uploadImage } = useImagesStore.getState();
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      
      const mockStorageRef = {
        upload: mock(() => Promise.resolve({ 
          data: null, 
          error: new Error("Upload failed") 
        })),
        getPublicUrl: mock(),
        remove: mock(),
        list: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await uploadImage("note123", mockFile);
      
      expect(result).toBe(null);
      expect(useImagesStore.getState().error).toBe("Upload failed");
      expect(useImagesStore.getState().uploading).toBe(false);
    });
  });

  describe("deleteImage", () => {
    test("returns false when filePath is missing", async () => {
      const { deleteImage } = useImagesStore.getState();
      
      const result = await deleteImage(null);
      
      expect(result).toBe(false);
    });

    test("successfully deletes image", async () => {
      const { deleteImage } = useImagesStore.getState();
      
      const mockStorageRef = {
        upload: mock(),
        getPublicUrl: mock(),
        remove: mock(() => Promise.resolve({ error: null })),
        list: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await deleteImage("note123/test-image.jpg");
      
      expect(result).toBe(true);
      expect(mockStorageRef.remove).toHaveBeenCalledWith(["note123/test-image.jpg"]);
    });

    test("handles delete error", async () => {
      const { deleteImage } = useImagesStore.getState();
      
      const mockStorageRef = {
        upload: mock(),
        getPublicUrl: mock(),
        remove: mock(() => Promise.resolve({ error: new Error("Delete failed") })),
        list: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await deleteImage("note123/test-image.jpg");
      
      expect(result).toBe(false);
      expect(useImagesStore.getState().error).toBe("Delete failed");
    });
  });

  describe("deleteNoteImages", () => {
    test("returns false when noteId is missing", async () => {
      const { deleteNoteImages } = useImagesStore.getState();
      
      const result = await deleteNoteImages(null);
      
      expect(result).toBe(false);
    });

    test("successfully deletes all images for a note", async () => {
      const { deleteNoteImages } = useImagesStore.getState();
      
      const mockFiles = [
        { name: "image1.jpg" },
        { name: "image2.png" },
      ];
      
      const mockStorageRef = {
        upload: mock(),
        getPublicUrl: mock(),
        list: mock(() => Promise.resolve({ data: mockFiles, error: null })),
        remove: mock(() => Promise.resolve({ error: null })),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await deleteNoteImages("note123");
      
      expect(result).toBe(true);
      expect(mockStorageRef.list).toHaveBeenCalledWith("note123");
      expect(mockStorageRef.remove).toHaveBeenCalledWith([
        "note123/image1.jpg",
        "note123/image2.png",
      ]);
    });

    test("handles empty folder gracefully", async () => {
      const { deleteNoteImages } = useImagesStore.getState();
      
      const mockStorageRef = {
        upload: mock(),
        getPublicUrl: mock(),
        list: mock(() => Promise.resolve({ data: [], error: null })),
        remove: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await deleteNoteImages("note123");
      
      expect(result).toBe(true);
      expect(mockStorageRef.list).toHaveBeenCalledWith("note123");
      expect(mockStorageRef.remove).not.toHaveBeenCalled();
    });

    test("handles list error", async () => {
      const { deleteNoteImages } = useImagesStore.getState();
      
      const mockStorageRef = {
        upload: mock(),
        getPublicUrl: mock(),
        list: mock(() => Promise.resolve({ data: null, error: new Error("List failed") })),
        remove: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await deleteNoteImages("note123");
      
      expect(result).toBe(false);
      expect(useImagesStore.getState().error).toBe("List failed");
    });

    test("handles delete error", async () => {
      const { deleteNoteImages } = useImagesStore.getState();
      
      const mockFiles = [{ name: "image1.jpg" }];
      
      const mockStorageRef = {
        upload: mock(),
        getPublicUrl: mock(),
        list: mock(() => Promise.resolve({ data: mockFiles, error: null })),
        remove: mock(() => Promise.resolve({ error: new Error("Delete failed") })),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await deleteNoteImages("note123");
      
      expect(result).toBe(false);
      expect(useImagesStore.getState().error).toBe("Delete failed");
    });
  });

  describe("File extension handling", () => {
    test("preserves original file extension", async () => {
      const { uploadImage } = useImagesStore.getState();
      const mockFile = new File(["test"], "test.png", { type: "image/png" });
      
      const mockStorageRef = {
        upload: mock(() => Promise.resolve({ 
          data: { path: "note123/test-uuid-123.png" }, 
          error: null 
        })),
        getPublicUrl: mock(() => ({ 
          data: { publicUrl: "https://example.com/note123/test-uuid-123.png" } 
        })),
        remove: mock(),
        list: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await uploadImage("note123", mockFile);
      
      expect(result.fileName).toBe("test-uuid-123.png");
      expect(result.path).toBe("note123/test-uuid-123.png");
    });

    test("handles files without extension", async () => {
      const { uploadImage } = useImagesStore.getState();
      const mockFile = new File(["test"], "image", { type: "image/jpeg" });
      
      const mockStorageRef = {
        upload: mock(() => Promise.resolve({ 
          data: { path: "note123/test-uuid-123.image" }, 
          error: null 
        })),
        getPublicUrl: mock(() => ({ 
          data: { publicUrl: "https://example.com/note123/test-uuid-123.image" } 
        })),
        remove: mock(),
        list: mock(),
      };
      
      mockSupabase.storage.from.mockReturnValue(mockStorageRef);
      
      const result = await uploadImage("note123", mockFile);
      
      expect(result.fileName).toBe("test-uuid-123.image");
    });
  });
});