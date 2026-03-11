// 用户角色枚举
export enum UserRole {
  PROJECT_OWNER = 'PROJECT_OWNER',       // 项目方
  CAPITAL_PROVIDER = 'CAPITAL_PROVIDER', // 资金方
  TRADER = 'TRADER',                     // 贸易方
  INTRODUCER = 'INTRODUCER'              // 推荐人
}

// 对接类型枚举
export enum DealType {
  PROJECT = 'PROJECT',   // 项目对接
  CAPITAL = 'CAPITAL',   // 资金对接
  TRADE = 'TRADE'        // 贸易对接
}

// 节点状态枚举
export enum NodeStatus {
  PENDING = 'PENDING',           // 待确认
  PROJECT_CONFIRMED = 'PROJECT_CONFIRMED',       // 项目方已确认
  CAPITAL_CONFIRMED = 'CAPITAL_CONFIRMED',       // 资金方已确认
  INTRODUCER_CONFIRMED = 'INTRODUCER_CONFIRMED', // 推荐人已确认
  CONFIRMED = 'CONFIRMED',       // 三方已确认
  IN_PROGRESS = 'IN_PROGRESS',   // 进行中
  COMPLETED = 'COMPLETED',       // 已完成
  CANCELLED = 'CANCELLED'        // 已取消
}

// 用户接口
export interface User {
  id: string;
  virtual_id: string;
  phone_number: string;
  email?: string;
  nickname?: string;
  avatar_url?: string;
  role: UserRole | UserRole[];  // 支持单个角色或多个角色
  trust_score: number;
  created_at: string;
  updated_at: string;
}

// 获取用户角色列表的工具函数
export function getUserRoles(user: User): UserRole[] {
  if (Array.isArray(user.role)) {
    return user.role;
  }
  return [user.role];
}

// 获取角色显示名称的工具函数
export function getRoleLabel(role: UserRole): string {
  const roleLabels = {
    [UserRole.PROJECT_OWNER]: '项目方',
    [UserRole.CAPITAL_PROVIDER]: '资金方',
    [UserRole.TRADER]: '贸易方',
    [UserRole.INTRODUCER]: '推荐人',
  };
  return roleLabels[role];
}

// 项目/对接接口
export interface Project {
  id: string;
  type: DealType;
  title: string;
  description: string;
  project_owner_id?: string;
  capital_provider_id?: string;
  trader_id?: string;
  key_introducer_ids: string[];
  status: NodeStatus;
  budget?: number;
  location?: string;
  tags?: string[];
  kanban_board_id?: string;
  benefit_id?: string;
  created_at: string;
  updated_at: string;
}

// 节点接口（三方确认）
export interface Node {
  id: string;
  project_id: string;
  project_owner_id: string;
  capital_provider_id?: string;
  introducer_id: string;
  project_owner_confirmed: boolean;
  capital_provider_confirmed?: boolean;
  introducer_confirmed: boolean;
  status: NodeStatus;
  confirmation_deadline?: string;
  created_at: string;
  updated_at: string;
}

// 利益分配接口
export interface Benefit {
  id: string;
  project_id: string;
  introducer_ratio: number;      // 推荐人比例 (0-100)
  platform_ratio: number;        // 平台比例 (0-100)
  adjustment_count: number;      // 调整次数 (最多3次)
  is_locked: boolean;            // 是否锁定
  created_at: string;
  updated_at: string;
}

// 投票记录接口
export interface Vote {
  id: string;
  benefit_id: string;
  voter_id: string;
  vote_type: 'APPROVE' | 'REJECT';
  reason?: string;
  created_at: string;
}

// 虚拟身份接口
export interface VirtualIdentity {
  id: string;
  user_id: string;
  virtual_id: string;
  display_name: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

// 消息类型枚举
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM'
}

// 消息接口
export interface Message {
  id: string;
  sender_virtual_id: string;
  receiver_virtual_id: string;
  content: string;
  message_type: MessageType;
  is_encrypted: boolean;
  created_at: string;
  read_at?: string;
}

// 任务节点接口
export interface TaskNode {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: NodeStatus;
  order: number;
  dependencies?: string[];
  assignee_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// 看板列接口
export interface KanbanColumn {
  id: string;
  board_id: string;
  title: string;
  order: number;
  tasks: TaskNode[];
}

// 看板接口
export interface KanbanBoard {
  id: string;
  project_id: string;
  title: string;
  columns: KanbanColumn[];
  created_at: string;
  updated_at: string;
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 认证相关接口
export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface RegisterRequest {
  phone_number: string;
  password: string;
  invitation_code: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// WebSocket事件接口
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}
