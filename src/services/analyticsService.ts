import {
  MOCK_REGIONS,
  MOCK_HOTSPOTS,
  ANALYTICS_REQUESTS_OVER_TIME,
  ANALYTICS_BY_CATEGORY,
  ANALYTICS_SEVERITY,
} from '../data/mockData';
import type { Region, Hotspot } from '../types';

export const analyticsService = {
  getRegions(): Region[] {
    return MOCK_REGIONS;
  },

  getRegionById(id: string): Region | undefined {
    return MOCK_REGIONS.find(r => r.id === id);
  },

  getRegionsByCountry(country: string): Region[] {
    if (country === 'All') return MOCK_REGIONS;
    return MOCK_REGIONS.filter(r => r.country === country);
  },

  getOverviewStats() {
    return {
      totalRequests: 12458,
      pendingRequests: 4231,
      inProgressRequests: 2335,
      resolvedRequests: 5892,
      highPriorityAreas: 27,
      infrastructureGap: 67,
      serviceLevelRate: 76.5,
      feedbackRating: 4.6,
      citizensBenefited: 24580,
      projectsCompleted: 36,
    };
  },

  getRequestsOverTime() {
    return ANALYTICS_REQUESTS_OVER_TIME;
  },

  getByCategory() {
    return ANALYTICS_BY_CATEGORY;
  },

  getSeverityDistribution() {
    return ANALYTICS_SEVERITY;
  },

  getHotspots(): Hotspot[] {
    return MOCK_HOTSPOTS;
  },

  getHotspotById(id: string): Hotspot | undefined {
    return MOCK_HOTSPOTS.find(h => h.id === id);
  },

  getCountries(): string[] {
    const set = new Set(MOCK_REGIONS.map(r => r.country));
    return ['All', ...Array.from(set)];
  },
};
