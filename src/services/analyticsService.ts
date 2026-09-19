import { MOCK_REGIONS, ANALYTICS_REQUESTS_OVER_TIME, ANALYTICS_BY_CATEGORY, ANALYTICS_SEVERITY } from '../data/mockData';
import type { Region } from '../types';

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
      highPriorityAreas: 27,
      infrastructureGap: 67,
      resolvedRequests: 4892,
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

  getHotspots() {
    return MOCK_REGIONS
      .slice(0, 6)
      .sort((a, b) => b.priorityScore - a.priorityScore);
  },

  getCountries(): string[] {
    const set = new Set(MOCK_REGIONS.map(r => r.country));
    return ['All', ...Array.from(set)];
  },
};
