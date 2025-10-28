// src/components/ImageUpload.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { FaUpload, FaTrash } from 'react-icons/fa';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  initialUrls?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, initialUrls = [] }) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialUrls);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('item-photos')
        .upload(fileName, file);

      if (error) {
        showErrorToast(`Failed to upload ${file.name}: ${error.message}`);
      } else if (data) {
        const { data: { publicUrl } } = supabase.storage.from('item-photos').getPublicUrl(data.path);
        if (publicUrl) {
          uploadedUrls.push(publicUrl);
        }
      }
    }

    const newUrls = [...imageUrls, ...uploadedUrls];
    setImageUrls(newUrls);
    onUpload(newUrls);
    setIsUploading(false);
    showSuccessToast('Images uploaded successfully!');
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const newUrls = imageUrls.filter(url => url !== urlToRemove);
    setImageUrls(newUrls);
    onUpload(newUrls);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-mine-shaft">Photos</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-silver-chalice border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <FaUpload className="mx-auto h-12 w-12 text-silver-chalice" />
          <div className="flex text-sm text-scorpion">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-salem hover:text-goblin focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-bay-leaf"
            >
              <span>Upload files</span>
              <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} disabled={isUploading} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-scorpion">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      {isUploading && <p className="text-sm text-scorpion mt-2">Uploading...</p>}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {imageUrls.map((url) => (
          <div key={url} className="relative w-24 h-24">
            <img src={url} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => handleRemoveImage(url)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700 transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
