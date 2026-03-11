/**
 * 通知系统类型定义
 * KeyTrader 通知中心
 */

/**
 * 通知类型枚举
 */
export enum NotificationType {
  // 消息相关
  NEW_MESSAGE = 'new_message', // 新消息
  MESSAGE_MENTION = 'message_mention', // 消息提及

  // 项目相关
  PROJECT_MATCH = 'project_match', // 项目匹配
  PROJECT_UPDATE = 'project_update', // 项目更新
  PROJECT_VIEW = 'project_view', // 项目被查看

  // 任务相关
  TASK_ASSIGNED = 'task_assigned', // 任务分配
  TASK_DUE_SOON = 'task_due_soon', // 任务即将到期
  TASK_COMPLETED = 'task_completed', // 任务完成

  // 推荐相关
  NEW_RECOMMENDATION = 'new_recommendation', // 新推荐
  RECOMMENDATION_ACCEPTED = 'recommendation_accepted', // 推荐被接受

  // 系统相关
  SYSTEM_ANNOUNCEMENT = 'system_announcement', // 系统公告
  SECURITY_ALERT = 'security_alert', // 安全提醒
}

/**
 * 通知优先级
 */
export enum NotificationPriority {
  LOW = 'low', // 低优先级
  NORMAL = 'normal', // 普通
  HIGH = 'high', // 高优先级
  URGENT = 'urgent', // 紧急
}

/**
 * 通知状态
 */
export enum NotificationStatus {
  UNREAD = 'unread', // 未读
  READ = 'read', // 已读
  ARCHIVED = 'archived', // 已归档
}

/**
 * 通知数据接口
 */
export interface Notification {
  id: string; // 通知ID
  type: NotificationType; // 通知类型
  priority: NotificationPriority; // 优先级
  status: NotificationStatus; // 状态

  // 内容
  title: string; // 标题
  message: string; // 消息内容
  description?: string; // 详细描述（可选）

  // 关联数据
  relatedUserId?: string; // 相关用户ID
  relatedProjectId?: string; // 相关项目ID
  relatedTaskId?: string; // 相关任务ID
  relatedChatId?: string; // 相关对话ID

  // 元数据
  createdAt: string; // 创建时间（ISO 8601）
  readAt?: string; // 已读时间
  data?: Record<string, any>; // 额外数据
}

/**
 * 通知统计信息
 */
export interface NotificationStats {
  total: number; // 总数
  unread: number; // 未读数
  highPriority: number; // 高优先级未读数
  urgent: number; // 紧急未读数
}

/**
 * 通知过滤器
 */
export interface NotificationFilter {
  type?: NotificationType; // 按类型筛选
  status?: NotificationStatus; // 按状态筛选
  priority?: NotificationPriority; // 按优先级筛选
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
}

/**
 * 通知配置
 */
export interface NotificationSettings {
  enablePush: boolean; // 启用推送
  enableEmail: boolean; // 启用邮件通知
  enableSound: boolean; // 启用声音
  quietHours: {
    enabled: boolean; // 启用免打扰
    start: string; // 开始时间（HH:mm）
    end: string; // 结束时间（HH:mm）
  };
  typeSettings: {
    [key in NotificationType]?: boolean; // 各类型通知开关
  };
}
