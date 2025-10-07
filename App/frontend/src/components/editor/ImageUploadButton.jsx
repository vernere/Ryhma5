import { useRef } from 'react';
import { Image, Loader2 } from 'lucide-react';
import { useImagesStore } from '@/hooks/useImagesStore';
import { useNotesStore } from '@/hooks/useNotesStore';

function ImageUploadButton({ editor }) {
  const fileInputRef = useRef(null);
  const { uploadImage, uploading, error } = useImagesStore();
  const { selectedNoteId } = useNotesStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedNoteId) return;

    const result = await uploadImage(selectedNoteId, file);

    if (result) {
      editor
        .chain()
        .focus()
        .setImage({
          src: result.url,
          alt: file.name,
          filePath: result.path,
          annotations: [],
        })
        .run();
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={uploading || !selectedNoteId}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || !selectedNoteId}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="Upload image"
      >
        {uploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Image size={18} />
        )}
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-50 text-red-600 text-xs rounded shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}

export { ImageUploadButton };