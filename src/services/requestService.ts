import type { CitizenRequest, Category, Severity, AIAnalysis } from '../types';
import { MOCK_REQUESTS } from '../data/mockData';

const STORAGE_KEY = 'ngb_requests';

function loadRequests(): CitizenRequest[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...MOCK_REQUESTS];
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
    voiceTranscription?: string
  ): CitizenRequest {
    const requests = loadRequests();
    const newRequest: CitizenRequest = {
      id: `req-${Date.now()}`,
      userId,
      category,
      description,
      location,
      language,
      imageUrl,
      status: 'pending',
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

  getStats(userId: string) {
    const all = loadRequests().filter(r => r.userId === userId);
    return {
      total: all.length,
      pending: all.filter(r => r.status === 'pending').length,
      underReview: all.filter(r => r.status === 'under_review').length,
      inProgress: all.filter(r => r.status === 'in_progress').length,
      resolved: all.filter(r => r.status === 'resolved').length,
    };
  },

  reset(): void {
    saveRequests([...MOCK_REQUESTS]);
  },
};
