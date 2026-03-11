import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Notification,
  NotificationStats,
  NotificationFilter,
  NotificationSettings,
  NotificationType,
  NotificationStatus,
} from '@/types/notification';

/**
 * 通知Store
 * 管理所有通知的状态和操作
 */
interface NotificationStore {
  // 状态
  notifications: Notification[];
  filter: NotificationFilter;
  settings: NotificationSettings;

  // 操作方法
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;

  // 查询方法
  getStats: () => NotificationStats;
  getFilteredNotifications: () => Notification[];
  getUnreadCount: () => number;
  getHighPriorityCount: () => number;

  // 设置方法
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  setFilter: (filter: Partial<NotificationFilter>) => void;
}

/**
 * 默认通知设置
 */
const defaultSettings: NotificationSettings = {
  enablePush: true,
  enableEmail: false,
  enableSound: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  typeSettings: {
    new_message: true,
    message_mention: true,
    project_match: true,
    project_update: true,
    project_view: false,
    task_assigned: true,
    task_due_soon: true,
    task_completed: true,
    new_recommendation: true,
    recommendation_accepted: true,
    system_announcement: true,
    security_alert: true,
  },
};

/**
 * 生成通知ID
 */
function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 创建通知Store
 */
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      notifications: [],
      filter: {},
      settings: defaultSettings,

      // 添加通知
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));

        // TODO: 触发推送通知（如果启用）
        // TODO: 播放声音（如果启用）
      },

      // 标记为已读
      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId
              ? { ...notif, status: 'read' as NotificationStatus, readAt: new Date().toISOString() }
              : notif
          ),
        }));
      },

      // 全部标记为已读
      markAllAsRead: () => {
        const now = new Date().toISOString();
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.status === 'unread'
              ? { ...notif, status: 'read' as NotificationStatus, readAt: now }
              : notif
          ),
        }));
      },

      // 归档通知
      archiveNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId
              ? { ...notif, status: 'archived' as NotificationStatus }
              : notif
          ),
        }));
      },

      // 删除通知
      deleteNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== notificationId),
        }));
      },

      // 清空所有通知
      clearAll: () => {
        set({ notifications: [] });
      },

      // 获取统计信息
      getStats: () => {
        const { notifications } = get();
        const unread = notifications.filter((n) => n.status === 'unread');
        const highPriority = unread.filter((n) => n.priority === 'high');
        const urgent = unread.filter((n) => n.priority === 'urgent');

        return {
          total: notifications.length,
          unread: unread.length,
          highPriority: highPriority.length,
          urgent: urgent.length,
        };
      },

      // 获取筛选后的通知
      getFilteredNotifications: () => {
        const { notifications, filter } = get();

        return notifications.filter((notif) => {
          // 状态筛选
          if (filter.status && notif.status !== filter.status) {
            return false;
          }

          // 类型筛选
          if (filter.type && notif.type !== filter.type) {
            return false;
          }

          // 优先级筛选
          if (filter.priority && notif.priority !== filter.priority) {
            return false;
          }

          // 日期筛选
          if (filter.startDate || filter.endDate) {
            const createdAt = new Date(notif.createdAt);
            if (filter.startDate && createdAt < new Date(filter.startDate)) {
              return false;
            }
            if (filter.endDate && createdAt > new Date(filter.endDate)) {
              return false;
            }
          }

          return true;
        });
      },

      // 获取未读数量
      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter((n) => n.status === 'unread').length;
      },

      // 获取高优先级未读数量
      getHighPriorityCount: () => {
        const { notifications } = get();
        return notifications.filter(
          (n) => n.status === 'unread' && (n.priority === 'high' || n.priority === 'urgent')
        ).length;
      },

      // 更新设置
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            typeSettings: {
              ...state.settings.typeSettings,
              ...newSettings.typeSettings,
            },
          },
        }));
      },

      // 设置筛选器
      setFilter: (newFilter) => {
        set((state) => ({
          filter: {
            ...state.filter,
            ...newFilter,
          },
        }));
      },
    }),
    {
      name: 'notification-storage', // localStorage key
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings,
        // 不持久化filter
      }),
    }
  )
);

/**
 * 便捷hooks
 */
export const useUnreadCount = () =>
  useNotificationStore((state) =>
    state.notifications.filter((n) => n.status === 'unread').length
  );
export const useNotifications = () =>
  useNotificationStore((state) => state.getFilteredNotifications());
export const useNotificationStats = () =>
  useNotificationStore((state) => state.getStats());
