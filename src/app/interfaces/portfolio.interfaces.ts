export interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  ariaLabel: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  website?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  outcomes: string[];
  image: string;
  images: string[];
  demoUrl?: string;
  sourceUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  externalUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  badge?: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  timezone: string;
  availability: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  resumeUrl: string;
  contact: ContactInfo;
  social: SocialLink[];
  seo: SEOData;
  rotatingKeywords: string[];
  rotateInterval: number;
  rotateMode: string;
  deliveryKeywords: string[]
}

export interface PortfolioData {
  personal: PersonalInfo;
  navigation: NavItem[];
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  blog: BlogPost[];
  certifications: Certification[];
}

export interface EmailFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: { [key: string]: string };
}

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';