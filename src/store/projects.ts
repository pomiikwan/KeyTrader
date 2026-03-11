import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DealType, NodeStatus } from '@/types';

/**
 * 项目（对接）数据结构
 */
export interface Project {
  id: string;
  user_id: string;
  type: DealType;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  location: string;
  tags: string[];
  status: NodeStatus;

  // 项目相关字段
  industry?: string;
  stage?: string;
  use_of_funds?: string;
  timeline?: string;

  // 资金相关字段
  investment_stage?: string;
  investment_areas?: string;
  singleInvestment_range?: string;

  // 贸易相关字段
  trade_category?: string;
  trade_type?: string;
  commodity_type?: string;

  // 元数据
  isFeatured?: boolean;
  isUrgent?: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 项目 Store
 */
interface ProjectsStore {
  // 状态
  projects: Project[];
  selectedProject: Project | null;
  filter: {
    type?: DealType;
    status?: NodeStatus;
  };

  // 操作方法
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;

  // 查询方法
  getProjectById: (id: string) => Project | undefined;
  getProjectsByUser: (userId: string) => Project[];
}

/**
 * 生成项目ID
 */
function generateId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 模拟用户项目数据
 */
const mockUserProjects: Project[] = [
  {
    id: 'proj_my_001',
    user_id: 'user_001',
    type: DealType.PROJECT,
    title: '智能工厂自动化改造',
    description: '传统制造企业智能化改造，寻求战略投资者和产业基金支持，预计投资3000万元',
    budget_min: 25000000,
    budget_max: 35000000,
    location: '广东省深圳市',
    tags: ['智能制造', '工业4.0', '自动化'],
    status: NodeStatus.PENDING,
    industry: '制造业',
    stage: 'A轮',
    use_of_funds: '设备70% + 系统30%',
    timeline: '2026年内完成',
    isFeatured: true,
    isUrgent: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * 创建项目 Store
 */
export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      projects: mockUserProjects,
      selectedProject: null,
      filter: {},

      // 添加项目
      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: NodeStatus.PENDING,
        };

        set((state) => ({
          projects: [newProject, ...state.projects],
        }));
      },

      // 更新项目
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((proj) =>
            proj.id === id
              ? { ...proj, ...updates, updated_at: new Date().toISOString() }
              : proj
          ),
        }));

        // 更新选中的项目
        const { selectedProject } = get();
        if (selectedProject?.id === id) {
          set({
            selectedProject: {
              ...selectedProject,
              ...updates,
              updated_at: new Date().toISOString(),
            },
          });
        }
      },

      // 删除项目
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((proj) => proj.id !== id),
          selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        }));
      },

      // 选中项目
      selectProject: (id) => {
        const project = id ? get().projects.find((p) => p.id === id) || null : null;
        set({ selectedProject: project });
      },

      // 根据ID获取项目
      getProjectById: (id) => {
        return get().projects.find((proj) => proj.id === id);
      },

      // 根据用户ID获取项目
      getProjectsByUser: (userId) => {
        return get().projects.filter((proj) => proj.user_id === userId);
      },
    }),
    {
      name: 'projects-storage',
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);

/**
 * 便捷 hooks
 */
export const useProjects = () => useProjectsStore((state) => state.projects);
export const useSelectedProject = () => useProjectsStore((state) => state.selectedProject);
