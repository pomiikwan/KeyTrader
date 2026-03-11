import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BrokerProtection,
  ProtectionStats,
  ViolationRecord,
} from '@/types/broker-protection';
import { ProtectionStatus, ProtectionType } from '@/types/broker-protection';

/**
 * 推荐人保护 Store
 * 管理所有推荐人保护记录的状态和操作
 */
interface BrokerProtectionStore {
  // 状态
  protections: BrokerProtection[];
  selectedProtection: BrokerProtection | null;
  filter: {
    status?: ProtectionStatus;
    project_id?: string;
    introducer_id?: string;
  };

  // 操作方法
  addProtection: (protection: Omit<BrokerProtection, 'id' | 'created_at' | 'updated_at'>) => void;
  updateProtection: (id: string, updates: Partial<BrokerProtection>) => void;
  deleteProtection: (id: string) => void;
  selectProtection: (id: string | null) => void;

  // 违约处理
  reportViolation: (violation: Omit<ViolationRecord, 'id' | 'reported_at'>) => void;
  resolveViolation: (protectionId: string, violationId: string, resolution: { status: 'CONFIRMED' | 'DISMISSED', penalty?: string }) => void;

  // 查询方法
  getProtectionById: (id: string) => BrokerProtection | undefined;
  getProtectionsByProject: (projectId: string) => BrokerProtection[];
  getProtectionsByIntroducer: (introducerId: string) => BrokerProtection[];
  getStats: (introducerId?: string) => ProtectionStats;
}

/**
 * 生成保护记录ID
 */
