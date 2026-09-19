import { MOCK_PROJECTS } from '../data/mockData';
import type { Project } from '../types';

export const projectService = {
  getAll(): Project[] {
    return MOCK_PROJECTS;
  },

  getById(id: string): Project | undefined {
    return MOCK_PROJECTS.find(p => p.id === id);
  },

  getByRegion(region: string): Project[] {
    return MOCK_PROJECTS.filter(p => p.region === region);
  },

  getStats() {
    return {
      total: MOCK_PROJECTS.length,
      planning: MOCK_PROJECTS.filter(p => p.status === 'planning').length,
      inProgress: MOCK_PROJECTS.filter(p => p.status === 'in_progress').length,
      completed: MOCK_PROJECTS.filter(p => p.status === 'completed').length,
      onHold: MOCK_PROJECTS.filter(p => p.status === 'on_hold').length,
      totalBudget: MOCK_PROJECTS.reduce((sum, p) => sum + p.budget, 0),
    };
  },
};
