import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Upload, 
  Send, 
  Clock, 
  CheckCircle,
  MessageSquare,
  ArrowLeft,
  Paperclip,
  User,
  Shield,
  Calendar,
  Tag,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Timer,
  History,
  BarChart2,
  Users,
  FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  attachments?: { name: string; url: string }[];
  avatar?: string;
}

interface ProjectFile {
  id: string;
  name: string;
  uploadedBy: string;
  type: string;
  size: string;
  date: string;
  url: string;
  isAdmin: boolean;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with actual data fetching
  const project = {
    id: id,
    name: 'Grade Update Request',
    status: 'in-progress',
    description: 'Update semester grades for Class 10B',
    serviceType: 'Grade Updates',
    createdAt: '2024-03-15',
    priority: 'high'
  };
  
  const messages: Message[] = [
    {
      id: '1',
      sender: 'Admin',
      content: 'Your request has been received and is being processed.',
      timestamp: '2024-03-15 10:30 AM',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '2',
      sender: 'Teacher',
      content: 'Thank you for the update. When can I expect this to be completed?',
      timestamp: '2024-03-15 11:15 AM',
      attachments: [
        { name: 'screenshot.png', url: '#' }
      ],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  const files: ProjectFile[] = [
    {
      id: '1',
      name: 'Updated_Records.pdf',
      uploadedBy: 'Admin',
      type: 'PDF',
      size: '2.4 MB',
      date: '2024-03-15',
      url: '#',
      isAdmin: true
    },
    {
      id: '2',
      name: 'Grade_Sheet.xlsx',
      uploadedBy: 'Teacher',
      type: 'Excel',
      size: '1.8 MB',
      date: '2024-03-15',
      url: '#',
      isAdmin: false
    }
  ];

  // Mock timeline data
  const timeline = [
    {
      id: 1,
      status: 'Submitted',
      date: '2024-03-15 09:00 AM',
      description: 'Request submitted successfully',
      icon: FileCheck,
      color: 'green'
    },
    {
      id: 2,
      status: 'Under Review',
      date: '2024-03-15 10:30 AM',
      description: 'Request is being reviewed by admin team',
      icon: Users,
      color: 'blue'
    },
    {
      id: 3,
      status: 'In Progress',
      date: '2024-03-15 11:15 AM',
      description: 'Processing your request',
      icon: Timer,
      color: 'yellow'
    }
  ];

  // Mock statistics
  const stats = [
    { label: 'Time Elapsed', value: '2h 15m', icon: Clock },
    { label: 'Messages', value: '5', icon: MessageSquare },
    { label: 'Files', value: '3', icon: FileCheck },
    { label: 'Updates', value: '2', icon: History }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add message handling logic here
    toast.success('Message sent');
    setNewMessage('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Add file upload handling logic here
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      toast.success('File uploaded successfully');
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="group inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Projects
          </button>

          {/* Project Header */}
          <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
            <div className="flex flex-col space-y-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900 sm:text-2xl break-words">
                    {project.name}
                  </h1>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-medium ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {project.status === 'completed' ? (
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                    ) : (
                      <Clock className="mr-1.5 h-4 w-4" />
                    )}
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 break-words">
                  Request ID: {project.id}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-700">{project.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Tag className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-700">{project.priority} Priority</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-700 break-words">
                    {project.serviceType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Timeline */}
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
              <h2 className="flex items-center text-lg font-medium text-gray-900">
                <History className="mr-2 h-5 w-5 text-gray-400" />
                Request Timeline
              </h2>
              <div className="mt-6 flow-root">
                <ul className="-mb-8">
                  {timeline.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== timeline.length - 1 ? (
                          <span
                            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-${event.color}-50`}
                            >
                              <event.icon className={`h-5 w-5 text-${event.color}-600`} />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{event.status}</p>
                              <p className="mt-0.5 text-sm text-gray-500">{event.description}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              {event.date}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Statistics */}
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
              <h2 className="flex items-center text-lg font-medium text-gray-900">
                <BarChart2 className="mr-2 h-5 w-5 text-gray-400" />
                Request Statistics
              </h2>
              <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6"
                  >
                    <dt>
                      <div className="absolute rounded-md bg-blue-500 p-3">
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="ml-16 truncate text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>
                    </dt>
                    <dd className="ml-16 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Messages Section */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
            <div className="flex h-[calc(100vh-24rem)] flex-col">
              {/* Messages Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <h2 className="flex items-center text-lg font-medium text-gray-900">
                  <MessageSquare className="mr-2 h-5 w-5 text-gray-400 shrink-0" />
                  Messages
                </h2>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'Teacher' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] sm:max-w-[75%] ${
                        message.sender === 'Teacher' ? 'flex-row-reverse' : 'flex-row'
                      } items-end space-x-2`}
                    >
                      <img
                        className="h-8 w-8 rounded-full ring-2 ring-white"
                        src={message.avatar}
                        alt={message.sender}
                      />
                      <div
                        className={`space-y-1 ${
                          message.sender === 'Teacher' ? 'mr-2' : 'ml-2'
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.sender === 'Teacher'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-900/5'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center rounded-lg px-2 py-1 text-sm ${
                                    message.sender === 'Teacher'
                                      ? 'bg-blue-400 text-white'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  <Paperclip className="mr-1.5 h-3.5 w-3.5" />
                                  <span className="truncate max-w-[150px]">
                                    {attachment.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="block w-full resize-none rounded-lg border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <div className="flex shrink-0 items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="rounded-full bg-blue-500 p-2 text-white shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={() => {}}
                  />
                </form>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Section */}
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center text-lg font-medium text-gray-900">
                  <Upload className="mr-2 h-5 w-5 text-gray-400" />
                  Upload Files
                </h2>
              </div>

              <div
                className={`relative rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm font-medium text-gray-900">
                    Drop files here or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
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

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Your Uploads</h3>
                <div className="space-y-3">
                  {files.filter((f) => !f.isAdmin).map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center min-w-0 space-x-3">
                        <div className="shrink-0 rounded-full bg-blue-50 p-2">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.type} • {file.size} • {file.date}
                          </p>
                        </div>
                      </div>
                      <button className="ml-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center text-lg font-medium text-gray-900">
                  <Download className="mr-2 h-5 w-5 text-gray-400" />
                  Available Files
                </h2>
              </div>

              <div className="space-y-4">
                {files.filter((f) => f.isAdmin).map((file) => (
                  <div
                    key={file.id}
                    className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center min-w-0 space-x-3">
                      <div className="shrink-0 rounded-full bg-blue-50 p-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.type} • {file.size} • {file.date}
                        </p>
                      </div>
                    </div>
                    <button className="ml-4 inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors duration-200">
                      <Download className="mr-1.5 h-4 w-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}