function generateId(): string {
  return `prot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 模拟保护数据
 */
const mockProtections: BrokerProtection[] = [
  {
    id: 'prot_001',
    project_id: 'proj_001',
    introducer_id: 'user_001',
    introducer_virtual_id: 'IDABCD1234',
    project_owner_id: 'user_002',
    capital_provider_id: 'user_003',
    protection_type: ProtectionType.EXCLUSIVE,
    protection_status: ProtectionStatus.ACTIVE,
    start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    validity_period_days: 30,
    commission_rate: 5.0,
    minimum_guarantee: 10000,
    protection_terms: [
      '禁止私下联系',
      '平台交易原则',
      '佣金权益保护',
    ],
    violations: [],
    violation_count: 0,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prot_002',
    project_id: 'proj_002',
    introducer_id: 'user_001',
    introducer_virtual_id: 'IDABCD1234',
    project_owner_id: 'user_004',
    protection_type: ProtectionType.TIME_LIMITED,
    protection_status: ProtectionStatus.COMPLETED,
    start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    validity_period_days: 30,
    commission_rate: 3.5,
    protection_terms: [
      '禁止私下联系',
      '平台交易原则',
    ],
    violations: [],
    violation_count: 0,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * 创建推荐人保护 Store
 */
export const useBrokerProtectionStore = create<BrokerProtectionStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      protections: mockProtections,
      selectedProtection: null,
      filter: {},

      // 添加保护记录
      addProtection: (protection) => {
        const newProtection: BrokerProtection = {
          ...protection,
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({
          protections: [newProtection, ...state.protections],
        }));
      },

      // 更新保护记录
      updateProtection: (id, updates) => {
        set((state) => ({
          protections: state.protections.map((prot) =>
            prot.id === id
              ? { ...prot, ...updates, updated_at: new Date().toISOString() }
              : prot
          ),
        }));

        // 如果更新的是当前选中的保护记录，同步更新选中状态
        const { selectedProtection } = get();
        if (selectedProtection?.id === id) {
          set({
            selectedProtection: {
              ...selectedProtection,
              ...updates,
              updated_at: new Date().toISOString(),
            },
          });
        }
      },

      // 删除保护记录
      deleteProtection: (id) => {
        set((state) => ({
          protections: state.protections.filter((prot) => prot.id !== id),
          selectedProtection: state.selectedProtection?.id === id ? null : state.selectedProtection,
        }));
      },

      // 选中保护记录
      selectProtection: (id) => {
        const protection = id ? get().protections.find((p) => p.id === id) || null : null;
        set({ selectedProtection: protection });
      },

      // 举报违约
      reportViolation: (violation) => {
        const newViolation: ViolationRecord = {
          ...violation,
          id: generateId(),
          reported_at: new Date().toISOString(),
        };

        set((state) => ({
          protections: state.protections.map((prot) =>
            prot.id === violation.protection_id
              ? {
                  ...prot,
                  violations: [...(prot.violations || []), newViolation],
                  violation_count: prot.violation_count + 1,
                  protection_status: 'VIOLATED' as ProtectionStatus,
                  updated_at: new Date().toISOString(),
                }
              : prot
          ),
        }));
      },

      // 解决违约争议
      resolveViolation: (protectionId, violationId, resolution) => {
        set((state) => ({
          protections: state.protections.map((prot) => {
            if (prot.id !== protectionId) return prot;

            const updatedViolations = (prot.violations || []).map((v) =>
              v.id === violationId
                ? {
                    ...v,
                    status: resolution.status,
                    penalty: resolution.penalty,
                    resolved_at: new Date().toISOString(),
                  }
                : v
            );

            // 如果所有违约都被驳回，恢复状态为 ACTIVE
            const allDismissed = updatedViolations.every((v) => v.status === 'DISMISSED');
            const newStatus = allDismissed ? ('ACTIVE' as ProtectionStatus) : prot.protection_status;

            return {
              ...prot,
              violations: updatedViolations,
              protection_status: newStatus,
              updated_at: new Date().toISOString(),
            };
          }),
        }));
      },

      // 根据ID获取保护记录
      getProtectionById: (id) => {
        return get().protections.find((prot) => prot.id === id);
      },

      // 根据项目ID获取保护记录
      getProtectionsByProject: (projectId) => {
        return get().protections.filter((prot) => prot.project_id === projectId);
      },

      // 根据推荐人ID获取保护记录
      getProtectionsByIntroducer: (introducerId) => {
        return get().protections.filter((prot) => prot.introducer_id === introducerId);
      },

      // 获取统计信息
      getStats: (introducerId) => {
        const { protections } = get();
        const filteredProtections = introducerId
          ? protections.filter((p) => p.introducer_id === introducerId)
          : protections;

        const activeProtections = filteredProtections.filter((p) => p.protection_status === 'ACTIVE');
        const completedProtections = filteredProtections.filter((p) => p.protection_status === 'COMPLETED');
        const violatedProtections = filteredProtections.filter((p) => p.protection_status === 'VIOLATED');

        // 计算佣金（模拟）
        const totalCommissionEarned = completedProtections.reduce((sum, p) => {
          return sum + (p.minimum_guarantee || 0) * (p.commission_rate / 100);
        }, 0);

        const pendingCommission = activeProtections.reduce((sum, p) => {
          return sum + (p.minimum_guarantee || 0) * (p.commission_rate / 100);
        }, 0);

        return {
          total_protections: filteredProtections.length,
          active_protections: activeProtections.length,
          completed_protections: completedProtections.length,
          violated_protections: violatedProtections.length,
          total_commission_earned: Math.round(totalCommissionEarned),
          pending_commission: Math.round(pendingCommission),
        };
      },
    }),
    {
      name: 'broker-protection-storage',
      partialize: (state) => ({
        protections: state.protections,
      }),
    }
  )
);

/**
 * 便捷 hooks
 */
export const useProtections = () =>
  useBrokerProtectionStore((state) => state.protections);
export const useSelectedProtection = () =>
  useBrokerProtectionStore((state) => state.selectedProtection);

// 使用缓存避免无限循环
export const useProtectionStats = (introducerId?: string) => {
  const stats = useBrokerProtectionStore((state) => {
    const { protections } = state;
    const filteredProtections = introducerId
      ? protections.filter((p) => p.introducer_id === introducerId)
      : protections;

    const activeProtections = filteredProtections.filter((p) => p.protection_status === 'ACTIVE');
    const completedProtections = filteredProtections.filter((p) => p.protection_status === 'COMPLETED');
    const violatedProtections = filteredProtections.filter((p) => p.protection_status === 'VIOLATED');

    // 计算佣金（模拟）
    const totalCommissionEarned = completedProtections.reduce((sum, p) => {
      return sum + (p.minimum_guarantee || 0) * (p.commission_rate / 100);
    }, 0);

    const pendingCommission = activeProtections.reduce((sum, p) => {
      return sum + (p.minimum_guarantee || 0) * (p.commission_rate / 100);
    }, 0);

    return {
      total_protections: filteredProtections.length,
      active_protections: activeProtections.length,
      completed_protections: completedProtections.length,
      violated_protections: violatedProtections.length,
      total_commission_earned: Math.round(totalCommissionEarned),
      pending_commission: Math.round(pendingCommission),
    };
  });

  return stats;
};
