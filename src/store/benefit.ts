import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Benefit,
  BenefitStats,
  BenefitConfig,
  BenefitStatus,
  AdjustmentRecord,
  Vote,
} from '@/types/benefit';

/**
 * 利益分配 Store
 * 管理所有利益分配的状态和操作
 */
interface BenefitStore {
  // 状态
  benefits: Benefit[];
  configs: BenefitConfig[];
  selectedBenefit: Benefit | null;
  filter: {
    status?: BenefitStatus;
    project_id?: string;
  };

  // 操作方法
  addBenefit: (benefit: Omit<Benefit, 'id' | 'created_at' | 'updated_at'>) => void;
  updateBenefit: (id: string, updates: Partial<Benefit>) => void;
  deleteBenefit: (id: string) => void;
  selectBenefit: (id: string | null) => void;

  // 调整相关
  requestAdjustment: (benefitId: string, newRatio: number, reason: string) => void;
  approveAdjustment: (benefitId: string) => void;
  lockBenefit: (benefitId: string) => void;

  // 投票相关
  castVote: (benefitId: string, voterId: string, voteType: 'APPROVE' | 'REJECT', reason?: string) => void;

  // 配置相关
  updateConfig: (projectId: string, config: Partial<BenefitConfig>) => void;

  // 查询方法
  getBenefitById: (id: string) => Benefit | undefined;
  getBenefitsByProject: (projectId: string) => Benefit[];
  getStats: () => BenefitStats;
}

/**
 * 生成ID
 */
