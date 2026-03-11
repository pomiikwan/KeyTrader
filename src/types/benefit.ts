/**
 * 利益分配系统类型定义
 * KeyTrader 佣金管理功能
 */

/**
 * 投票记录接口
 */
export interface Vote {
  id: string;
  benefit_id: string;
  voter_id: string;
  vote_type: 'APPROVE' | 'REJECT';
  reason?: string;
  created_at: string;
}

/**
 * 分配状态枚举
 */
export enum BenefitStatus {
  DRAFT = 'DRAFT',           // 草稿
  PENDING = 'PENDING',       // 待投票
  APPROVED = 'APPROVED',     // 已通过
  REJECTED = 'REJECTED',     // 已拒绝
  LOCKED = 'LOCKED',         // 已锁定
  COMPLETED = 'COMPLETED',   // 已完成
}

/**
 * 调整记录接口
 */
export interface AdjustmentRecord {
  id: string;
  benefit_id: string;
  old_ratio: number;
  new_ratio: number;
  reason: string;
  adjusted_by: string;
  adjusted_at: string;
}

/**
 * 利益分配接口
 */
export interface Benefit {
  id: string;
  project_id: string;

  // 分配比例
  introducer_ratio: number;      // 推荐人比例 (0-100)
  platform_ratio: number;        // 平台比例 (0-100)

  // 状态和限制
  status: BenefitStatus;
  adjustment_count: number;      // 调整次数 (最多3次)
  is_locked: boolean;            // 是否锁定

  // 投票信息
  votes?: Vote[];
  approval_count: number;        // 赞成票数
  rejection_count: number;       // 反对票数
  voting_deadline?: string;      // 投票截止时间

  // 金额信息
  total_amount?: number;         // 总金额
  introducer_amount?: number;    // 推荐人应得金额
  platform_amount?: number;      // 平台应得金额

  // 调整历史
  adjustments?: AdjustmentRecord[];

  // 时间戳
  created_at: string;
  updated_at: string;
  locked_at?: string;
}

/**
 * 分配配置接口
 */
export interface BenefitConfig {
  id: string;
  project_id: string;

  // 默认比例
  default_introducer_ratio: number;
  default_platform_ratio: number;

  // 调整限制
  max_adjustments: number;       // 最大调整次数
  adjustment_window_days: number; // 调整窗口期（天）

  // 投票规则
  voting_required: boolean;      // 是否需要投票
  voting_period_hours: number;   // 投票周期（小时）
  min_voters_required: number;   // 最少投票人数
  approval_threshold: number;    // 通过阈值（百分比）

  // 锁定规则
  auto_lock_after_approval: boolean; // 批准后自动锁定
  lock_after_completion: boolean;    // 完成后自动锁定

  // 时间戳
  created_at: string;
  updated_at: string;
}

/**
 * 分配统计接口
 */
export interface BenefitStats {
  total_benefits: number;          // 总分配数
  pending_benefits: number;        // 待投票
  approved_benefits: number;       // 已通过
  rejected_benefits: number;       // 已拒绝
  locked_benefits: number;         // 已锁定
  completed_benefits: number;      // 已完成

  // 金额统计
  total_introducer_amount: number; // 推荐人总金额
  total_platform_amount: number;   // 平台总金额
  pending_amount: number;          // 待结算金额

  // 平均比例
  avg_introducer_ratio: number;    // 平均推荐人比例
  avg_platform_ratio: number;      // 平均平台比例
}

/**
 * 投票请求接口
 */
export interface VoteRequest {
  benefit_id: string;
  voter_id: string;
  vote_type: 'APPROVE' | 'REJECT';
  reason?: string;
}

/**
 * 调整请求接口
 */
export interface AdjustmentRequest {
  benefit_id: string;
  new_introducer_ratio?: number;
  new_platform_ratio?: number;
  reason: string;
}

/**
 * 默认分配配置
 */
export const DEFAULT_BENEFIT_CONFIG: Omit<BenefitConfig, 'id' | 'project_id' | 'created_at' | 'updated_at'> = {
  default_introducer_ratio: 5.0,
  default_platform_ratio: 2.0,
  max_adjustments: 3,
  adjustment_window_days: 7,
  voting_required: true,
  voting_period_hours: 72,
  min_voters_required: 2,
  approval_threshold: 66.67,
  auto_lock_after_approval: true,
  lock_after_completion: true,
};
