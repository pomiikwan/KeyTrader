import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import type { ApiResponse } from '@/types';

// API 服务端口配置
const API_PORTS = {
  USER_SERVICE: 8001,
  PII_SERVICE: 8002,
  PROJECT_SERVICE: 8003,
  BENEFIT_SERVICE: 8004,
};

// 创建 API 客户端实例
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // 设置请求和响应拦截器
  private setupInterceptors() {
    // 请求拦截器 - 自动添加 token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 处理 token 刷新和错误
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Token 过期，尝试刷新
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // TODO: 实现 token 刷新逻辑
          // 目前暂时直接退出登录
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  // GET 请求
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, { params });
  }

  // POST 请求
  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data);
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.put(url, data);
  }

  // DELETE 请求
  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.client.delete(url);
  }

  // PATCH 请求
  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.patch(url, data);
  }
}

// 创建单例实例
export const apiClient = new ApiClient();

// ==================== API 服务 ====================

/**
 * 用户认证服务
 */
export const authService = {
  // 登录
  login: (phone_number: string, password: string) =>
    apiClient.post('/auth/login', { phone_number, password }),

  // 注册
  register: (data: {
    phone_number: string;
    password: string;
    invitation_code: string;
    role: string;
  }) => apiClient.post('/auth/register', data),

  // 刷新 token
  refreshToken: (refresh_token: string) =>
    apiClient.post('/auth/refresh', { refresh_token }),

  // 登出
  logout: () => apiClient.post('/auth/logout'),

  // 获取当前用户信息
  getCurrentUser: () => apiClient.get('/auth/me'),
};

/**
 * 用户服务
 */
export const userService = {
  // 获取用户详情
  getUserProfile: (userId: string) => apiClient.get(`/users/${userId}`),

  // 更新用户资料
  updateProfile: (userId: string, data: any) =>
    apiClient.put(`/users/${userId}`, data),

  // 获取虚拟身份列表
  getVirtualIdentities: () => apiClient.get('/users/identities'),

  // 创建虚拟身份
  createVirtualIdentity: (data: {
    display_name: string;
    avatar_url?: string;
  }) => apiClient.post('/users/identities', data),

  // 切换虚拟身份
  switchIdentity: (identityId: string) =>
    apiClient.post('/users/identities/switch', { identity_id: identityId }),
};

/**
 * 项目/对接服务
 */
export const projectService = {
  // 获取项目列表
  getProjects: (params?: {
    page?: number;
    page_size?: number;
    type?: string;
    status?: string;
  }) => apiClient.get('/projects', params),

  // 获取项目详情
  getProject: (projectId: string) => apiClient.get(`/projects/${projectId}`),

  // 创建项目
  createProject: (data: {
    type: string;
    title: string;
    description: string;
    budget?: number;
    location?: string;
    tags?: string[];
  }) => apiClient.post('/projects', data),

  // 更新项目
  updateProject: (projectId: string, data: any) =>
    apiClient.put(`/projects/${projectId}`, data),

  // 删除项目
  deleteProject: (projectId: string) =>
    apiClient.delete(`/projects/${projectId}`),

  // 归档项目
  archiveProject: (projectId: string) =>
    apiClient.post(`/projects/${projectId}/archive`),
};

/**
 * 节点服务（三方确认）
 */
export const nodeService = {
  // 获取节点列表
  getNodes: (params?: {
    project_id?: string;
    status?: string;
  }) => apiClient.get('/nodes', params),

  // 获取节点详情
  getNode: (nodeId: string) => apiClient.get(`/nodes/${nodeId}`),

  // 创建节点
  createNode: (data: {
    project_id: string;
    project_owner_id: string;
    introducer_id: string;
    capital_provider_id?: string;
  }) => apiClient.post('/nodes', data),

  // 确认节点
  confirmNode: (nodeId: string) =>
    apiClient.post(`/nodes/${nodeId}/confirm`),

  // 获取节点确认状态
  getNodeConfirmationStatus: (nodeId: string) =>
    apiClient.get(`/nodes/${nodeId}/confirmation-status`),
};

/**
 * 利益分配服务
 */
export const benefitService = {
  // 获取利益分配详情
  getBenefit: (projectId: string) =>
    apiClient.get(`/benefits/project/${projectId}`),

  // 创建利益分配
  createBenefit: (data: {
    project_id: string;
    introducer_ratio: number;
    platform_ratio: number;
  }) => apiClient.post('/benefits', data),

  // 更新分配比例
  updateBenefit: (benefitId: string, data: {
    introducer_ratio?: number;
    platform_ratio?: number;
  }) => apiClient.put(`/benefits/${benefitId}`, data),

  // 锁定分配
  lockBenefit: (benefitId: string) =>
    apiClient.post(`/benefits/${benefitId}/lock`),

  // 创建投票
  createVote: (benefitId: string, data: {
    vote_type: 'APPROVE' | 'REJECT';
    reason?: string;
  }) => apiClient.post(`/benefits/${benefitId}/votes`, data),

  // 获取投票结果
  getVotes: (benefitId: string) =>
    apiClient.get(`/benefits/${benefitId}/votes`),
};

/**
 * 聊天服务
 */
export const chatService = {
  // 获取聊天历史
  getMessages: (params?: {
    limit?: number;
    before?: string;
  }) => apiClient.get('/chat/messages', params),

  // 发送消息
  sendMessage: (data: {
    receiver_virtual_id: string;
    content: string;
    message_type: string;
  }) => apiClient.post('/chat/messages', data),

  // 标记消息已读
  markMessageRead: (messageId: string) =>
    apiClient.post(`/chat/messages/${messageId}/read`),

  // 获取在线状态
  getOnlineStatus: (virtual_ids: string[]) =>
    apiClient.post('/chat/online-status', { virtual_ids }),
};

/**
 * 看板服务
 */
export const kanbanService = {
  // 获取看板
  getKanban: (projectId: string) =>
    apiClient.get(`/kanban/project/${projectId}`),

  // 创建看板
  createKanban: (data: {
    project_id: string;
    title: string;
  }) => apiClient.post('/kanban', data),

  // 更新任务位置
  updateTaskPosition: (taskId: string, data: {
    column_id: string;
    order: number;
  }) => apiClient.put(`/kanban/tasks/${taskId}/position`, data),

  // 创建任务
  createTask: (data: {
    column_id: string;
    title: string;
    description?: string;
  }) => apiClient.post('/kanban/tasks', data),

  // 更新任务
  updateTask: (taskId: string, data: any) =>
    apiClient.put(`/kanban/tasks/${taskId}`, data),
};

export default apiClient;
