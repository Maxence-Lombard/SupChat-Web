import "./ImageUploaderOnlySelect.css";
import React, { useEffect, useRef, useState } from "react";

interface ImageUploaderProps {
  onImageSelected?: (file: File) => void;
  imageUrl: string;
  onPreviewUrlChange: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  imageUrl,
  onPreviewUrlChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const [, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected?.(file);
      onPreviewUrlChange(url);
    }
  };
  const handleClick = () => fileInputRef.current?.click();

  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
    }
  }, [imageUrl]);

  return (
    <div className="flex items-center gap-4">
      <div onClick={handleClick} className="container w-fit">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="object-cover w-32 h-32 rounded"
          />
        ) : (
          <div className="text-center">
            <i
              className="pi pi-file-import text-4xl"
              style={{ color: "var(--main-color-500)" }}
            ></i>
            <p style={{ color: "var(--main-color-500)" }}> Import your file </p>
            <p className="text-sm text-black/50"> Click to upload </p>
          </div>
        )}
        <div className="overlay">
          <i className="pi pi-pencil text-3xl text-white"></i>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUploader;
