import { MOCK_PROJECTS } from '../data/mockData';
import type { Project, Category, PriorityLevel } from '../types';

const STORAGE_KEY = 'jansetu_projects_store';

function loadProjects(): Project[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROJECTS));
    return [...MOCK_PROJECTS];
  }
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [...MOCK_PROJECTS];
  }
}

function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export const projectService = {
  getAll(): Project[] {
    return loadProjects();
  },

  getById(id: string): Project | undefined {
    return loadProjects().find(p => p.id === id);
  },

  getByRegion(region: string): Project[] {
    return loadProjects().filter(p => p.region.toLowerCase().includes(region.toLowerCase()));
  },

  createProject(
    title: string,
    category: Category,
    region: string,
    budget: number,
    description: string,
    priority: PriorityLevel = 'high',
    requestsAddressed: number = 45,
    affectedPopulation: number = 8500
  ): Project {
    const projects = loadProjects();
    const newProject: Project = {
      id: `PRJ-2026-00${projects.length + 1}`,
      title,
      category,
      region,
      status: 'proposed',
      priority,
      budget,
      startDate: new Date().toISOString().split('T')[0],
      completionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requestsAddressed,
      affectedPopulation,
      estimatedImpact: 'High',
      progress: 5,
      description,
      beforeRequests: requestsAddressed,
      afterRequests: Math.round(requestsAddressed * 0.15),
      beforeScore: 35,
      afterScore: 82,
    };
    projects.unshift(newProject);
    saveProjects(projects);
    return newProject;
  },

  updateProjectStatus(id: string, status: Project['status'], progress?: number): Project | null {
    const projects = loadProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return null;

    projects[idx] = {
      ...projects[idx],
      status,
      progress: progress !== undefined ? progress : status === 'completed' ? 100 : status === 'in_progress' ? 60 : status === 'planning' ? 25 : 10,
    };

    saveProjects(projects);
    return projects[idx];
  },

  getStats() {
    const projects = loadProjects();
    return {
      total: projects.length,
      proposed: projects.filter(p => p.status === 'proposed').length,
      planning: projects.filter(p => p.status === 'planning').length,
      inProgress: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'on_hold').length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    };
  },
};
