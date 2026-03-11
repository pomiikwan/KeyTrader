import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MatchRecommendation,
  MatchStats,
  MatchPreferences,
  MatchStatus,
  MatchHistory,
} from '@/types/matching';

/**
 * AI 智能匹配 Store
 * 管理所有匹配推荐的状态和操作
 */
interface MatchingStore {
  // 状态
  matches: MatchRecommendation[];
  selectedMatch: MatchRecommendation | null;
  preferences: MatchPreferences | null;
  history: MatchHistory[];
  filter: {
    status?: MatchStatus;
    match_type?: string;
  };

  // 操作方法
  addMatch: (match: Omit<MatchRecommendation, 'id' | 'created_at'>) => void;
  updateMatchStatus: (matchId: string, status: MatchStatus) => void;
  deleteMatch: (matchId: string) => void;
  selectMatch: (matchId: string | null) => void;
  bookmarkMatch: (matchId: string) => void;

  // 偏好设置
  updatePreferences: (preferences: MatchPreferences) => void;
  resetPreferences: () => void;

  // 查询方法
  getMatchById: (id: string) => MatchRecommendation | undefined;
  getMatchesByUser: (userId: string) => MatchRecommendation[];
  getPendingMatches: () => MatchRecommendation[];
  getStats: () => MatchStats;
}

/**
 * 生成匹配ID
 */
function generateId(): string {
  return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 模拟匹配数据
 */
const mockMatches: MatchRecommendation[] = [
  {
    id: 'match_001',
    match_type: 'PROJECT_TO_CAPITAL',
    status: 'PENDING',
    requester_id: 'user_002',
    requester_virtual_id: 'IDPROJ5678',
    requester_type: 'PROJECT_OWNER',
    target_id: 'user_003',
    target_virtual_id: 'IDCAPT9012',
    target_type: 'CAPITAL_PROVIDER',
    project_id: 'proj_001',
    match_score: {
      total_score: 85,
      compatibility_score: 88,
      risk_score: 15,
      potential_score: 82,
      trust_score: 90,
      dimensions: {
        business_fit: 90,
        financial_match: 85,
        timeline_alignment: 88,
        location_proximity: 75,
        expertise_match: 92,
        reputation_score: 90,
      },
    },
    reasons: [
      '业务高度兼容，双方需求匹配度达 90%',
      '对方拥有良好声誉，信任评分 90',
      '资金规模匹配，预算范围一致',
    ],
    highlights: [
      '项目方拥有丰富行业经验',
      '资金方投资偏好匹配',
      '地理位置相近，便于沟通',
    ],
    is_protected: true,
    introducer_id: 'user_001',
    introducer_virtual_id: 'IDABCD1234',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    algorithm_version: 'v1.0.0',
    confidence_level: 0.85,
  },
  {
    id: 'match_002',
    match_type: 'CAPITAL_TO_PROJECT',
    status: 'VIEWED',
    requester_id: 'user_003',
    requester_virtual_id: 'IDCAPT9012',
    requester_type: 'CAPITAL_PROVIDER',
    target_id: 'user_004',
    target_virtual_id: 'IDPROJ3456',
    target_type: 'PROJECT_OWNER',
    capital_id: 'capital_001',
    match_score: {
      total_score: 78,
      compatibility_score: 75,
      risk_score: 20,
      potential_score: 80,
      trust_score: 85,
      dimensions: {
        business_fit: 80,
        financial_match: 75,
        timeline_alignment: 70,
        location_proximity: 85,
        expertise_match: 78,
        reputation_score: 85,
      },
    },
    reasons: [
      '资金规模匹配，预算范围一致',
      '专业领域高度契合',
      '项目时间线完美匹配',
    ],
    highlights: [
      '资金方投资意向明确',
      '项目方团队实力强',
      '合作预期收益良好',
    ],
    is_protected: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    viewed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    algorithm_version: 'v1.0.0',
    confidence_level: 0.78,
  },
  {
    id: 'match_003',
    match_type: 'PROJECT_TO_CAPITAL',
    status: 'ACCEPTED',
    requester_id: 'user_004',
    requester_virtual_id: 'IDPROJ3456',
    requester_type: 'PROJECT_OWNER',
    target_id: 'user_005',
    target_virtual_id: 'IDCAPT7890',
    target_type: 'CAPITAL_PROVIDER',
    project_id: 'proj_002',
    match_score: {
      total_score: 92,
      compatibility_score: 95,
      risk_score: 8,
      potential_score: 90,
      trust_score: 88,
      dimensions: {
        business_fit: 95,
        financial_match: 92,
        timeline_alignment: 90,
        location_proximity: 88,
        expertise_match: 94,
        reputation_score: 88,
      },
    },
    reasons: [
      '业务高度兼容，双方需求匹配度达 95%',
      '双方有类似成功案例',
      '项目时间线完美匹配',
    ],
    highlights: [
      '高度匹配的合作机会',
      '双方沟通顺畅',
      '推荐人已验证并担保',
    ],
    is_protected: true,
    introducer_id: 'user_001',
    introducer_virtual_id: 'IDABCD1234',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    viewed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    responded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    algorithm_version: 'v1.0.0',
    confidence_level: 0.92,
  },
];

/**
 * 默认匹配偏好
 */
const defaultPreferences: Omit<MatchPreferences, 'id' | 'user_id' | 'updated_at'> = {
  preferred_deal_types: ['PROJECT_TO_CAPITAL', 'CAPITAL_TO_PROJECT'],
  preferred_locations: [],
  budget_range: {
    min: 0,
    max: 100000000,
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

/**
 * 创建匹配 Store
 */
export const useMatchingStore = create<MatchingStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      matches: mockMatches,
      selectedMatch: null,
      preferences: null,
      history: [],
      filter: {},

      // 添加匹配
      addMatch: (match) => {
        const newMatch: MatchRecommendation = {
          ...match,
          id: generateId(),
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          matches: [newMatch, ...state.matches],
        }));
      },

      // 更新匹配状态
      updateMatchStatus: (matchId, status) => {
        const now = new Date().toISOString();

        set((state) => ({
          matches: state.matches.map((match) =>
            match.id === matchId
              ? {
                  ...match,
                  status,
                  ...(status === 'VIEWED' && !match.viewed_at ? { viewed_at: now } : {}),
                  ...(status === 'ACCEPTED' || status === 'REJECTED' ? { responded_at: now } : {}),
                }
              : match
          ),
        }));

        // 添加到历史记录
        const historyEntry: MatchHistory = {
          id: generateId(),
          match_id: matchId,
          user_id: get().matches.find((m) => m.id === matchId)?.requester_id || '',
          action: status as any,
          timestamp: now,
        };

        set((state) => ({
          history: [historyEntry, ...state.history],
        }));
      },

      // 删除匹配
      deleteMatch: (matchId) => {
        set((state) => ({
          matches: state.matches.filter((match) => match.id !== matchId),
          selectedMatch: state.selectedMatch?.id === matchId ? null : state.selectedMatch,
        }));
      },

      // 选中匹配
      selectMatch: (matchId) => {
        const match = matchId ? get().matches.find((m) => m.id === matchId) || null : null;
        set({ selectedMatch: match });

        // 如果是待处理状态，自动标记为已查看
        if (match && match.status === 'PENDING') {
          get().updateMatchStatus(matchId, 'VIEWED');
        }
      },

      // 收藏匹配
      bookmarkMatch: (matchId) => {
        const historyEntry: MatchHistory = {
          id: generateId(),
          match_id: matchId,
          user_id: get().matches.find((m) => m.id === matchId)?.requester_id || '',
          action: 'BOOKMARKED',
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          history: [historyEntry, ...state.history],
        }));
      },

      // 更新偏好设置
      updatePreferences: (preferences) => {
        set({
          preferences: {
            ...preferences,
            updated_at: new Date().toISOString(),
          },
        });
      },

      // 重置偏好设置
      resetPreferences: () => {
        set({
          preferences: null,
        });
      },

      // 根据ID获取匹配
      getMatchById: (id) => {
        return get().matches.find((match) => match.id === id);
      },

      // 根据用户ID获取匹配
      getMatchesByUser: (userId) => {
        return get().matches.filter(
          (match) => match.requester_id === userId || match.target_id === userId
        );
      },

      // 获取待处理匹配
      getPendingMatches: () => {
        return get().matches.filter((match) => match.status === 'PENDING');
      },

      // 获取统计信息
      getStats: () => {
        const { matches } = get();
        const pendingMatches = matches.filter((m) => m.status === 'PENDING');
        const acceptedMatches = matches.filter((m) => m.status === 'ACCEPTED');
        const rejectedMatches = matches.filter((m) => m.status === 'REJECTED');
        const completedMatches = matches.filter((m) => m.status === 'COMPLETED');

        const averageScore =
          matches.reduce((sum, m) => sum + m.match_score.total_score, 0) / matches.length || 0;
        const averageCompatibility =
          matches.reduce((sum, m) => sum + m.match_score.compatibility_score, 0) /
            matches.length || 0;

        const acceptanceRate =
          (acceptedMatches.length / (acceptedMatches.length + rejectedMatches.length)) * 100 ||
          0;

        return {
          total_matches: matches.length,
          pending_matches: pendingMatches.length,
          accepted_matches: acceptedMatches.length,
          rejected_matches: rejectedMatches.length,
          completed_matches: completedMatches.length,
          average_score: Math.round(averageScore),
          average_compatibility: Math.round(averageCompatibility),
          acceptance_rate: Math.round(acceptanceRate),
          avg_response_time_hours: 24, // 模拟数据
        };
      },
    }),
    {
      name: 'matching-storage',
      partialize: (state) => ({
        matches: state.matches,
        preferences: state.preferences,
        history: state.history,
      }),
    }
  )
);

