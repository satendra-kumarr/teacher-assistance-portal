import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Clock, CheckCircle, AlertTriangle, Calendar, Tag } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { debounce } from 'lodash';

export default function ProjectList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const { data: projects, isLoading } = useProjects({
    status: selectedFilter || undefined,
    search: searchTerm || undefined,
  });

  const filters = [
    { label: 'All', value: null },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' }
  ];

  const handleNewProject = () => {
    navigate('/services');
  };

  const handleProjectSelect = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    debouncedSearch(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track your project requests</p>
        </div>
        <button 
          onClick={handleNewProject}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {filters.map(filter => (
            <button
              key={filter.value ?? 'all'}
              onClick={() => setSelectedFilter(filter.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                selectedFilter === filter.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.data.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectSelect(project.id)}
            className="group relative flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all duration-200 hover:shadow-md hover:ring-blue-500 focus:outline-none"
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {project.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                {project.status === 'in-progress' && <Clock className="mr-1 h-3 w-3" />}
                {project.status === 'pending' && <AlertTriangle className="mr-1 h-3 w-3" />}
                {project.status}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {project.name}
            </h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                {new Date(project.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Tag className="mr-1 h-3.5 w-3.5" />
                {project.category}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
          </button>
        ))}
      </div>

      {(!projects?.data || projects.data.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
    </div>
  );
}