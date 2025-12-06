// TypeScript interfaces for Portfolio API Client

export interface ResumeData {
  user: User;
  experience: Experience[];
  skills_categories: SkillsCategories;
  github: GitHub;
  contact: Contact;
}

export interface User {
  name: string;
  role: string;
  avatar_url: string;
  location: string;
  summary: string;
  badges: string[];
  education: Education;
}

export interface Education {
  degree: string;
  college: string;
  year: string;
  cgpa: string;
}

export interface Experience {
  role: string;
  company: string;
  type: string;
  date: string;
  description: string;
}

export interface SkillsCategories {
  Languages: Skill[];
  Backend: Skill[];
  Frontend: Skill[];
  'Tools & DevOps': Skill[];
}

export interface Skill {
  name: string;
  percent: number;
  icon: string;
}

export interface Contact {
  email: string;
  linkedin: string;
  instagram: string;
  github: string;
}

export interface GitHub {
  username: string;
  repo_count: string;
  stats: GitHubStats;
  highlighted_projects: Project[];
}

export interface GitHubStats {
  languages: Language[];
}

export interface Language {
  name: string;
  percent: number;
  color: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  repo_url: string;
  demo_url: string | null;
  image?: string;
  endpoints?: Endpoint[];
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
}

export interface RequestConfig {
  id: string;
  label: string;
  method: 'GET' | 'POST';
  url: string;
  folder: string;
  type: 'profile' | 'github' | 'contact' | 'social' | 'ai';
  socialUrl?: string;
}
