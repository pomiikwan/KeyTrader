/**
 * 推荐人保护机制类型定义
 * KeyTrader 核心特色功能
 */

/**
 * 保护状态枚举
 */
export enum ProtectionStatus {
  ACTIVE = 'ACTIVE',           // 激活中
  PENDING = 'PENDING',         // 待确认
  EXPIRED = 'EXPIRED',         // 已过期
  VIOLATED = 'VIOLATED',       // 已违约
  COMPLETED = 'COMPLETED',     // 已完成
}

/**
 * 保护类型枚举
 */
export enum ProtectionType {
  EXCLUSIVE = 'EXCLUSIVE',     // 独家保护
  NON_EXCLUSIVE = 'NON_EXCLUSIVE',  // 非独家保护
  TIME_LIMITED = 'TIME_LIMITED',    // 限时保护
}

/**
 * 违约行为类型
 */
export enum ViolationType {
  DIRECT_CONTACT = 'DIRECT_CONTACT',           // 私下联系
  BYPASSING_INTRODUCER = 'BYPASSING_INTRODUCER',  // 绕过推荐人
  SELF_DEALING = 'SELF_DEALING',               // 自行交易
  UNAUTHORIZED_DISCLOSURE = 'UNAUTHORIZED_DISCLOSURE',  // 泄露信息
}

/**
 * 推荐人保护记录接口
 */
export interface BrokerProtection {
  id: string;
  project_id: string;
  introducer_id: string;              // 推荐人ID
  introducer_virtual_id: string;      // 推荐人虚拟ID
  project_owner_id: string;           // 项目方ID
  capital_provider_id?: string;       // 资金方ID（如果有）

  // 保护配置
  protection_type: ProtectionType;
  protection_status: ProtectionStatus;

  // 时间设置
  start_date: string;
  end_date?: string;
  validity_period_days: number;       // 有效期（天）

  // 权益配置
  commission_rate: number;            // 佣金比例（0-100）
  minimum_guarantee?: number;         // 最低保证金

  // 保护条款
  protection_terms: string[];         // 保护条款列表

  // 违约记录
  violations?: ViolationRecord[];     // 违约记录
  violation_count: number;            // 违约次数

  // 时间戳
  created_at: string;
  updated_at: string;
}

/**
 * 违约记录接口
 */
export interface ViolationRecord {
  id: string;
  protection_id: string;
  violation_type: ViolationType;
  violator_id: string;                // 违约者ID
  violator_virtual_id: string;        // 违约者虚拟ID
  description: string;                // 违约描述
  evidence?: string[];                // 证据（图片、文件等）
  reported_by: string;                // 举报人ID
  reported_at: string;                // 举报时间
  status: 'PENDING' | 'CONFIRMED' | 'DISMISSED';  // 处理状态
  penalty?: string;                   // 处罚措施
  resolved_at?: string;               // 解决时间
}

/**
 * 保护统计接口
 */
export interface ProtectionStats {
  total_protections: number;          // 总保护数
  active_protections: number;         // 激活中的保护
  completed_protections: number;      // 已完成的保护
  violated_protections: number;       // 已违约的保护
  total_commission_earned: number;    // 总佣金收入
  pending_commission: number;         // 待结算佣金
}

/**
 * 保护条款模板
 */
export interface ProtectionTerm {
  id: string;
  title: string;
  description: string;
  is_required: boolean;               // 是否必选
  category: 'CONTACT' | 'TRANSACTION' | 'DISCLOSURE' | 'GENERAL';
}

/**
 * 预设的保护条款
 */
export const DEFAULT_PROTECTION_TERMS: ProtectionTerm[] = [
  {
    id: 'no_direct_contact',
    title: '禁止私下联系',
    description: '在保护期内，项目方与资金方不得通过本平台以外的任何方式进行联系',
    is_required: true,
    category: 'CONTACT',
  },
  {
    id: 'platform_transaction_only',
    title: '平台交易原则',
    description: '所有交易必须通过 KeyTrader 平台进行，不得绕过推荐人私下交易',
    is_required: true,
    category: 'TRANSACTION',
  },
  {
    id: 'commission_protection',
    title: '佣金权益保护',
    description: '推荐人有权获得匹配成功后的约定比例佣金，任何绕过行为将视为违约',
    is_required: true,
    category: 'TRANSACTION',
  },
  {
    id: 'confidentiality',
    title: '信息保密义务',
    description: '不得向第三方泄露任何交易信息、联系方式或商业机密',
    is_required: true,
    category: 'DISCLOSURE',
  },
  {
    id: 'exclusive_matching',
    title: '独家匹配权',
    description: '推荐人推荐的匹配对象在保护期内享有独家优先权',
    is_required: false,
    category: 'GENERAL',
  },
];
