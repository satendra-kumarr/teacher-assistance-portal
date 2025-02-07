import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../hooks/useProjects';
import { 
  BookOpen, 
  UserPlus, 
  Calendar, 
  FileSpreadsheet, 
  GraduationCap, 
  FileEdit,
  ArrowRight,
  X,
  Upload,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  File
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  type: 'image' | 'document';
  preview?: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  priority: 'normal' | 'medium' | 'high';
  details: {
    studentName?: string;
    class?: string;
    subject?: string;
    academicYear?: string;
    requestReason?: string;
  };
}

const services = [
  {
    id: 1,
    name: 'Grade Updates',
    description: 'Update student grades and academic records',
    icon: BookOpen,
    color: 'blue',
    category: 'Academic'
  },
  {
    id: 2,
    name: 'Student Registration',
    description: 'New student enrollment and registration',
    icon: UserPlus,
    color: 'green',
    category: 'Administrative'
  },
  {
    id: 3,
    name: 'Attendance Records',
    description: 'Modify attendance records and reports',
    icon: Calendar,
    color: 'purple',
    category: 'Administrative'
  },
  {
    id: 4,
    name: 'Report Cards',
    description: 'Generate and update student report cards',
    icon: FileSpreadsheet,
    color: 'yellow',
    category: 'Academic'
  },
  {
    id: 5,
    name: 'Course Changes',
    description: 'Subject and course modification requests',
    icon: GraduationCap,
    color: 'pink',
    category: 'Academic'
  },
  {
    id: 6,
    name: 'Custom Request',
    description: 'Submit a custom data change request',
    icon: FileEdit,
    color: 'indigo',
    category: 'Other'
  }
];

export default function ServicesList() {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    priority: 'normal',
    details: {}
  });
  const [dragActive, setDragActive] = useState<'image' | 'document' | null>(null);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const documentInputRef = React.useRef<HTMLInputElement>(null);

  const handleServiceSelect = (service: typeof services[0]) => {
    setSelectedService(service);
    setFormData({
      name: `New ${service.name} Request`,
      description: '',
      priority: 'normal',
      details: {}
    });
    setShowModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const detailName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [detailName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      const result = await createProject.mutateAsync({
        name: formData.name,
        description: `${formData.description}\n\nDetails:\n${Object.entries(formData.details)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}\n\nFiles:\n${uploads.map(u => u.file.name).join('\n')}`,
        service_type: selectedService.name,
        priority: formData.priority,
        category: selectedService.category
      });
      
      toast.success('Project created successfully');
      navigate(`/projects/${result.id}`);
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our Services</h2>
        <p className="mt-2 text-gray-600">Select a service to submit your request</p>
      </div>
      
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            disabled={createProject.isPending}
            className="group relative flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-md ring-1 ring-gray-900/5 transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start space-x-4">
              <div className={`shrink-0 rounded-lg bg-${service.color}-50 p-3 transition-colors duration-200 group-hover:bg-${service.color}-100`}>
                <service.icon className={`h-6 w-6 text-${service.color}-600`} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {service.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{service.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <span className="flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Select Service
                <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
          </button>
        ))}
      </div>

      {/* Service Request Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setShowModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${selectedService.color}-100 sm:mx-0 sm:h-10 sm:w-10`}>
                  <selectedService.icon className={`h-6 w-6 text-${selectedService.color}-600`} />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    New {selectedService.name} Request
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Please provide the details for your {selectedService.name.toLowerCase()} request.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Request Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    placeholder="Please describe your request..."
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Dynamic fields based on service type */}
                {selectedService.category === 'Academic' && (
                  <>
                    <div>
                      <label htmlFor="details.studentName" className="block text-sm font-medium text-gray-700">
                        Student Name
                      </label>
                      <input
                        type="text"
                        id="details.studentName"
                        name="details.studentName"
                        value={formData.details.studentName || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="details.class" className="block text-sm font-medium text-gray-700">
                        Class/Grade
                      </label>
                      <input
                        type="text"
                        id="details.class"
                        name="details.class"
                        value={formData.details.class || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="details.subject" className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="details.subject"
                        name="details.subject"
                        value={formData.details.subject || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}

                {selectedService.category === 'Administrative' && (
                  <>
                    <div>
                      <label htmlFor="details.academicYear" className="block text-sm font-medium text-gray-700">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        id="details.academicYear"
                        name="details.academicYear"
                        value={formData.details.academicYear || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="details.requestReason" className="block text-sm font-medium text-gray-700">
                        Reason for Request
                      </label>
                      <input
                        type="text"
                        id="details.requestReason"
                        name="details.requestReason"
                        value={formData.details.requestReason || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
                )}

                {/* File Upload Sections */}
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

                <div className="mt-6 flex items-center space-x-2 text-sm">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-600">
                    Your request will be processed by our admin team.
                  </span>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createProject.isPending}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {createProject.isPending ? 'Creating...' : 'Create Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}