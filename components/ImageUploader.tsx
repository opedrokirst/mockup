
import React, { useState, useCallback } from 'react';
import { UploadIcon, XCircleIcon } from './Icons';

interface UploadedFile {
  base64: string;
  mimeType: string;
  name: string;
}

interface ImageUploaderProps {
  onImageUpload: (file: UploadedFile) => void;
  onImageRemove: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onImageRemove }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setImagePreview(URL.createObjectURL(file));
        setFileName(file.name);
        const base64 = await fileToBase64(file);
        onImageUpload({ base64, mimeType: file.type, name: file.name });
      } else {
        alert('Por favor, envie apenas arquivos PNG ou JPG.');
      }
    }
  }, [onImageUpload]);

  const handleRemove = () => {
    setImagePreview(null);
    setFileName('');
    onImageRemove();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  if (imagePreview) {
    return (
      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label="Remover imagem"
        >
          <XCircleIcon className="h-6 w-6" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
          {fileName}
        </div>
      </div>
    );
  }

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Clique para enviar</span> ou arraste e solte
        </p>
        <p className="text-xs text-gray-500">PNG ou JPG</p>
      </div>
      <input type="file" className="hidden" accept="image/png,image/jpeg" onChange={(e) => handleFileChange(e.target.files)} />
    </label>
  );
};

export default ImageUploader;