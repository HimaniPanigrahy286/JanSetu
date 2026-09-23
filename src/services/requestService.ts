import type {
  CitizenRequest,
  Category,
  RequestStatus,
  AIAnalysis,
  OfficialResponse,
  PriorityLevel,
} from '../types';
import { MOCK_REQUESTS } from '../data/mockData';

const STORAGE_KEY = 'jansetu_requests_store';

function loadRequests(): CitizenRequest[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REQUESTS));
    return [...MOCK_REQUESTS];
  }
  try {
    return JSON.parse(raw) as CitizenRequest[];
  } catch {
    return [...MOCK_REQUESTS];
  }
}

function saveRequests(requests: CitizenRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export const requestService = {
  getAll(): CitizenRequest[] {
    return loadRequests();
  },

  getByUserId(userId: string): CitizenRequest[] {
    return loadRequests().filter(r => r.userId === userId);
  },

  getById(id: string): CitizenRequest | undefined {
    return loadRequests().find(r => r.id === id);
  },

  create(
    userId: string,
    category: Category,
    description: string,
    location: string,
    language: string,
    imageUrl: string | undefined,
    aiAnalysis: AIAnalysis,
    isVoice?: boolean,
    voiceTranscription?: string,
    priority?: PriorityLevel,
    coordinates?: { lat: number; lng: number }
  ): CitizenRequest {
    const requests = loadRequests();
    const newRequest: CitizenRequest = {
      id: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName: 'Priya Sharma',
      category,
      description,
      location,
      coordinates,
      language,
      imageUrl,
      status: 'pending',
      priority: priority || (aiAnalysis.severity === 'critical' || aiAnalysis.severity === 'high' ? 'high' : 'medium'),
      affectedCount: Math.floor(2500 + Math.random() * 12000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiAnalysis,
      isVoice,
      voiceTranscription,
    };
    requests.unshift(newRequest);
    saveRequests(requests);
    return newRequest;
  },

  updateStatus(id: string, newStatus: RequestStatus, officialResponse?: OfficialResponse): CitizenRequest | null {
    const requests = loadRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return null;

    requests[idx] = {
      ...requests[idx],
      status: newStatus,
      updatedAt: new Date().toISOString(),
      officialResponse: officialResponse || requests[idx].officialResponse,
    };

    saveRequests(requests);
    return requests[idx];
  },

  getStats(userId?: string) {
    const all = userId ? loadRequests().filter(r => r.userId === userId) : loadRequests();
    return {
      total: all.length,
      pending: all.filter(r => r.status === 'pending').length,
      underReview: all.filter(r => r.status === 'under_review').length,
      inProgress: all.filter(r => r.status === 'in_progress').length,
      resolved: all.filter(r => r.status === 'resolved').length,
      rejected: all.filter(r => r.status === 'rejected').length,
    };
  },

  reset(): void {
    saveRequests([...MOCK_REQUESTS]);
  },
};
