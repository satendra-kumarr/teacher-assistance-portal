export interface RequestStatus {
  id: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  createdAt: string;
  description: string;
}

export interface Request {
  id: string;
  trackingId: string;
  teacherName: string;
  schoolName: string;
  description: string;
  priority: 'normal' | 'urgent';
  status: RequestStatus;
  attachmentUrl?: string;
  createdAt: string;
  category: string;
  serviceType: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdated: string;
}