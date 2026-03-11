import { useMemo } from 'react';
import { useAuthStore } from '@/store';
import type { UserIdentity } from '@/lib/identity';
import {
  UserRole,
  formatUserIdentity,
  formatFullUserId,
  canViewRealIdentity,
  canViewBrokerInfo,
  getAvatarText,
  getAvatarGradient,
  ANONYMITY_HINTS,
} from '@/lib/identity';

/**
 * 身份管理 Hook
 * 提供统一的身份脱敏和匿名保护功能
 */
export function useIdentity() {
  const { user } = useAuthStore();

  /**
   * 将用户数据转换为身份对象
   */
  const parseUserIdentity = (userData: any): UserIdentity | null => {
    if (!userData) return null;

    return {
      id: userData.id || userData.userId || '',
      role: userData.role || UserRole.PROJECT_OWNER,
      realName: userData.realName,
      company: userData.company,
      isVerified: userData.isVerified || userData.verified || false,
    };
  };

  /**
   * 格式化当前用户身份
   */
  const formatMyIdentity = (context?: 'chat' | 'list' | 'detail'): string => {
    if (!user) return '我';

    const identity = parseUserIdentity(user);
    if (!identity) return '我';

    return formatUserIdentity(identity, context);
  };

  /**
   * 格式化其他用户身份
   */
  const formatOtherIdentity = (
    otherUser: any,
    context?: 'chat' | 'list' | 'detail'
  ): string => {
    const identity = parseUserIdentity(otherUser);
    if (!identity) return '用户';

    return formatUserIdentity(identity, context);
  };

  /**
   * 检查是否可以查看真实身份
   */
  const checkCanViewRealIdentity = (targetUser: any): boolean => {
    if (!user) return false;

    const myIdentity = parseUserIdentity(user);
    const targetIdentity = parseUserIdentity(targetUser);

    if (!myIdentity || !targetIdentity) return false;

    return canViewRealIdentity(myIdentity, targetIdentity);
  };

  /**
   * 检查是否可以查看推荐人信息
   */
  const checkCanViewBroker = (brokerUser: any, projectId: string): boolean => {
    if (!user) return false;

    const myIdentity = parseUserIdentity(user);
    const brokerIdentity = parseUserIdentity(brokerUser);

    if (!myIdentity || !brokerIdentity) return false;

    return canViewBrokerInfo(myIdentity, brokerIdentity, projectId);
  };

  /**
   * 获取用户头像文字
   */
  const getUserAvatarText = (userData: any): string => {
    // 如果是自己，显示"我"
    if (userData?.id === user?.id) return '我';

    const identity = parseUserIdentity(userData);
    if (!identity) return '用';

    return getAvatarText(identity);
  };

  /**
   * 获取用户头像颜色
   */
  const getUserAvatarGradient = (userData: any): string => {
    const identity = parseUserIdentity(userData);
    if (!identity) return getAvatarGradient(UserRole.PROJECT_OWNER);

    return getAvatarGradient(identity.role);
  };

  /**
   * 模拟用户数据（开发阶段使用）
   * TODO: 后续接入真实API后移除
   */
  const mockUserIdentity = (
    role: UserRole,
    id: string,
    isVerified: boolean = true
  ): UserIdentity => {
    return {
      id,
      role,
      isVerified,
    };
  };

  return {
    // 当前用户信息
    currentUser: user ? parseUserIdentity(user) : null,

    // 格式化方法
    formatMyIdentity,
    formatOtherIdentity,
    formatFullUserId,

    // 权限检查
    checkCanViewRealIdentity,
    checkCanViewBroker,

    // 头像相关
    getUserAvatarText,
    getUserAvatarGradient,

    // 工具方法
    parseUserIdentity,
    mockUserIdentity,

    // 常量
    hints: ANONYMITY_HINTS,
    roles: UserRole,
  };
}
