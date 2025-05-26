import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  onImageSelected?: (file: File) => void;
  imageUrl: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  imageUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onImageSelected?.(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="flex items-center gap-4">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        className="w-32 h-32 cursor-pointer rounded"
      >
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
              style={{ color: "var(--primary-color)" }}
            ></i>
            <p style={{ color: "var(--primary-color)" }}> Import your file </p>
            <p className="text-sm text-black/50"> Drag or click to upload </p>
          </div>
        )}
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
