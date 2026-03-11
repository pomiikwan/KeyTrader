import { Shield, Radio, Zap, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUnreadCount } from '@/store';

export function StatusBar() {
  const navigate = useNavigate();
  const unreadCount = useUnreadCount();

  return (
    <div className="sticky top-0 z-50 status-bar-military">
      {/* 顶部装饰线 */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))] to-transparent" />

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo和标题 - 军事科技风格 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--tactical-green))] to-[hsl(var(--stealth-black))] rounded-lg flex items-center justify-center border border-[hsl(var(--tech-cyan))]/30">
                <Shield className="w-5 h-5 text-[hsl(var(--tech-cyan))]" />
              </div>
              {/* 雷达脉冲效果 */}
              <div className="absolute inset-0 rounded-lg radar-pulse opacity-50" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[hsl(var(--foreground))] tracking-wider">
                  KEY TRADER
                </h1>
                <span className="px-1.5 py-0.5 bg-[hsl(var(--tech-cyan))]/15 text-[hsl(var(--tech-cyan))] text-[9px] rounded border border-[hsl(var(--tech-cyan))]/25">
                  V1.0
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                  <Radio className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
                  SECURE LINK
                </span>
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--tech-cyan))] animate-pulse" />
              </div>
            </div>
          </div>

          {/* 右侧操作 - 战术风格 */}
          <div className="flex items-center gap-2">
            {/* 通知图标 */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-9 h-9 bg-[hsl(var(--card))] rounded-lg flex items-center justify-center border border-[hsl(var(--border))] hover:border-[hsl(var(--tech-cyan))]/50 transition-all"
            >
              <Bell className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              {/* 未读徽章 */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[hsl(var(--tech-cyan))] rounded-full flex items-center justify-center text-[10px] font-bold text-[hsl(var(--background))] border-2 border-[hsl(var(--background))]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* 系统状态 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[hsl(var(--card))] rounded border border-[hsl(var(--border))]">
              <Zap className="w-3 h-3 text-[hsl(var(--finance-gold))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">OPS READY</span>
            </div>

            {/* 用户头像 - 战术风格 */}
            <div className="w-9 h-9 bg-gradient-to-br from-[hsl(var(--military-olive))] to-[hsl(var(--tactical-green))] rounded-lg flex items-center justify-center text-sm font-bold text-[hsl(var(--foreground))] border border-[hsl(var(--military-olive))]/70">
              C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
