import React, { useRef, useState } from "react";

interface ImageUploaderProps {
  onImageSelected?: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  // const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    onImageSelected?.(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onImageSelected?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`w-full h-40 border-2 rounded flex items-center justify-center cursor-pointer transition
                    ${isDragging ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-400"}`}
      >
        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover max-w-36 max-h-36 rounded"
            />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2"
            >
              ✕
            </button>
          </div>
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
