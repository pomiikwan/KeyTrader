/**
 * 身份脱敏与匿名保护工具
 * KeyTrader 核心安全机制
 */

/**
 * 用户角色类型
 */
export enum UserRole {
  PROJECT_OWNER = 'project_owner', // 项目方
  CAPITAL_PROVIDER = 'capital_provider', // 资金方
  TRADER = 'trader', // 贸易方
  BROKER = 'broker', // 推荐人
  ADMIN = 'admin', // 管理员
}

/**
 * 用户身份信息
 */
export interface UserIdentity {
  id: string; // 完整ID（IDABC1234）
  role: UserRole;
  realName?: string; // 真实姓名（加密存储）
  company?: string; // 公司名称（加密存储）
  isVerified: boolean; // 是否已验证
}

/**
 * 显示规则配置
 */
interface DisplayRule {
  showId: boolean; // 是否显示ID
  showRole: boolean; // 是否显示角色
  showPartialId: boolean; // 是否显示部分ID
  maskChar: string; // 遮罩字符
}

/**
 * 根据角色类型获取显示规则
 */
function getDisplayRule(role: UserRole): DisplayRule {
  switch (role) {
    case UserRole.BROKER:
      // 推荐人：只显示角色，不显示ID
      return {
        showId: false,
        showRole: true,
        showPartialId: false,
        maskChar: '•',
      };
    case UserRole.PROJECT_OWNER:
      // 项目方：显示角色+部分ID
      return {
        showId: false,
        showRole: true,
        showPartialId: true,
        maskChar: '•',
      };
    case UserRole.CAPITAL_PROVIDER:
      // 资金方：显示角色+部分ID
      return {
        showId: false,
        showRole: true,
        showPartialId: true,
        maskChar: '•',
      };
    case UserRole.TRADER:
      // 贸易方：显示角色+部分ID
      return {
        showId: false,
        showRole: true,
        showPartialId: true,
        maskChar: '•',
      };
    default:
      return {
        showId: false,
        showRole: true,
        showPartialId: false,
        maskChar: '•',
      };
  }
}

/**
 * 获取角色显示名称
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.BROKER:
      return '推荐人';
    case UserRole.PROJECT_OWNER:
      return '项目方';
    case UserRole.CAPITAL_PROVIDER:
      return '资金方';
    case UserRole.TRADER:
      return '贸易方';
    case UserRole.ADMIN:
      return '管理员';
    default:
      return '用户';
  }
}

/**
 * 提取ID的部分信息（用于脱敏显示）
 * 例如：IDABC1234 → ABC
 */
function extractPartialId(fullId: string): string {
  // 去掉ID前缀，取前3个字符
  const idWithoutPrefix = fullId.replace(/^ID/i, '');
  return idWithoutPrefix.substring(0, 3).toUpperCase();
}

/**
 * 格式化用户显示名称（核心脱敏函数）
 *
 * @param identity 用户身份信息
 * @param context 显示上下文（可选，用于不同场景的显示规则）
 * @returns 脱敏后的显示名称
 *
 * @example
 * formatUserIdentity({
 *   id: 'IDABC1234',
 *   role: UserRole.BROKER,
 *   isVerified: true
 * })
 * // 返回: "推荐人"
 *
 * formatUserIdentity({
 *   id: 'IDXYZ5678',
 *   role: UserRole.PROJECT_OWNER,
 *   isVerified: true
 * })
 * // 返回: "项目方(XYZ)"
 */
export function formatUserIdentity(
  identity: UserIdentity,
  context?: 'chat' | 'list' | 'detail'
): string {
  const rule = getDisplayRule(identity.role);
  const roleDisplayName = getRoleDisplayName(identity.role);

  // 基础显示：角色名称
  let display = roleDisplayName;

  // 根据规则添加部分ID
  if (rule.showPartialId && identity.id) {
    const partialId = extractPartialId(identity.id);
    display += `(${partialId})`;
  }

  // 根据规则添加完整ID
  if (rule.showId && identity.id) {
    display = identity.id;
  }

  return display;
}

/**
 * 格式化用户ID（完整版本）
 * 仅在管理员界面或用户自己查看时使用
 */
export function formatFullUserId(identity: UserIdentity): string {
  return identity.id;
}

/**
 * 验证是否有权限查看真实身份
 *
 * @param viewerIdentity 查看者的身份
 * @param targetIdentity 被查看者的身份
 * @returns 是否有权限查看
 */
export function canViewRealIdentity(
  viewerIdentity: UserIdentity,
  targetIdentity: UserIdentity
): boolean {
  // 管理员可以查看所有
  if (viewerIdentity.role === UserRole.ADMIN) {
    return true;
  }

  // 用户可以查看自己的真实信息
  if (viewerIdentity.id === targetIdentity.id) {
    return true;
  }

  // TODO: 后续可以添加更多规则，例如：
  // - 推荐人保护机制
  // - 双方同意后可以查看
  // - VIP会员可以查看更多

  return false;
}

/**
 * 推荐人保护：检查是否可以查看推荐人信息
 *
 * @param viewerIdentity 查看者
 * @param brokerIdentity 推荐人
 * @param projectId 项目ID
 * @returns 是否可以查看
 */
export function canViewBrokerInfo(
  viewerIdentity: UserIdentity,
  brokerIdentity: UserIdentity,
  projectId: string
): boolean {
  // 推荐人自己可以查看
  if (viewerIdentity.id === brokerIdentity.id) {
    return true;
  }

  // 管理员可以查看
  if (viewerIdentity.role === UserRole.ADMIN) {
    return true;
  }

  // TODO: 后续可以添加：
  // - 推荐人独家保护期（7天内其他人无法查看）
  // - 推荐人主动公开信息

  return false;
}

/**
 * 生成匿名头像文字
 * 根据角色类型返回对应的字
 */
export function getAvatarText(identity: UserIdentity): string {
  const roleDisplayName = getRoleDisplayName(identity.role);
  return roleDisplayName.charAt(0);
}

/**
 * 获取头像颜色渐变
 * 根据角色类型返回对应的颜色
 */
export function getAvatarGradient(role: UserRole): string {
  switch (role) {
    case UserRole.BROKER:
      return 'from-[hsl(var(--military-olive))] to-[hsl(var(--tactical-green))]';
    case UserRole.PROJECT_OWNER:
      return 'from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))]';
    case UserRole.CAPITAL_PROVIDER:
      return 'from-[hsl(var(--finance-gold))] to-[hsl(var(--tech-cyan))]';
    case UserRole.TRADER:
      return 'from-[hsl(var(--tech-cyan))] to-[hsl(var(--finance-gold))]';
    default:
      return 'from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))]';
  }
}

/**
 * 隐藏敏感信息的提示文本
 */
export const ANONYMITY_HINTS = {
  CHAT: '对方无法看到您的真实身份',
  PROFILE: '您的真实信息已加密保护',
  BROKER_PROTECTED: '推荐人信息已保护',
  VERIFIED_ONLY: '仅已验证用户可查看',
};
