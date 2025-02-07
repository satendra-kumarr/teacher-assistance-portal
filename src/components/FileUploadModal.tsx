import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Image as ImageIcon, File, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  type: 'image' | 'document';
  preview?: string;
}

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (files: File[]) => void;
}

export default function FileUploadModal({ isOpen, onClose, onUploadComplete }: FileUploadModalProps) {
  const [dragActive, setDragActive] = useState<'image' | 'document' | null>(null);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, type: 'image' | 'document') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, type: 'image' | 'document') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, type);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const files = Array.from(e.target.files || []);
    handleFiles(files, type);
    e.target.value = '';
  };

  const validateFile = (file: File, type: 'image' | 'document'): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return false;
    }

    if (type === 'image') {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
        return false;
      }
    } else {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid document (PDF, DOC, DOCX, XLS, XLSX)');
        return false;
      }
    }

    return true;
  };

  const handleFiles = async (files: File[], type: 'image' | 'document') => {
    const validFiles = files.filter(file => validateFile(file, type));
    
    const newUploads = await Promise.all(
      validFiles.map(async (file) => {
        let preview: string | undefined;
        
        if (type === 'image') {
          preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: 'uploading' as const,
          type,
          preview
        };
      })
    );

    setUploads(prev => [...prev, ...newUploads]);

    // Simulate file upload progress for each file
    newUploads.forEach(upload => {
      simulateFileUpload(upload.id);
    });
  };

  const simulateFileUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploads(prev =>
        prev.map(upload =>
          upload.id === fileId
            ? {
                ...upload,
                progress,
                status: progress === 100 ? 'complete' : 'uploading'
              }
            : upload
        )
      );
      if (progress === 100) {
        clearInterval(interval);
        toast.success('File uploaded successfully');
      }
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== fileId));
  };

  const handleComplete = () => {
    const completedFiles = uploads
      .filter(upload => upload.status === 'complete')
      .map(upload => upload.file);
    
    if (onUploadComplete) {
      onUploadComplete(completedFiles);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Upload Files
              </h3>
              <div className="mt-6 space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Images
                  </label>
                  <div
                    className={`relative rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${
                      dragActive === 'image'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={(e) => handleDrag(e, 'image')}
                    onDragLeave={(e) => handleDrag(e, 'image')}
                    onDragOver={(e) => handleDrag(e, 'image')}
                    onDrop={(e) => handleDrop(e, 'image')}
                  >
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileInput(e, 'image')}
                      accept="image/*"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-sm font-medium text-gray-900">
                        Drop images here or{' '}
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          browse
                        </button>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPEG, PNG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {uploads.filter(u => u.type === 'image').length > 0 && (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                      {uploads
                        .filter(upload => upload.type === 'image')
                        .map(upload => (
                          <div
                            key={upload.id}
                            className="group relative aspect-square rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
                          >
                            {upload.preview && (
                              <img
                                src={upload.preview}
                                alt={upload.file.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => removeFile(upload.id)}
                                className="rounded-full bg-white p-2 text-gray-500 hover:text-gray-700"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                            {upload.status === 'uploading' && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                <div
                                  className="h-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${upload.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Document Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Documents
                  </label>
                  <div
                    className={`relative rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${
                      dragActive === 'document'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={(e) => handleDrag(e, 'document')}
                    onDragLeave={(e) => handleDrag(e, 'document')}
                    onDragOver={(e) => handleDrag(e, 'document')}
                    onDrop={(e) => handleDrop(e, 'document')}
                  >
                    <input
                      ref={documentInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileInput(e, 'document')}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <File className="h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-sm font-medium text-gray-900">
                        Drop documents here or{' '}
                        <button
                          type="button"
                          onClick={() => documentInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          browse
                        </button>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC, DOCX, XLS, XLSX up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Document List */}
                  {uploads.filter(u => u.type === 'document').length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-200">
                      {uploads
                        .filter(upload => upload.type === 'document')
                        .map(upload => (
                          <div key={upload.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {upload.file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {upload.status === 'uploading' ? (
                                  <div className="w-24">
                                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                                      <div
                                        className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${upload.progress}%` }}
                                      />
                                    </div>
                                    <p className="mt-1 text-center text-xs text-gray-500">
                                      {upload.progress}%
                                    </p>
                                  </div>
                                ) : upload.status === 'complete' ? (
                                  <span className="text-sm font-medium text-green-600">
                                    Complete
                                  </span>
                                ) : (
                                  <span className="text-sm font-medium text-red-600">
                                    Error
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeFile(upload.id)}
                                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-600">
                    Files will be processed and attached to your request.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}