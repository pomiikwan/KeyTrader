import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { StatusBar } from './StatusBar';

export function MobileLayout() {
  return (
    <>
      {/* 全局背景容器 */}
      <div className="fixed inset-0 bg-background pointer-events-none" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* HUD网格背景 */}
        <div className="absolute inset-0 hud-grid opacity-20" />
      </div>

      {/* 状态栏 - 固定在顶部 */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
        <StatusBar />
      </div>

      {/* 主内容区 - 需要避开顶部StatusBar和底部BottomNav */}
      <main className="relative z-10 pt-[60px] pb-[80px] min-h-screen overflow-y-auto scrollbar-hide" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* 使用Outlet渲染子路由 */}
        <Outlet />
      </main>

      {/* 底部导航 - 固定在底部 */}
      <div className="fixed bottom-0 left-0 right-0 z-50" style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
        <BottomNav />
      </div>
    </>
  );
}
