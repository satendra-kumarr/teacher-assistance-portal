import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/api';
import toast from 'react-hot-toast';

// Dummy data for development
const dummyProjects = [
  {
    id: '1',
    name: 'Grade Update Request',
    description: 'Update semester grades for Class 10B',
    status: 'in-progress',
    priority: 'high',
    service_type: 'Grade Updates',
    category: 'Academic',
    created_at: '2024-03-15T10:00:00Z',
    user_id: 1
  },
  {
    id: '2',
    name: 'New Student Registration',
    description: 'Process registration for transfer student',
    status: 'pending',
    priority: 'normal',
    service_type: 'Student Registration',
    category: 'Administrative',
    created_at: '2024-03-14T15:30:00Z',
    user_id: 1
  },
  {
    id: '3',
    name: 'Attendance Record Update',
    description: 'Modify attendance records for February',
    status: 'completed',
    priority: 'normal',
    service_type: 'Attendance Records',
    category: 'Administrative',
    created_at: '2024-03-13T09:15:00Z',
    user_id: 1
  }
];

export function useProjects(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => {
      // For development, return dummy data
      const filteredProjects = dummyProjects.filter(project => {
        if (params?.status && project.status !== params.status) {
          return false;
        }
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          return (
            project.name.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });

      return Promise.resolve({
        data: filteredProjects,
        meta: { total: filteredProjects.length }
      });
    },
    staleTime: 1000, // Keep data fresh for 1 second
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      service_type: string;
      priority: string;
      category: string;
    }) => {
      // For development, create a new project with dummy data
      const newProject = {
        id: String(Date.now()),
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
        user_id: 1
      };

      dummyProjects.unshift(newProject);
      return Promise.resolve(newProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: () => {
      toast.error('Failed to create project');
    }
  });
}

export function useProjectMessages(projectId: string) {
  return useQuery({
    queryKey: ['project-messages', projectId],
    queryFn: () => userApi.getMessages(projectId),
    enabled: !!projectId,
  });
}

export function useSendMessage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => userApi.sendMessage(projectId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-messages', projectId] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}

export function useUploadFile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.uploadFile(projectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast.success('File uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload file');
    },
  });
}