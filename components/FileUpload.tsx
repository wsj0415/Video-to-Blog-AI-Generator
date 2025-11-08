
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { VideoIcon } from './icons/VideoIcon';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, disabled }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      onFileChange(file);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label
        htmlFor="video-upload"
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-brand-secondary bg-blue-900/50' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={handleClick}
      >
        {!videoSrc ? (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">MP4, MOV, AVI, or other video formats</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-4 overflow-hidden">
            <video
              src={videoSrc}
              controls
              className="max-h-full max-w-full rounded-md object-contain"
              onClick={(e) => e.stopPropagation()} // Prevent click from re-opening file dialog
            />
          </div>
        )}
        <input
          ref={fileInputRef}
          id="video-upload"
          type="file"
          className="hidden"
          accept="video/*"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled}
        />
      </label>
      {fileName && (
        <div className="flex items-center mt-4 p-3 bg-gray-800 rounded-lg text-sm">
          <VideoIcon className="w-5 h-5 mr-3 text-brand-secondary" />
          <span className="truncate">{fileName}</span>
        </div>
      )}
    </div>
  );
};
   