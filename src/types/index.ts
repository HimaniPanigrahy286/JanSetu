export type Role = 'citizen' | 'official';

export type RequestStatus = 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type PriorityLevel = 'high' | 'medium' | 'low';

export type Category =
  | 'Roads'
  | 'Water'
  | 'Streetlights'
  | 'Drainage'
  | 'Public Transport'
  | 'Schools & Hospitals'
  | 'Electricity'
  | 'Sanitation'
  | 'Digital Infrastructure'
  | 'Other Development';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  location: string;
  language: string;
  avatar?: string;
  phone?: string;
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
  duplicateClusterCount?: number;
}

export interface OfficialResponse {
  message: string;
  updatedAt: string;
  officialName: string;
  officialRole?: string;
  estimatedResolution?: string;
}

export interface CitizenRequest {
  id: string;
  userId: string;
  userName?: string;
  category: Category;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  language: string;
  imageUrl?: string;
  status: RequestStatus;
  priority?: PriorityLevel;
  affectedCount?: number;
  createdAt: string;
  updatedAt: string;
  aiAnalysis: AIAnalysis;
  isVoice?: boolean;
  voiceTranscription?: string;
  officialResponse?: OfficialResponse;
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
  topCategory?: Category;
  resolvedCount?: number;
}

export interface Hotspot {
  id: string;
  name: string;
  region: string;
  category: Category;
  requestCount: number;
  affectedPopulation: number;
  priority: PriorityLevel;
  lat: number;
  lng: number;
  radius: number; // in meters for map visualizer
  severityScore: number;
  trend: string;
  summary: string;
}

export interface Project {
  id: string;
  title: string;
  category: Category;
  region: string;
  status: 'proposed' | 'planning' | 'in_progress' | 'completed' | 'on_hold';
  budget: number;
  startDate: string;
  completionDate: string;
  requestsAddressed: number;
  affectedPopulation?: number;
  priority?: PriorityLevel;
  estimatedImpact?: 'High' | 'Medium' | 'Critical';
  progress?: number;
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
  priorityLevel?: PriorityLevel;
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
  status?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
}
