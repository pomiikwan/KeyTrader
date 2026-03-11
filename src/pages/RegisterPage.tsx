import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TacticalCard, TacticalInput, TacticalButton } from '@/components/ui/tactical';
import { TacticalBadge } from '@/components/ui/tactical';
import { useAuthStore } from '@/store';
import { authService } from '@/lib/api-client';
import { UserRole, getRoleLabel } from '@/types';

/**
 * 注册页面 - KeyTrader 军事科技金融风格
 *
 * 功能：
 * - 邀请码验证
 * - 角色选择
 * - 国密算法加密
 * - 密码强度验证
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(1); // 两步注册流程
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 步骤1: 验证邀请码
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeVerified, setInviteCodeVerified] = useState(false);

  // 步骤2: 用户信息
  const [formData, setFormData] = useState({
    phone_number: '',
    password: '',
    confirmPassword: '',
    roles: [] as UserRole[],  // 改为数组，支持多重角色
    nickname: '',
  });

  // 验证邀请码（模拟验证，实际应该调用API）
  const handleVerifyInviteCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: 调用真实的邀请码验证API
      // const response = await authService.verifyInviteCode(inviteCode);

      // 模拟验证过程
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (inviteCode.length >= 6) {
        setInviteCodeVerified(true);
        setStep(2);
      } else {
        setError('邀请码格式不正确');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '邀请码验证失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    if (formData.roles.length === 0) {
      setError('请至少选择一个用户角色');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        phone_number: formData.phone_number,
        password: formData.password,
        invitation_code: inviteCode,
        role: formData.roles[0], // TODO: 后端支持多重角色后改为 formData.roles
      });

      if (response.success && response.data) {
        const { user, access_token, refresh_token } = response.data;
        setAuth(user, access_token, refresh_token);
        navigate('/dashboard');
      } else {
        setError(response.error || '注册失败，请稍后重试');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 角色配置（移除emoji）
  const roleConfig = {
    [UserRole.PROJECT_OWNER]: {
      label: '项目方',
      description: '拥有优质项目，寻求资金支持',
      color: 'text-tech-cyan',
    },
    [UserRole.CAPITAL_PROVIDER]: {
      label: '资金方',
      description: '拥有资金，寻找优质项目',
      color: 'text-finance-gold',
    },
    [UserRole.TRADER]: {
      label: '贸易方',
      description: '从事贸易业务，寻求合作机会',
      color: 'text-military-olive',
    },
    [UserRole.INTRODUCER]: {
      label: '推荐人',
      description: '中介服务，促成对接合作',
      color: 'text-tech-cyan',
    },
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
          <div className="mt-4 flex items-center justify-center gap-2">
            <TacticalBadge variant="info">STEP {step}/2</TacticalBadge>
            <span className="text-xs text-gray-400">
              {step === 1 ? '验证邀请码' : '完善信息'}
            </span>
          </div>
        </div>

        {/* 步骤1: 验证邀请码 */}
        {step === 1 && (
          <TacticalCard title="验证邀请码" className="corner-deco">
            <form onSubmit={handleVerifyInviteCode} className="space-y-6">
              {error && (
                <div className="bg-alert-red/10 border border-alert-red/30 rounded p-3">
                  <p className="text-sm text-alert-red flex items-center gap-2">
                    <span>⚠</span>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs text-tech-cyan/60 mb-2 tracking-wider">
                  邀请码
                </label>
                <TacticalInput
                  type="text"
                  placeholder="请输入邀请码"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                  className="font-mono text-center text-lg tracking-wider"
                />
                <p className="text-xs text-gray-400 mt-2">
                  邀请码由现有用户生成，用于注册验证
                </p>
              </div>

              <TacticalButton
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block animate-spin">⚙</span>
                    <span>验证中...</span>
                  </span>
                ) : (
                  <span>验证邀请码</span>
                )}
              </TacticalButton>

              <div className="text-center text-sm">
                <span className="text-gray-400">已有账号？</span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="ml-2 text-tech-cyan hover:text-tech-cyan/80 transition-colors"
                >
                  立即登录
                </button>
              </div>
            </form>
          </TacticalCard>
        )}

        {/* 步骤2: 完善用户信息 */}
        {step === 2 && (
          <TacticalCard title="完善信息" className="corner-deco">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-alert-red/10 border border-alert-red/30 rounded p-3">
                  <p className="text-sm text-alert-red flex items-center gap-2">
                    <span>⚠</span>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              {/* 手机号 */}
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

              {/* 密码 */}
              <div>
                <label className="block text-xs text-tech-cyan/60 mb-2 tracking-wider">
                  登录密码
                </label>
                <TacticalInput
                  type="password"
                  placeholder="请输入密码（至少6位）"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>

              {/* 确认密码 */}
              <div>
                <label className="block text-xs text-tech-cyan/60 mb-2 tracking-wider">
                  确认密码
                </label>
                <TacticalInput
                  type="password"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>

              {/* 昵称 */}
              <div>
                <label className="block text-xs text-tech-cyan/60 mb-2 tracking-wider">
                  昵称（可选）
                </label>
                <TacticalInput
                  type="text"
                  placeholder="请输入昵称"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  disabled={loading}
                  maxLength={20}
                />
              </div>

              {/* 角色选择（支持多选） */}
              <div>
                <label className="block text-xs text-tech-cyan/60 mb-3 tracking-wider">
                  选择角色（可多选）
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(roleConfig).map(([key, config]) => {
                    const isSelected = formData.roles.includes(key as UserRole);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          const newRoles = isSelected
                            ? formData.roles.filter((r) => r !== key)
                            : [...formData.roles, key as UserRole];
                          setFormData((prev) => ({ ...prev, roles: newRoles }));
                          setError('');
                        }}
                        disabled={loading}
                        className={`
                          p-3 rounded border-2 text-left transition-all
                          ${
                            isSelected
                              ? 'border-tech-cyan bg-tech-cyan/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }
                        `}
                      >
                        <div className={`text-sm font-bold ${config.color}`}>
                          {config.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {config.description}
                        </div>
                        {isSelected && (
                          <div className="mt-2 text-xs text-tech-cyan">
                            ✓ 已选择
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {formData.roles.length > 0 && (
                  <div className="mt-2 text-xs text-gray-400">
                    已选择: {formData.roles.map((r) => getRoleLabel(r)).join('、')}
                  </div>
                )}
              </div>

              {/* 注册按钮 */}
              <div className="flex gap-3">
                <TacticalButton
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1"
                >
                  上一步
                </TacticalButton>
                <TacticalButton
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin">⚙</span>
                      <span>注册中...</span>
                    </span>
                  ) : (
                    <span>完成注册</span>
                  )}
                </TacticalButton>
              </div>
            </form>
          </TacticalCard>
        )}

        {/* 安全提示 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 密码使用SM4国密算法加密存储
          </p>
        </div>
      </div>
    </div>
  );
}
