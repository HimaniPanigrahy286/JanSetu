export type Role = 'citizen' | 'official';

export type RequestStatus = 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Category =
  | 'Roads'
  | 'Water'
  | 'Electricity'
  | 'Healthcare'
  | 'Education'
  | 'Transport'
  | 'Sanitation'
  | 'Digital Infrastructure'
  | 'Public Facilities';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  location: string;
  language: string;
  avatar?: string;
}

export interface AIAnalysis {
  detectedLanguage: string;
  originalText: string;
  translatedText: string;
  category: Category;
  subcategory: string;
  severity: Severity;
  summary: string;
  confidence: number;
  keywords: string[];
}

export interface CitizenRequest {
  id: string;
  userId: string;
  category: Category;
  description: string;
  location: string;
  language: string;
  imageUrl?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  aiAnalysis: AIAnalysis;
  isVoice?: boolean;
  voiceTranscription?: string;
}

export interface Region {
  id: string;
  name: string;
  country: string;
  population: number;
  populationDensity: number;
  infrastructureIndex: number;
  roadCoverage: number;
  healthcareFacilities: number;
  educationFacilities: number;
  waterAccess: number;
  digitalConnectivity: number;
  publicInvestment: number;
  citizenDemand: number;
  requestCount: number;
  infrastructureGap: number;
  populationImpact: number;
  investmentGap: number;
  priorityScore: number;
  lat: number;
  lng: number;
}

export interface Project {
  id: string;
  title: string;
  category: Category;
  region: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  budget: number;
  startDate: string;
  completionDate: string;
  requestsAddressed: number;
  description: string;
  beforeRequests?: number;
  afterRequests?: number;
  beforeScore?: number;
  afterScore?: number;
}

export interface AIRecommendation {
  id: string;
  region: string;
  detectedIssue: string;
  citizenRequests: number;
  affectedPopulation: number;
  infrastructureCondition: 'very_low' | 'low' | 'medium' | 'high';
  existingInvestment: number;
  priorityScore: number;
  recommendation: string;
  reasons: string[];
  category: Category;
}

export interface DataSource {
  id: string;
  name: string;
  description: string;
  type: string;
  lastUpdated: string;
  recordCount: number;
  icon: string;
}