/**
 * 便捷 hooks
 */
export const useMatches = () => useMatchingStore((state) => state.matches);
export const useSelectedMatch = () => useMatchingStore((state) => state.selectedMatch);

// 使用缓存避免无限循环
export const useMatchStats = () => {
  const stats = useMatchingStore((state) => {
    const { matches } = state;
    const pendingMatches = matches.filter((m) => m.status === 'PENDING');
    const acceptedMatches = matches.filter((m) => m.status === 'ACCEPTED');
    const rejectedMatches = matches.filter((m) => m.status === 'REJECTED');
    const completedMatches = matches.filter((m) => m.status === 'COMPLETED');

    const averageScore =
      matches.reduce((sum, m) => sum + m.match_score.total_score, 0) / matches.length || 0;
    const averageCompatibility =
      matches.reduce((sum, m) => sum + m.match_score.compatibility_score, 0) /
        matches.length || 0;

    const acceptanceRate =
      (acceptedMatches.length / (acceptedMatches.length + rejectedMatches.length)) * 100 ||
      0;

    return {
      total_matches: matches.length,
      pending_matches: pendingMatches.length,
      accepted_matches: acceptedMatches.length,
      rejected_matches: rejectedMatches.length,
      completed_matches: completedMatches.length,
      average_score: Math.round(averageScore),
      average_compatibility: Math.round(averageCompatibility),
      acceptance_rate: Math.round(acceptanceRate),
      avg_response_time_hours: 24, // 模拟数据
    };
  });

  return stats;
};

export const usePendingMatches = () => useMatchingStore((state) => state.getPendingMatches());
