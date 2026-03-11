import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TacticalCard, TacticalInput, TacticalButton } from '@/components/ui/tactical';
import { useAuthStore } from '@/store';
import { authService } from '@/lib/api-client';

/**
 * 登录页面 - KeyTrader 军事科技金融风格
 *
 * 功能：
 * - 手机号+密码登录
 * - 自动Token刷新
 * - 错误提示
 * - 加载状态
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    phone_number: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(''); // 清除错误提示
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(
        formData.phone_number,
        formData.password
      );

      if (response.success && response.data) {
        const { user, access_token, refresh_token } = response.data;
        setAuth(user, access_token, refresh_token);
        navigate('/dashboard');
      } else {
        setError(response.error || '登录失败，请检查手机号和密码');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--tech-cyan),0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--tech-cyan),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--tech-cyan),0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-tech-cyan tracking-wider mb-2">
            KEYTRADER
          </h1>
          <p className="text-sm text-finance-gold/80">
            安全 · 匿名 · 智能
          </p>
          <div className="mt-4 text-xs text-gray-400 font-mono">
            ▶ AUTHENTICATION PROTOCOL v2.0
          </div>
        </div>

        {/* 登录表单卡片 */}
        <TacticalCard title="用户登录" className="corner-deco">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="bg-alert-red/10 border border-alert-red/30 rounded p-3">
                <p className="text-sm text-alert-red flex items-center gap-2">
                  <span>⚠</span>
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* 手机号输入 */}
            <div>
              <label className="block text-xs text-tech-cyan/60 mb-2 tracking-wider">
                手机号码
              </label>
              <TacticalInput
                type="tel"
                placeholder="请输入手机号"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                disabled={loading}
                required
                pattern="[0-9]{11}"
                className="font-mono"
              />
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-xs text-tech-cyan/60 mb-2 tracking-wider">
                登录密码
              </label>
              <TacticalInput
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            {/* 登录按钮 */}
            <TacticalButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⚙</span>
                  <span>登录中...</span>
                </span>
              ) : (
                <span>登录系统</span>
              )}
            </TacticalButton>

            {/* 注册链接 */}
            <div className="text-center text-sm">
              <span className="text-gray-400">还没有账号？</span>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="ml-2 text-tech-cyan hover:text-tech-cyan/80 transition-colors"
              >
                立即注册
              </button>
            </div>
          </form>
        </TacticalCard>

        {/* 安全提示 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 所有通信均经过端到端加密保护
          </p>
        </div>
      </div>
    </div>
  );
}
