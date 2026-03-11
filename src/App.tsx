import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { MobileLayout } from '@/components/layout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import CreateProjectPage from '@/pages/CreateProjectPage';
import KanbanBoardPage from '@/pages/KanbanBoardPage';
import ChatsPage from '@/pages/ChatsPage';
import ChatDetailPage from '@/pages/ChatDetailPage';
import NotificationsPage from '@/pages/NotificationsPage';
import NotificationSettingsPage from '@/pages/NotificationSettingsPage';
import BrokerProtectionPage from '@/pages/BrokerProtectionPage';
import MatchingPage from '@/pages/MatchingPage';
import BenefitManagementPage from '@/pages/BenefitManagementPage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import TaskDetailPage from '@/pages/TaskDetailPage';

// ⚠️ 开发模式：跳过登录检查，方便测试UI
// TODO: 后端API实现后，设置为 false
const DEV_MODE = true;

// 路由守卫组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // 开发模式：直接渲染子组件，不检查登录状态
  if (DEV_MODE) {
    return <>{children}</>;
  }

  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 公共路由（已登录用户不能访问）
function PublicRoute({ children }: { children: React.ReactNode }) {
  // 开发模式：直接渲染子组件，不检查登录状态
  if (DEV_MODE) {
    return <>{children}</>;
  }

  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公共路由（登录/注册页不使用MobileLayout） */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* 受保护路由（使用MobileLayout） */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MobileLayout />
            </ProtectedRoute>
          }
        >
          {/* 默认重定向到dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard页面 */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Projects相关页面 */}
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/create" element={<CreateProjectPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />

          {/* Kanban看板 */}
          <Route path="kanban" element={<KanbanBoardPage />} />

          {/* Profile页面 */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/settings" element={<NotificationSettingsPage />} />

          {/* 推荐人保护 */}
          <Route path="broker-protection" element={<BrokerProtectionPage />} />

          {/* AI 智能匹配 */}
          <Route path="matching" element={<MatchingPage />} />

          {/* 利益分配管理 */}
          <Route path="benefits" element={<BenefitManagementPage />} />

          {/* 三方确认流程 */}
          <Route path="confirmation" element={<ConfirmationPage />} />

          {/* 任务详情 */}
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />

          {/* 通知中心 */}
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notifications/settings" element={<NotificationSettingsPage />} />

          {/* Chat相关页面 */}
          <Route path="chats" element={<ChatsPage />} />
          <Route path="chats/:id" element={<ChatDetailPage />} />
        </Route>

        {/* 404 页面 */}
        <Route path="*" element={<Navigate to={DEV_MODE ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
