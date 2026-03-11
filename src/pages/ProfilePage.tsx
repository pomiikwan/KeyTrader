import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Radio, Lock, Bell, Settings, HelpCircle, LogOut, Eye, EyeOff, Sparkles, DollarSign, Users, FileText, CheckCircle2 } from 'lucide-react';
import { useAuthStore, useIdentityStore } from '@/store';
import { UserRole, getUserRoles, getRoleLabel } from '@/types';
import { TacticalCard } from '@/components/ui/tactical';

/**
 * 个人中心页面 - 移动端军事科技风格
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();
  const {
    currentIdentity,
    identities,
    setCurrentIdentity,
    addIdentity,
  } = useIdentityStore();

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

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: currentUser?.nickname || '',
    email: currentUser?.email || '',
  });
  const [showRealName, setShowRealName] = useState(false);

  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const [newIdentityForm, setNewIdentityForm] = useState({
    display_name: '',
    avatar_url: '',
  });

  if (!currentUser) {
    return null;
  }

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setEditing(false);
  };

  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIdentity = {
      id: crypto.randomUUID(),
      user_id: currentUser.id,
      virtual_id: `ID${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      display_name: newIdentityForm.display_name,
      avatar_url: newIdentityForm.avatar_url,
      is_active: false,
      created_at: new Date().toISOString(),
    };
    addIdentity(newIdentity);
    setShowIdentityForm(false);
    setNewIdentityForm({ display_name: '', avatar_url: '' });
  };

  const handleSwitchIdentity = (identityId: string) => {
    const identity = identities.find((id) => id.id === identityId);
    if (identity) {
      setCurrentIdentity(identity);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 获取用户的所有角色
  const userRoles = getUserRoles(currentUser);

  // 角色颜色配置
  const roleColorConfig = {
    [UserRole.PROJECT_OWNER]: 'text-[hsl(var(--tech-cyan))]',
    [UserRole.CAPITAL_PROVIDER]: 'text-[hsl(var(--finance-gold))]',
    [UserRole.TRADER]: 'text-[hsl(var(--military-olive))]',
    [UserRole.INTRODUCER]: 'text-[hsl(var(--tech-cyan))]',
  };

  // 生成角色标签列表
  const roleBadges = userRoles.map((role) => ({
    label: getRoleLabel(role),
    color: roleColorConfig[role],
  }));

  // 统计数据
  const stats = [
    { icon: Shield, label: '发布对接', value: 12 },
    { icon: Radio, label: '成功锁定', value: 8 },
    { icon: Bell, label: '通信次数', value: 156 },
    { icon: User, label: '信誉评分', value: 4.8 },
  ];

  // 菜单分组
  const menuGroups = [
    // 核心功能组
    [
      { icon: Sparkles, title: 'AI 智能匹配', desc: '精准推荐系统', path: '/matching' },
      { icon: Shield, title: '推荐人保护', desc: '独家保护机制', path: '/broker-protection' },
      { icon: DollarSign, title: '利益分配', desc: '佣金管理系统', path: '/benefits' },
      { icon: Users, title: '三方确认', desc: '流程确认追踪', path: '/confirmation' },
    ],
    // 安全组
    [
      { icon: Eye, title: '匿名设置', desc: '身份脱敏保护', path: '/profile' },
      { icon: Lock, title: '隐私安全', desc: '数据加密存储', path: '/profile' },
    ],
    // 通知组
    [
      { icon: Bell, title: '消息通知', desc: '推送消息管理', path: '/notifications/settings' },
      { icon: Settings, title: '系统设置', desc: '应用偏好设置', path: '/profile' },
      { icon: HelpCircle, title: '帮助中心', desc: '常见问题解答', path: '/profile' },
    ],
    // 协议组
    [
      { icon: FileText, title: '用户协议', desc: '服务条款说明', path: '/profile' },
      { icon: Shield, title: '隐私政策', desc: '数据保护政策', path: '/profile' },
    ],
    // 账户组
    [
      { icon: LogOut, title: '退出登录', desc: '安全退出账户', action: 'logout', danger: true },
    ],
  ];

  return (
    <div className="space-y-6 pb-6 bg-background min-h-full">
      {/* 顶部身份卡区域 - 战术HUD风格 */}
      <section className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--tech-cyan))]/10 to-transparent h-32" />
        <div className="absolute inset-0 hud-grid opacity-20" />

        <div className="relative px-4 pt-4">
          {/* 用户信息 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 mb-6"
          >
            {/* 头像 */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--military-olive))] to-[hsl(var(--tactical-green))] rounded-xl flex items-center justify-center text-2xl font-bold text-[hsl(var(--foreground))] border-2 border-[hsl(var(--military-olive))]/50">
                {currentUser.nickname?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {/* 在线状态 */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-[hsl(var(--tech-cyan))] rounded-full border-2 border-[hsl(var(--background))] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                  {showRealName
                    ? currentUser.nickname || '未设置'
                    : (currentUser.nickname || currentUser.virtual_id).charAt(0) +
                      '**' +
                      (currentUser.nickname || currentUser.virtual_id).slice(-2)
                  }
                </h2>
                <button
                  onClick={() => setShowRealName(!showRealName)}
                  className="p-1 text-[hsl(var(--muted-foreground))]"
                >
                  {showRealName ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs font-mono text-[hsl(var(--tech-cyan))] px-2 py-0.5 bg-[hsl(var(--tech-cyan))]/10 rounded border border-[hsl(var(--tech-cyan))]/30">
                  ID: {currentUser.virtual_id}
                </div>
              </div>

              {/* 角色标签 */}
              <div className="flex flex-wrap gap-1">
                {roleBadges.map((badge, index) => (
                  <span
                    key={index}
                    className={`text-[10px] px-2 py-0.5 rounded ${badge.color} bg-current/10 border border-current/20`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 统计数据 - 4宫格 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-2"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[hsl(var(--card))] rounded-lg p-3 border border-[hsl(var(--border))] text-center"
              >
                <stat.icon className="w-4 h-4 text-[hsl(var(--tech-cyan))] mx-auto mb-1" />
                <div className="text-base font-bold text-[hsl(var(--foreground))]">{stat.value}</div>
                <div className="text-[8px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 菜单列表 */}
      <section className="px-4 space-y-3">
        {menuGroups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + groupIndex * 0.1 }}
            className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden"
          >
            {group.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-4 transition-colors ${
                  item.danger
                    ? 'text-[hsl(var(--alert-red))]'
                    : 'text-[hsl(var(--foreground))]'
                } ${index < group.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}
                onClick={() => {
                  if (item.action === 'logout') {
                    handleLogout();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.danger
                    ? 'bg-[hsl(var(--alert-red))]/20'
                    : 'bg-[hsl(var(--tech-cyan))]/20'
                }`}>
                  <item.icon className={`w-4 h-4 ${item.danger ? 'text-[hsl(var(--alert-red))]' : 'text-[hsl(var(--tech-cyan))]'}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className={`text-[10px] ${item.danger ? 'text-[hsl(var(--alert-red))]/70' : 'text-[hsl(var(--muted-foreground))]'}`}>
                    {item.desc}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ))}
      </section>

      {/* 版本信息 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-[hsl(var(--muted-foreground))]"
      >
        <p>KeyTrader × KeyMeet v1.0.0</p>
        <p className="mt-1">由本小姐哈雷酱精心打造 (￣▽￣)ﾉ</p>
      </motion.div>
    </div>
  );
}
