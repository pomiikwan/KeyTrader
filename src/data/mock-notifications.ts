import { NotificationType, NotificationPriority } from '@/types/notification';

/**
 * 模拟通知数据
 * 用于开发和测试
 */
export const mockNotifications = [
  {
    type: NotificationType.NEW_MESSAGE,
    priority: NotificationPriority.NORMAL,
    status: 'unread' as const,
    title: '新消息',
    message: '推荐人给您发来了新消息',
    relatedUserId: 'IDXYZ5678',
    relatedChatId: '1',
  },
  {
    type: NotificationType.PROJECT_MATCH,
    priority: NotificationPriority.HIGH,
    status: 'unread' as const,
    title: '项目匹配',
    message: '系统为您匹配到3个优质项目',
    relatedProjectId: '2',
  },
  {
    type: NotificationType.TASK_ASSIGNED,
    priority: NotificationPriority.HIGH,
    status: 'unread' as const,
    title: '任务分配',
    message: '您被分配了新的任务：尽职调查',
    relatedTaskId: 'task-1',
  },
  {
    type: NotificationType.PROJECT_UPDATE,
    priority: NotificationPriority.NORMAL,
    status: 'unread' as const,
    title: '项目更新',
    message: '关注的项目"新能源电池研发"有了新进展',
    relatedProjectId: '1',
  },
  {
    type: NotificationType.NEW_RECOMMENDATION,
    priority: NotificationPriority.NORMAL,
    status: 'read' as const,
    title: '新推荐',
    message: '您的项目被推荐给了3位资金方',
    relatedProjectId: '1',
  },
  {
    type: NotificationType.SECURITY_ALERT,
    priority: NotificationPriority.URGENT,
    status: 'read' as const,
    title: '安全提醒',
    message: '检测到异地登录，请确认是否为本人操作',
  },
  {
    type: NotificationType.RECOMMENDATION_ACCEPTED,
    priority: NotificationPriority.NORMAL,
    status: 'read' as const,
    title: '推荐已接受',
    message: '资金方接受了您的推荐，正在建立联系',
    relatedProjectId: '2',
  },
];

/**
 * 初始化模拟通知到Store
 */
export const initMockNotifications = () => {
  // TODO: 在应用启动时调用此函数
  // 可以在DashboardPage或其他地方调用
  // useNotificationStore.getState().addNotification(...)
};
