import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  Briefcase,
  AlertCircle,
  Clock,
  Check,
  X,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useNotificationStore } from '@/store';
import { NotificationType, NotificationPriority } from '@/types/notification';

/**
 * 通知设置页面 - 移动端军事科技风格
 */
export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useNotificationStore();

  // 本地状态
  const [tempSettings, setTempSettings] = useState(settings);

  // 通知类型配置
  const notificationTypeConfig = [
    {
      type: NotificationType.NEW_MESSAGE,
      icon: MessageCircle,
      label: '新消息',
      desc: '收到新消息时通知',
    },
    {
      type: NotificationType.MESSAGE_MENTION,
      icon: MessageCircle,
      label: '消息提及',
      desc: '有人在消息中提及您',
    },
    {
      type: NotificationType.PROJECT_MATCH,
      icon: Briefcase,
      label: '项目匹配',
      desc: '系统为您匹配到新项目',
    },
    {
      type: NotificationType.PROJECT_UPDATE,
      icon: Briefcase,
      label: '项目更新',
      desc: '关注的项目有新进展',
    },
    {
      type: NotificationType.PROJECT_VIEW,
      icon: Briefcase,
      label: '项目被查看',
      desc: '有人查看了您的项目',
    },
    {
      type: NotificationType.TASK_ASSIGNED,
      icon: Clock,
      label: '任务分配',
      desc: '您被分配了新任务',
    },
    {
      type: NotificationType.TASK_DUE_SOON,
      icon: Clock,
      label: '任务到期提醒',
      desc: '任务即将到期',
    },
    {
      type: NotificationType.TASK_COMPLETED,
      icon: Check,
      label: '任务完成',
      desc: '任务已完成',
    },
    {
      type: NotificationType.NEW_RECOMMENDATION,
      icon: Briefcase,
      label: '新推荐',
      desc: '收到新的推荐请求',
    },
    {
      type: NotificationType.RECOMMENDATION_ACCEPTED,
      icon: Check,
      label: '推荐被接受',
      desc: '您的推荐被接受',
    },
    {
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      icon: Bell,
      label: '系统公告',
      desc: '重要的系统通知',
    },
    {
      type: NotificationType.SECURITY_ALERT,
      icon: AlertCircle,
      label: '安全提醒',
      desc: '账户安全相关通知',
    },
  ];

  const handleSave = () => {
    updateSettings(tempSettings);
    navigate(-1);
  };

  const handleToggle = (key: keyof typeof tempSettings) => {
    setTempSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTypeToggle = (type: NotificationType) => {
    setTempSettings((prev) => ({
      ...prev,
      typeSettings: {
        ...prev.typeSettings,
        [type]: !prev.typeSettings[type],
      },
    }));
  };

  return (
    <div className="space-y-4 pb-6 bg-background min-h-full">
      {/* 顶部导航栏 */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-[hsl(var(--border))]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">通知设置</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Bell className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">自定义通知偏好</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className="px-3 py-1.5 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-xs text-[hsl(var(--tech-cyan))]"
          >
            保存
          </motion.button>
        </motion.div>
      </section>

      {/* 通知方式 */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] corner-deco overflow-hidden"
        >
          <div className="p-4 border-b border-[hsl(var(--border))]">
            <h2 className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">通知方式</h2>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">选择接收通知的方式</p>
          </div>

          {/* 推送通知 */}
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--tech-cyan))]/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[hsl(var(--tech-cyan))]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">推送通知</div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">在应用内显示通知</div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggle('enablePush')}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                tempSettings.enablePush ? 'bg-[hsl(var(--tech-cyan))]' : 'bg-[hsl(var(--border))]'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: tempSettings.enablePush ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* 邮件通知 */}
          <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--finance-gold))]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[hsl(var(--finance-gold))]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">邮件通知</div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">发送邮件到您的邮箱</div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggle('enableEmail')}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                tempSettings.enableEmail ? 'bg-[hsl(var(--tech-cyan))]' : 'bg-[hsl(var(--border))]'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: tempSettings.enableEmail ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* 声音 */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--military-olive))]/20 flex items-center justify-center">
                {tempSettings.enableSound ? (
                  <Volume2 className="w-5 h-5 text-[hsl(var(--military-olive))]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">通知声音</div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">新消息提醒音</div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggle('enableSound')}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                tempSettings.enableSound ? 'bg-[hsl(var(--tech-cyan))]' : 'bg-[hsl(var(--border))]'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: tempSettings.enableSound ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* 免打扰模式 */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] corner-deco overflow-hidden"
        >
          <div className="p-4 border-b border-[hsl(var(--border))]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">免打扰模式</h2>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">设定时间段内静音通知</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setTempSettings((prev) => ({
                    ...prev,
                    quietHours: {
                      ...prev.quietHours,
                      enabled: !prev.quietHours.enabled,
                    },
                  }));
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  tempSettings.quietHours.enabled ? 'bg-[hsl(var(--tech-cyan))]' : 'bg-[hsl(var(--border))]'
                }`}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow"
                  animate={{ x: tempSettings.quietHours.enabled ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>

          {tempSettings.quietHours.enabled && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">开始时间</span>
                <input
                  type="time"
                  value={tempSettings.quietHours.start}
                  onChange={(e) => {
                    setTempSettings((prev) => ({
                      ...prev,
                      quietHours: {
                        ...prev.quietHours,
                        start: e.target.value,
                      },
                    }));
                  }}
                  className="px-3 py-1.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">结束时间</span>
                <input
                  type="time"
                  value={tempSettings.quietHours.end}
                  onChange={(e) => {
                    setTempSettings((prev) => ({
                      ...prev,
                      quietHours: {
                        ...prev.quietHours,
                        end: e.target.value,
                      },
                    }));
                  }}
                  className="px-3 py-1.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                />
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* 通知类型 */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] corner-deco overflow-hidden"
        >
          <div className="p-4 border-b border-[hsl(var(--border))]">
            <h2 className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">通知类型</h2>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">选择需要接收的通知类型</p>
          </div>

          <div className="divide-y divide-[hsl(var(--border))]">
            {notificationTypeConfig.map((config, index) => {
              const Icon = config.icon;
              const isEnabled = tempSettings.typeSettings[config.type] !== false;

              return (
                <div key={config.type} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isEnabled ? 'bg-[hsl(var(--tech-cyan))]/20' : 'bg-[hsl(var(--card))]'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isEnabled ? 'text-[hsl(var(--tech-cyan))]' : 'text-[hsl(var(--muted-foreground))]'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[hsl(var(--foreground))]">{config.label}</div>
                      <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{config.desc}</div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTypeToggle(config.type)}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${
                      isEnabled ? 'bg-[hsl(var(--tech-cyan))]' : 'bg-[hsl(var(--border))]'
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow"
                      animate={{ x: isEnabled ? 20 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
