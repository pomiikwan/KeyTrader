/**
 * AI 智能匹配系统类型定义
 * KeyTrader 核心推荐功能
 */

/**
 * 匹配状态枚举
 */
export enum MatchStatus {
  PENDING = 'PENDING',           // 待处理
  VIEWED = 'VIEWED',             // 已查看
  INTERESTED = 'INTERESTED',     // 有意向
  ACCEPTED = 'ACCEPTED',         // 已接受
  REJECTED = 'REJECTED',         // 已拒绝
  EXPIRED = 'EXPIRED',           // 已过期
  COMPLETED = 'COMPLETED',       // 已完成
}

/**
 * 匹配类型枚举
 */
export enum MatchType {
  PROJECT_TO_CAPITAL = 'PROJECT_TO_CAPITAL',   // 项目对接资金
  CAPITAL_TO_PROJECT = 'CAPITAL_TO_PROJECT',   // 资金对接项目
  PROJECT_TO_TRADER = 'PROJECT_TO_TRADER',     // 项目对接贸易
  TRADER_TO_PROJECT = 'TRADER_TO_PROJECT',     // 贸易对接项目
}

/**
 * 匹配分数接口
 */
export interface MatchScore {
  total_score: number;          // 总分 (0-100)
  compatibility_score: number;  // 兼容性分数 (0-100)
  risk_score: number;           // 风险评分 (0-100, 越低越好)
  potential_score: number;      // 潜力分数 (0-100)
  trust_score: number;          // 信任分数 (0-100)

  // 详细分数维度
  dimensions: {
    business_fit: number;       // 业务匹配度 (0-100)
    financial_match: number;    // 财务匹配度 (0-100)
    timeline_alignment: number; // 时间匹配度 (0-100)
    location_proximity: number; // 地理位置匹配 (0-100)
    expertise_match: number;    // 专业能力匹配 (0-100)
    reputation_score: number;   // 声誉评分 (0-100)
  };
}

/**
 * 匹配推荐接口
 */
export interface MatchRecommendation {
  id: string;
  match_type: MatchType;
  status: MatchStatus;

  // 匹配双方
  requester_id: string;          // 请求方ID
  requester_virtual_id: string;  // 请求方虚拟ID
  requester_type: 'PROJECT_OWNER' | 'CAPITAL_PROVIDER' | 'TRADER';

  target_id: string;             // 目标方ID
  target_virtual_id: string;     // 目标方虚拟ID
  target_type: 'PROJECT_OWNER' | 'CAPITAL_PROVIDER' | 'TRADER';

  // 关联项目/资金信息
  project_id?: string;           // 关联的项目ID
  capital_id?: string;           // 关联的资金ID

  // 匹配分数
  match_score: MatchScore;

  // 匹配原因
  reasons: string[];             // 匹配原因列表
  highlights: string[];          // 亮点列表

  // 推荐人信息
  introducer_id?: string;        // 推荐人ID
  introducer_virtual_id?: string; // 推荐人虚拟ID
  is_protected: boolean;         // 是否受推荐人保护

  // 时间信息
  created_at: string;
  expires_at: string;
  viewed_at?: string;
  responded_at?: string;

  // 元数据
  algorithm_version: string;     // 匹配算法版本
  confidence_level: number;      // 置信度 (0-1)
}

/**
 * 匹配历史接口
 */
export interface MatchHistory {
  id: string;
  match_id: string;
  user_id: string;
  action: 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'BOOKMARKED';
  timestamp: string;
  notes?: string;
}

/**
 * 匹配偏好设置接口
 */
export interface MatchPreferences {
  id: string;
  user_id: string;

  // 基本偏好
  preferred_deal_types: MatchType[];
  preferred_locations: string[];
  budget_range: {
    min: number;
    max: number;
  };

  // 行业偏好
  preferred_industries: string[];
  excluded_industries: string[];

  // 时间偏好
  preferred_timeline: {
    start_date?: string;
    end_date?: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  };

  // 匹配敏感度
  sensitivity: {
    score_threshold: number;     // 最低分数阈值 (0-100)
    risk_tolerance: 'LOW' | 'MEDIUM' | 'HIGH';
    prioritize_new_matches: boolean;
  };

  // 通知设置
  notification_settings: {
    notify_on_new_match: boolean;
    notify_on_expiring_match: boolean;
    daily_digest: boolean;
    weekly_summary: boolean;
  };

  // 更新时间
  updated_at: string;
}

/**
 * 匹配统计接口
 */
export interface MatchStats {
  total_matches: number;           // 总匹配数
  pending_matches: number;         // 待处理匹配数
  accepted_matches: number;        // 已接受匹配数
  rejected_matches: number;        // 已拒绝匹配数
  completed_matches: number;       // 已完成匹配数

  // 平均分数
  average_score: number;           // 平均匹配分数
  average_compatibility: number;   // 平均兼容性

  // 成功率
  acceptance_rate: number;         // 接受率 (0-100)

  // 时间统计
  avg_response_time_hours: number; // 平均响应时间（小时）
}

/**
 * 匹配原因模板
 */
export const MATCH_REASON_TEMPLATES = {
  HIGH_COMPATIBILITY: '业务高度兼容，双方需求匹配度达 {score}%',
  GOOD_REPUTATION: '对方拥有良好声誉，信任评分 {score}',
  FINANCIAL_MATCH: '资金规模匹配，预算范围一致',
  LOCATION_PROXIMITY: '地理位置相近，便于沟通协作',
  EXPERTISE_ALIGNMENT: '专业领域高度契合',
  TIMELINE_ALIGNMENT: '项目时间线完美匹配',
  SIMILAR_SUCCESS: '双方有类似成功案例',
  INTRODUCER_VOUCHED: '推荐人已验证并担保',
};

/**
 * 默认匹配偏好设置
 */
export const DEFAULT_MATCH_PREFERENCES: Omit<MatchPreferences, 'id' | 'user_id' | 'updated_at'> = {
  preferred_deal_types: [
    MatchType.PROJECT_TO_CAPITAL,
    MatchType.CAPITAL_TO_PROJECT,
  ],
  preferred_locations: [],
  budget_range: {
    min: 0,
    max: 100000000, // 1亿
  },
  preferred_industries: [],
  excluded_industries: [],
  preferred_timeline: {
    urgency: 'MEDIUM',
  },
  sensitivity: {
    score_threshold: 60,
    risk_tolerance: 'MEDIUM',
    prioritize_new_matches: true,
  },
  notification_settings: {
    notify_on_new_match: true,
    notify_on_expiring_match: true,
    daily_digest: true,
    weekly_summary: false,
  },
};
