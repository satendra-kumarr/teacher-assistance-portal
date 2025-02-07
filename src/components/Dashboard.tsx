import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Bell,
  BookOpen,
  UserPlus,
  Calendar,
  FileSpreadsheet,
  GraduationCap,
  FileEdit,
  ArrowRight
} from 'lucide-react';

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
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { name: 'Active Requests', value: '3', icon: Clock, color: 'blue' },
    { name: 'Completed', value: '12', icon: CheckCircle, color: 'green' },
    { name: 'Pending Review', value: '2', icon: AlertTriangle, color: 'yellow' },
  ];

  const recentProjects = [
    { id: '1', name: 'Student Grade Update', status: 'in-progress', date: '2024-03-15' },
    { id: '2', name: 'Class Transfer Request', status: 'pending', date: '2024-03-14' },
    { id: '3', name: 'Attendance Record Update', status: 'completed', date: '2024-03-13' },
  ];

  const handleServiceSelect = (serviceId: number) => {
    navigate('/services');
  };

  const handleProjectSelect = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5"
          >
            <div className="flex items-center">
              <div className={`rounded-md bg-${stat.color}-50 p-2`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">{stat.name}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h2 className="text-lg font-medium text-gray-900">Our Services</h2>
        <p className="mt-1 text-sm text-gray-500">Quick access to our most used services</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className="group relative overflow-hidden rounded-lg bg-white p-6 text-left shadow-sm ring-1 ring-gray-900/5 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-500"
            >
              <div className="flex items-start space-x-4">
                <div className={`shrink-0 rounded-lg bg-${service.color}-50 p-3`}>
                  <service.icon className={`h-6 w-6 text-${service.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Get Started
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => handleProjectSelect(project.id)}
                    className="block w-full py-4 transition-colors duration-150 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {project.name}
                        </p>
                        <p className="text-sm text-gray-500">{project.date}</p>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            project.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Notifications</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {/* Add notifications here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}