function generateId(): string {
  return `ben_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 模拟利益分配数据
 */
const mockBenefits: Benefit[] = [
  {
    id: 'ben_001',
    project_id: 'proj_001',
    introducer_ratio: 5.0,
    platform_ratio: 2.0,
    status: 'APPROVED',
    adjustment_count: 0,
    is_locked: false,
    votes: [],
    approval_count: 3,
    rejection_count: 0,
    total_amount: 1000000,
    introducer_amount: 50000,
    platform_amount: 20000,
    adjustments: [],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ben_002',
    project_id: 'proj_002',
    introducer_ratio: 3.5,
    platform_ratio: 2.5,
    status: 'PENDING',
    adjustment_count: 1,
    is_locked: false,
    votes: [],
    approval_count: 1,
    rejection_count: 0,
    voting_deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    adjustments: [
      {
        id: 'adj_001',
        benefit_id: 'ben_002',
        old_ratio: 5.0,
        new_ratio: 3.5,
        reason: '项目规模较大，适当降低比例',
        adjusted_by: 'user_001',
        adjusted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ben_003',
    project_id: 'proj_003',
    introducer_ratio: 6.0,
    platform_ratio: 2.0,
    status: 'LOCKED',
    adjustment_count: 0,
    is_locked: true,
    votes: [],
    approval_count: 4,
    rejection_count: 0,
    total_amount: 2000000,
    introducer_amount: 120000,
    platform_amount: 40000,
    adjustments: [],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    locked_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * 创建利益分配 Store
 */
export const useBenefitStore = create<BenefitStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      benefits: mockBenefits,
      configs: [],
      selectedBenefit: null,
      filter: {},

      // 添加利益分配
      addBenefit: (benefit) => {
        const newBenefit: Benefit = {
          ...benefit,
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({
          benefits: [newBenefit, ...state.benefits],
        }));
      },

      // 更新利益分配
      updateBenefit: (id, updates) => {
        set((state) => ({
          benefits: state.benefits.map((ben) =>
            ben.id === id
              ? { ...ben, ...updates, updated_at: new Date().toISOString() }
              : ben
          ),
        }));

        // 更新选中的分配
        const { selectedBenefit } = get();
        if (selectedBenefit?.id === id) {
          set({
            selectedBenefit: {
              ...selectedBenefit,
              ...updates,
              updated_at: new Date().toISOString(),
            },
          });
        }
      },

      // 删除利益分配
      deleteBenefit: (id) => {
        set((state) => ({
          benefits: state.benefits.filter((ben) => ben.id !== id),
          selectedBenefit: state.selectedBenefit?.id === id ? null : state.selectedBenefit,
        }));
      },

      // 选中利益分配
      selectBenefit: (id) => {
        const benefit = id ? get().benefits.find((b) => b.id === id) || null : null;
        set({ selectedBenefit: benefit });
      },

      // 请求调整
      requestAdjustment: (benefitId, newRatio, reason) => {
        const benefit = get().benefits.find((b) => b.id === benefitId);
        if (!benefit) return;

        if (benefit.adjustment_count >= 3) {
          console.warn('已达到最大调整次数（3次）');
          return;
        }

        const adjustment: AdjustmentRecord = {
          id: generateId(),
          benefit_id: benefitId,
          old_ratio: benefit.introducer_ratio,
          new_ratio: newRatio,
          reason,
          adjusted_by: 'current_user', // TODO: 从用户状态获取
          adjusted_at: new Date().toISOString(),
        };

        set((state) => ({
          benefits: state.benefits.map((ben) =>
            ben.id === benefitId
              ? {
                  ...ben,
                  introducer_ratio: newRatio,
                  adjustment_count: ben.adjustment_count + 1,
                  adjustments: [...(ben.adjustments || []), adjustment],
                  status: 'PENDING' as BenefitStatus,
                  updated_at: new Date().toISOString(),
                }
              : ben
          ),
        }));
      },

      // 批准调整
      approveAdjustment: (benefitId) => {
        set((state) => ({
          benefits: state.benefits.map((ben) =>
            ben.id === benefitId
              ? { ...ben, status: 'APPROVED' as BenefitStatus, updated_at: new Date().toISOString() }
              : ben
          ),
        }));
      },

      // 锁定分配
      lockBenefit: (benefitId) => {
        set((state) => ({
          benefits: state.benefits.map((ben) =>
            ben.id === benefitId
              ? {
                  ...ben,
                  is_locked: true,
                  status: 'LOCKED' as BenefitStatus,
                  locked_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : ben
          ),
        }));
      },

      // 投票
      castVote: (benefitId, voterId, voteType, reason) => {
        const vote: Vote = {
          id: generateId(),
          benefit_id: benefitId,
          voter_id: voterId,
          vote_type: voteType,
          reason,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          benefits: state.benefits.map((ben) =>
            ben.id === benefitId
              ? {
                  ...ben,
                  votes: [...(ben.votes || []), vote],
                  approval_count: voteType === 'APPROVE' ? ben.approval_count + 1 : ben.approval_count,
                  rejection_count: voteType === 'REJECT' ? ben.rejection_count + 1 : ben.rejection_count,
                  updated_at: new Date().toISOString(),
                }
              : ben
          ),
        }));
      },

      // 更新配置
      updateConfig: (projectId, config) => {
        set((state) => {
          const existingConfig = state.configs.find((c) => c.project_id === projectId);

          if (existingConfig) {
            return {
              configs: state.configs.map((c) =>
                c.project_id === projectId
                  ? { ...c, ...config, updated_at: new Date().toISOString() }
                  : c
              ),
            };
          } else {
            const newConfig: BenefitConfig = {
              ...config,
              id: generateId(),
              project_id: projectId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as BenefitConfig;

            return {
              configs: [...state.configs, newConfig],
            };
          }
        });
      },

      // 根据ID获取分配
      getBenefitById: (id) => {
        return get().benefits.find((ben) => ben.id === id);
      },

      // 根据项目ID获取分配
      getBenefitsByProject: (projectId) => {
        return get().benefits.filter((ben) => ben.project_id === projectId);
      },

      // 获取统计信息
      getStats: () => {
        const { benefits } = get();
        const pendingBenefits = benefits.filter((b) => b.status === 'PENDING');
        const approvedBenefits = benefits.filter((b) => b.status === 'APPROVED');
        const rejectedBenefits = benefits.filter((b) => b.status === 'REJECTED');
        const lockedBenefits = benefits.filter((b) => b.status === 'LOCKED');
        const completedBenefits = benefits.filter((b) => b.status === 'COMPLETED');

        const totalIntroducerAmount = benefits.reduce(
          (sum, b) => sum + (b.introducer_amount || 0),
          0
        );
        const totalPlatformAmount = benefits.reduce(
          (sum, b) => sum + (b.platform_amount || 0),
          0
        );
        const pendingAmount = pendingBenefits.reduce(
          (sum, b) => sum + (b.total_amount || 0),
          0
        );

        const avgIntroducerRatio =
          benefits.reduce((sum, b) => sum + b.introducer_ratio, 0) / benefits.length || 0;
        const avgPlatformRatio =
          benefits.reduce((sum, b) => sum + b.platform_ratio, 0) / benefits.length || 0;

        return {
          total_benefits: benefits.length,
          pending_benefits: pendingBenefits.length,
          approved_benefits: approvedBenefits.length,
          rejected_benefits: rejectedBenefits.length,
          locked_benefits: lockedBenefits.length,
          completed_benefits: completedBenefits.length,
          total_introducer_amount: totalIntroducerAmount,
          total_platform_amount: totalPlatformAmount,
          pending_amount: pendingAmount,
          avg_introducer_ratio: Math.round(avgIntroducerRatio * 10) / 10,
          avg_platform_ratio: Math.round(avgPlatformRatio * 10) / 10,
        };
      },
    }),
    {
      name: 'benefit-storage',
      partialize: (state) => ({
        benefits: state.benefits,
        configs: state.configs,
      }),
    }
  )
);

/**
 * 便捷 hooks
 */
export const useBenefits = () => useBenefitStore((state) => state.benefits);
export const useSelectedBenefit = () => useBenefitStore((state) => state.selectedBenefit);

// 使用缓存避免无限循环
export const useBenefitStats = () => {
  const stats = useBenefitStore((state) => {
    const { benefits } = state;
    const pendingBenefits = benefits.filter((b) => b.status === 'PENDING');
    const approvedBenefits = benefits.filter((b) => b.status === 'APPROVED');
    const rejectedBenefits = benefits.filter((b) => b.status === 'REJECTED');
    const lockedBenefits = benefits.filter((b) => b.status === 'LOCKED');
    const completedBenefits = benefits.filter((b) => b.status === 'COMPLETED');

    const totalIntroducerAmount = benefits.reduce(
      (sum, b) => sum + (b.introducer_amount || 0),
      0
    );
    const totalPlatformAmount = benefits.reduce(
      (sum, b) => sum + (b.platform_amount || 0),
      0
    );
    const pendingAmount = pendingBenefits.reduce(
      (sum, b) => sum + (b.total_amount || 0),
      0
    );

    const avgIntroducerRatio =
      benefits.reduce((sum, b) => sum + b.introducer_ratio, 0) / benefits.length || 0;
    const avgPlatformRatio =
      benefits.reduce((sum, b) => sum + b.platform_ratio, 0) / benefits.length || 0;

    return {
      total_benefits: benefits.length,
      pending_benefits: pendingBenefits.length,
      approved_benefits: approvedBenefits.length,
      rejected_benefits: rejectedBenefits.length,
      locked_benefits: lockedBenefits.length,
      completed_benefits: completedBenefits.length,
      total_introducer_amount: totalIntroducerAmount,
      total_platform_amount: totalPlatformAmount,
      pending_amount: pendingAmount,
      avg_introducer_ratio: Math.round(avgIntroducerRatio * 10) / 10,
      avg_platform_ratio: Math.round(avgPlatformRatio * 10) / 10,
    };
  });

  return stats;
};
