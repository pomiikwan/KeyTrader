import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  MessageCircle,
  Briefcase,
  AlertCircle,
  Info,
  Clock,
  X,
} from 'lucide-react';
import { useNotificationStore } from '@/store';
import { NotificationType, NotificationPriority, NotificationStatus } from '@/types/notification';

/**
 * 通知中心页面 - 移动端军事科技风格
 */
export default function NotificationsPage() {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);
  const {
    getFilteredNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    setFilter,
  } = useNotificationStore();

  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'high'>('all');

  // 直接计算统计信息
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => n.status === 'unread').length,
    highPriority: notifications.filter(
      (n) => n.status === 'unread' && (n.priority === 'high' || n.priority === 'urgent')
    ).length,
    urgent: notifications.filter((n) => n.status === 'unread' && n.priority === 'urgent').length,
  };

  // 获取通知图标
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_MESSAGE:
      case NotificationType.MESSAGE_MENTION:
        return MessageCircle;
      case NotificationType.PROJECT_MATCH:
      case NotificationType.PROJECT_UPDATE:
      case NotificationType.PROJECT_VIEW:
        return Briefcase;
      case NotificationType.SECURITY_ALERT:
        return AlertCircle;
      default:
        return Bell;
    }
  };

  // 获取通知颜色
  const getNotificationColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/30';
      case NotificationPriority.HIGH:
        return 'text-[hsl(var(--finance-gold))] bg-[hsl(var(--finance-gold))]/10 border-[hsl(var(--finance-gold))]/30';
      case NotificationPriority.NORMAL:
        return 'text-[hsl(var(--tech-cyan))] bg-[hsl(var(--tech-cyan))]/10 border-[hsl(var(--tech-cyan))]/30';
      case NotificationPriority.LOW:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  // 获取筛选后的通知
  const getNotifications = () => {
    let notifs = getFilteredNotifications();

    if (filterTab === 'unread') {
      notifs = notifs.filter((n) => n.status === NotificationStatus.UNREAD);
    } else if (filterTab === 'high') {
      notifs = notifs.filter(
        (n) =>
          n.status === NotificationStatus.UNREAD &&
          (n.priority === NotificationPriority.HIGH || n.priority === NotificationPriority.URGENT)
      );
    }

    return notifs;
  };

  const filteredNotifications = getNotifications();

  const handleNotificationClick = (notif: any) => {
    if (notif.status === NotificationStatus.UNREAD) {
      markAsRead(notif.id);
    }

    // TODO: 根据通知类型跳转到对应页面
    if (notif.relatedProjectId) {
      navigate(`/projects/${notif.relatedProjectId}`);
    } else if (notif.relatedChatId) {
      navigate(`/chats/${notif.relatedChatId}`);
    } else if (notif.relatedTaskId) {
      navigate('/kanban');
    }
  };

  return (
    <div className="space-y-4 pb-6 bg-background min-h-full">
      {/* 顶部导航栏 */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">通知中心</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Bell className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                {stats.unread > 0 ? `${stats.unread} 条未读` : '全部已读'}
              </span>
            </div>
          </div>

          {/* 全部已读按钮 */}
          {stats.unread > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-xs text-[hsl(var(--tech-cyan))] flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              <span>全部已读</span>
            </motion.button>
          )}
        </motion.div>

        {/* 筛选标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterTab === 'all'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterTab === 'unread'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            未读
          </button>
          <button
            onClick={() => setFilterTab('high')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterTab === 'high'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            重要
          </button>
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] mt-3 pt-3 border-t border-[hsl(var(--border))]"
        >
          <span>
            共 <span className="text-[hsl(var(--tech-cyan))] font-bold">{notifications.length}</span> 条通知
          </span>
          {notifications.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={clearAll}
              className="flex items-center gap-1 text-[hsl(var(--destructive))]"
            >
              <Trash2 className="w-3 h-3" />
              <span>清空全部</span>
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* 通知列表 */}
      <section className="px-4">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔔</div>
              <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无通知</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                {filterTab !== 'all' ? '尝试切换到其他标签' : '开启通知后第一时间获取更新'}
              </div>
            </motion.div>
          ) : (
            filteredNotifications.map((notif, index) => {
              const Icon = getNotificationIcon(notif.type);
              const colorClass = getNotificationColor(notif.priority);
              const isUnread = notif.status === NotificationStatus.UNREAD;

              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNotificationClick(notif)}
                  className={`relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-xl p-4 border ${
                    isUnread ? 'border-[hsl(var(--tech-cyan))]/50' : 'border-[hsl(var(--border))]'
                  } corner-deco overflow-hidden mb-3 cursor-pointer`}
                >
                  <div className="absolute inset-0 hud-grid opacity-20" />
                  {isUnread && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))]/50 to-transparent" />
                  )}

                  <div className="relative">
                    <div className="flex items-start gap-3">
                      {/* 图标 */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${colorClass}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3
                            className={`text-sm font-bold line-clamp-1 ${
                              isUnread ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'
                            }`}
                          >
                            {notif.title}
                          </h3>
                          {isUnread && (
                            <div className="w-2 h-2 bg-[hsl(var(--tech-cyan))] rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 mb-2">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(notif.createdAt)}</span>
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notif.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
                              >
                                <Check className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                              className="w-6 h-6 flex items-center justify-center text-[hsl(var(--destructive))]"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
