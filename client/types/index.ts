export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  tags: string[];
  category: 'web' | 'data' | 'mobile' | 'ai' | 'other';
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  error?: string;
  errors?: Array<{ msg: string; path: string }>;
}

export interface HealthStatus {
  status: string;
  database: string;
  email: string;
  uptime: number;
}

export interface SiteStats {
  visitors: number;
  messages: number;
  projects: number;
}

export interface NavLink {
  label: string;
  href: string;
}
