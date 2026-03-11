import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, Shield, Zap, Target, Radio, GitBranch, LockKeyhole, Crosshair, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useNotificationStore } from '@/store';
import { UserRole, getUserRoles, getRoleLabel } from '@/types';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';
import { mockNotifications } from '@/data/mock-notifications';

/**
 * 仪表板页面 - 移动端军事科技风格
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  // 初始化模拟通知（仅开发模式）
  useEffect(() => {
    const existingNotifications = useNotificationStore.getState().notifications;
    const hasInitialized = localStorage.getItem('mockNotificationsInitialized');

    // 只在第一次且没有通知时添加模拟数据
    if (!hasInitialized && existingNotifications.length === 0) {
      mockNotifications.forEach((notif, index) => {
        // 添加延迟，模拟真实通知
        setTimeout(() => {
          addNotification(notif);
        }, index * 100);
      });

      // 标记已初始化
      localStorage.setItem('mockNotificationsInitialized', 'true');
    }
  }, []);

  // 开发模式：模拟用户数据
  const DEV_MODE = true;
  const mockUser = {
    id: '1',
    virtual_id: 'IDABCD1234',
    phone_number: '13800138000',
    email: 'test@keytrader.com',
    nickname: '测试用户',
    role: UserRole.PROJECT_OWNER,
    trust_score: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const currentUser = user || (DEV_MODE ? mockUser : null);

  if (!currentUser) {
    return null;
  }

  // 获取用户的所有角色
  const userRoles = getUserRoles(currentUser);

  // 统计数据
  const stats = [
    { icon: Target, label: '发布对接', value: 12, color: 'text-tech-cyan' },
    { icon: Shield, label: '成功锁定', value: 8, color: 'text-finance-gold' },
    { icon: Radio, label: '通信次数', value: 156, color: 'text-military-olive' },
    { icon: Zap, label: '信任评分', value: `${currentUser.trust_score}/100`, color: 'text-tech-cyan' },
  ];

  // 功能模块
  const features = [
    {
      icon: Target,
      title: '对接管理',
      desc: '项目列表和筛选',
      color: 'from-[hsl(var(--tech-cyan))]/30 to-[hsl(var(--hud-blue))]/30',
      path: '/projects',
    },
    {
      icon: GitBranch,
      title: '看板管理',
      desc: '流程可视化',
      color: 'from-[hsl(var(--military-olive))]/30 to-[hsl(var(--tactical-green))]/30',
      path: '/kanban',
    },
    {
      icon: Sparkles,
      title: 'AI 匹配',
      desc: '智能推荐系统',
      color: 'from-[hsl(var(--finance-gold))]/30 to-[hsl(var(--tech-cyan))]/30',
      path: '/matching',
    },
    {
      icon: LockKeyhole,
      title: '匿名通信',
      desc: '加密消息系统',
      color: 'from-[hsl(var(--hud-blue))]/30 to-[hsl(var(--tech-cyan))]/30',
      path: '/chat',
    },
  ];

  // 角色颜色配置
  const roleColorConfig = {
    [UserRole.PROJECT_OWNER]: 'text-tech-cyan',
    [UserRole.CAPITAL_PROVIDER]: 'text-finance-gold',
    [UserRole.TRADER]: 'text-military-olive',
    [UserRole.INTRODUCER]: 'text-tech-cyan',
  };

  // 生成角色标签列表
  const roleBadges = userRoles.map((role) => ({
    label: getRoleLabel(role),
    color: roleColorConfig[role],
  }));

  return (
    <div className="space-y-6 pb-6 bg-background min-h-full">
      {/* 欢迎区域 - 战术指挥台风格 */}
      <section className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[hsl(var(--card))] rounded-xl p-5 border border-[hsl(var(--border))] corner-deco overflow-hidden"
        >
          {/* HUD网格背景 */}
          <div className="absolute inset-0 hud-grid opacity-50" />

          {/* 顶部扫描线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))] to-transparent" />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[hsl(var(--muted-foreground))] text-xs tracking-wider">OPERATOR</p>
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--tech-cyan))] animate-pulse" />
              </div>
              <h2 className="text-xl font-bold mt-1 text-[hsl(var(--foreground))] tracking-wide">
                {currentUser.nickname || currentUser.virtual_id}
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
                ID: {currentUser.virtual_id}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))] rounded-lg flex items-center justify-center border border-[hsl(var(--tech-cyan))]/30">
              <Radar className="w-6 h-6 text-[hsl(var(--background))]" />
            </div>
          </div>

          <div className="relative mt-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-[hsl(var(--military-olive))]/80 text-[hsl(var(--military-olive))] rounded text-xs border border-[hsl(var(--military-olive))]/30 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              VERIFIED
            </span>
            <span className="px-3 py-1 bg-[hsl(var(--finance-gold))]/20 text-[hsl(var(--finance-gold))] rounded text-xs border border-[hsl(var(--finance-gold))]/30 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              TRUST {currentUser.trust_score}
            </span>
          </div>

          {/* 角色标签 */}
          <div className="relative mt-3 flex flex-wrap gap-1">
            {roleBadges.map((badge, index) => (
              <TacticalBadge key={index} variant="info" className={`${badge.color} text-xs`}>
                {badge.label}
              </TacticalBadge>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 统计数据 - 战术面板 */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-lg p-4 border border-[hsl(var(--border))]"
              >
                <div className={`absolute inset-0 hud-grid opacity-30 pointer-events-none`} />
                <div className="relative">
                  <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <div className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 功能模块 */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(feature.path)}
                className={`relative bg-gradient-to-br ${feature.color} rounded-lg p-4 border border-[hsl(var(--border))]`}
              >
                <div className="absolute inset-0 hud-grid opacity-20" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-[hsl(var(--card))] rounded-lg flex items-center justify-center mb-2 border border-[hsl(var(--border))]">
                    <Icon className="w-5 h-5 text-[hsl(var(--foreground))]" />
                  </div>
                  <div className="text-sm font-bold text-[hsl(var(--foreground))]">
                    {feature.title}
                  </div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                    {feature.desc}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* 快速操作 */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TacticalCard title="快速操作" className="corner-deco">
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/projects/create')}
                className="w-full flex items-center justify-between p-3 bg-[hsl(var(--tech-cyan))]/10 border border-[hsl(var(--tech-cyan))]/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[hsl(var(--tech-cyan))] rounded flex items-center justify-center">
                    <Target className="w-4 h-4 text-[hsl(var(--background))]" />
                  </div>
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    创建新对接
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/projects')}
                className="w-full flex items-center justify-between p-3 bg-[hsl(var(--finance-gold))]/10 border border-[hsl(var(--finance-gold))]/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[hsl(var(--finance-gold))] rounded flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-[hsl(var(--background))]" />
                  </div>
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    浏览对接库
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/kanban')}
                className="w-full flex items-center justify-between p-3 bg-[hsl(var(--military-olive))]/10 border border-[hsl(var(--military-olive))]/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[hsl(var(--military-olive))] rounded flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-[hsl(var(--background))]" />
                  </div>
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    查看任务链
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[hsl(var(--military-olive))]" />
              </motion.button>
            </div>
          </TacticalCard>
        </motion.div>
      </section>

      {/* 系统通知 */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
            <div className="absolute inset-0 hud-grid opacity-30" />
            <div className="relative">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-[hsl(var(--tech-cyan))]/20 rounded flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">
                    系统通知
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                    KeyTrader × KeyMeet 系统正在持续优化中，更多功能即将开放。
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[hsl(var(--finance-gold))]/20 rounded flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">
                    开发进度
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                    当前已完成基础设施、认证系统、对接管理和看板管理的核心功能。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
