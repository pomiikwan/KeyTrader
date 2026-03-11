import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radar,
  Target,
  Radio,
  GitBranch,
  User,
} from 'lucide-react';

const navItems = [
  { id: 'home', label: '指挥台', icon: Radar, path: '/dashboard' },
  { id: 'deals', label: '目标库', icon: Target, path: '/projects' },
  { id: 'chat', label: '加密通', icon: Radio, path: '/chats' },
  { id: 'flow', label: '任务链', icon: GitBranch, path: '/kanban' },
  { id: 'profile', label: '身份卡', icon: User, path: '/profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // 根据当前路径确定激活的标签
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'home';
    if (path.startsWith('/projects')) return 'deals';
    if (path.startsWith('/chats')) return 'chat';
    if (path.startsWith('/kanban')) return 'flow';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="nav-tactical">
        {/* 顶部装饰线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))] to-transparent" />

        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[hsl(var(--card))] border border-[hsl(var(--tech-cyan))]'
                    : 'hover:bg-[hsl(var(--card))]'
                }`}
              >
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="relative"
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? 'text-[hsl(var(--tech-cyan))]'
                        : 'text-[hsl(var(--muted-foreground))]'
                    }`}
                  />
                  {isActive && (
                    <div className="absolute -inset-1 bg-[hsl(var(--tech-cyan))] rounded-full opacity-20 blur-sm" />
                  )}
                </motion.div>
                <span
                  className={`text-[9px] font-medium tracking-wide ${
                    isActive
                      ? 'text-[hsl(var(--tech-cyan))]'
                      : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  {item.label}
                </span>

                {/* 激活指示器 */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0.5 w-4 h-0.5 bg-[hsl(var(--tech-cyan))] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 安全区域适配 */}
      <div className="h-safe-area-inset-bottom bg-[hsl(var(--background))]" />
    </div>
  );
}
