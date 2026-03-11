import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { NodeStatus } from '@/types';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';

/**
 * 模拟节点数据
 */
const mockNodes = [
  {
    id: 'node_001',
    project_id: 'proj_001',
    project_owner_id: 'user_002',
    capital_provider_id: 'user_003',
    introducer_id: 'user_001',
    project_owner_confirmed: true,
    capital_provider_confirmed: false,
    introducer_confirmed: true,
    status: NodeStatus.PROJECT_CONFIRMED,
    confirmation_deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'node_002',
    project_id: 'proj_002',
    project_owner_id: 'user_004',
    capital_provider_id: 'user_005',
    introducer_id: 'user_001',
    project_owner_confirmed: false,
    capital_provider_confirmed: false,
    introducer_confirmed: true,
    status: NodeStatus.PENDING,
    confirmation_deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'node_003',
    project_id: 'proj_003',
    project_owner_id: 'user_006',
    introducer_id: 'user_001',
    project_owner_confirmed: true,
    introducer_confirmed: true,
    status: NodeStatus.CONFIRMED,
    confirmation_deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * 三方确认流程页面 - 移动端军事科技风格
 * KeyTrader 业务流程关键环节
 */
export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [filterStatus, setFilterStatus] = useState<'ALL' | NodeStatus>('ALL');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  // 模拟确认操作
  const handleConfirm = (nodeId: string) => {
    console.log('确认节点:', nodeId);
    // TODO: 调用 API 确认节点
  };

  // 获取状态颜色
  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.CONFIRMED:
        return 'text-[hsl(var(--tactical-green))] bg-[hsl(var(--tactical-green))]/10 border-[hsl(var(--tactical-green))]/30';
      case NodeStatus.IN_PROGRESS:
        return 'text-[hsl(var(--tech-cyan))] bg-[hsl(var(--tech-cyan))]/10 border-[hsl(var(--tech-cyan))]/30';
      case NodeStatus.COMPLETED:
        return 'text-[hsl(var(--military-olive))] bg-[hsl(var(--military-olive))]/10 border-[hsl(var(--military-olive))]/30';
      case NodeStatus.CANCELLED:
        return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/30';
      case NodeStatus.PROJECT_CONFIRMED:
      case NodeStatus.CAPITAL_CONFIRMED:
      case NodeStatus.INTRODUCER_CONFIRMED:
        return 'text-[hsl(var(--finance-gold))] bg-[hsl(var(--finance-gold))]/10 border-[hsl(var(--finance-gold))]/30';
      default:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: NodeStatus) => {
    const labels = {
      [NodeStatus.PENDING]: '待确认',
      [NodeStatus.PROJECT_CONFIRMED]: '项目方已确认',
      [NodeStatus.CAPITAL_CONFIRMED]: '资金方已确认',
      [NodeStatus.INTRODUCER_CONFIRMED]: '推荐人已确认',
      [NodeStatus.CONFIRMED]: '三方已确认',
      [NodeStatus.IN_PROGRESS]: '进行中',
      [NodeStatus.COMPLETED]: '已完成',
      [NodeStatus.CANCELLED]: '已取消',
    };
    return labels[status];
  };

  // 计算确认进度
  const getConfirmationProgress = (node: typeof mockNodes[0]) => {
    const confirmedCount = [
      node.project_owner_confirmed,
      node.capital_provider_confirmed,
      node.introducer_confirmed,
    ].filter(Boolean).length;

    const totalCount = node.capital_provider_id ? 3 : 2;
    return { confirmedCount, totalCount, percentage: (confirmedCount / totalCount) * 100 };
  };

  // 获取剩余时间
  const getRemainingTime = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffHours = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffHours < 0) return '已过期';
    if (diffHours < 24) return `${diffHours}小时`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}天`;
  };

  // 筛选节点
  const filteredNodes = mockNodes.filter((node) => {
    if (filterStatus === 'ALL') return true;
    return node.status === filterStatus;
  });

  // 统计数据
  const stats = {
    total: mockNodes.length,
    pending: mockNodes.filter((n) => n.status === NodeStatus.PENDING).length,
    confirmed: mockNodes.filter((n) => n.status === NodeStatus.CONFIRMED).length,
    inProgress: mockNodes.filter((n) => n.status === NodeStatus.IN_PROGRESS).length,
  };

  return (
    <div className="space-y-4 pb-6 bg-background min-h-full">
      {/* 顶部导航栏 */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">三方确认</h1>
              <Users className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                业务流程确认
              </span>
            </div>
          </div>
        </motion.div>

        {/* 筛选按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterStatus === 'ALL'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            全部 ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus(NodeStatus.PENDING)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterStatus === NodeStatus.PENDING
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            待确认 ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus(NodeStatus.CONFIRMED)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterStatus === NodeStatus.CONFIRMED
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            已确认 ({stats.confirmed})
          </button>
        </motion.div>
      </section>

      {/* 统计概览 */}
      <section className="px-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[hsl(var(--card))] rounded-lg p-3 border border-[hsl(var(--border))] text-center">
            <div className="text-lg font-bold text-[hsl(var(--tech-cyan))]">{stats.total}</div>
            <div className="text-[10px] text-[hsl(var(--muted-foreground))]">总数</div>
          </div>
          <div className="bg-[hsl(var(--card))] rounded-lg p-3 border border-[hsl(var(--border))] text-center">
            <div className="text-lg font-bold text-[hsl(var(--finance-gold))]">{stats.pending}</div>
            <div className="text-[10px] text-[hsl(var(--muted-foreground))]">待确认</div>
          </div>
          <div className="bg-[hsl(var(--card))] rounded-lg p-3 border border-[hsl(var(--border))] text-center">
            <div className="text-lg font-bold text-[hsl(var(--tactical-green))]">{stats.confirmed}</div>
            <div className="text-[10px] text-[hsl(var(--muted-foreground))]">已确认</div>
          </div>
        </div>
      </section>

      {/* 确认列表 */}
      <section className="px-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNodes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🤝</div>
              <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无确认流程</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                待有对接项目后显示确认流程
              </div>
            </motion.div>
          ) : (
            filteredNodes.map((node, index) => {
              const progress = getConfirmationProgress(node);
              const isExpanded = expandedNode === node.id;
              const canConfirm = node.status === NodeStatus.PENDING ||
                                node.status === NodeStatus.PROJECT_CONFIRMED ||
                                node.status === NodeStatus.CAPITAL_CONFIRMED ||
                                node.status === NodeStatus.INTRODUCER_CONFIRMED;

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-xl border border-[hsl(var(--border))] corner-deco overflow-hidden"
                >
                  <div className="absolute inset-0 hud-grid opacity-20" />

                  {/* 头部信息 */}
                  <div className="relative p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-[hsl(var(--foreground))]">
                            项目 {node.project_id.slice(-4).toUpperCase()}
                          </h3>
                          <TacticalBadge variant="tech" className={`${getStatusColor(node.status)} text-[10px]`}>
                            {getStatusLabel(node.status)}
                          </TacticalBadge>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                          <Calendar className="w-3 h-3" />
                          <span>创建: {new Date(node.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </div>

                      {/* 进度圆环 */}
                      <div className="relative w-14 h-14">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            className="stroke-[hsl(var(--border))]"
                            strokeWidth="4"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            className="stroke-[hsl(var(--tech-cyan))]"
                            strokeWidth="4"
                            strokeDasharray={`${(progress.percentage / 100) * 150.72} 150.72`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-[hsl(var(--foreground))]">
                            {progress.confirmedCount}/{progress.totalCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 确认状态 */}
                    <div className="space-y-2 mb-3">
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        node.project_owner_confirmed
                          ? 'bg-[hsl(var(--tactical-green))]/10'
                          : 'bg-[hsl(var(--muted-foreground))]/10'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
                          <span className="text-[10px] text-[hsl(var(--foreground))]">项目方</span>
                        </div>
                        {node.project_owner_confirmed ? (
                          <CheckCircle2 className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                        ) : (
                          <Clock className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        )}
                      </div>

                      {node.capital_provider_id && (
                        <div className={`flex items-center justify-between p-2 rounded-lg ${
                          node.capital_provider_confirmed
                            ? 'bg-[hsl(var(--tactical-green))]/10'
                            : 'bg-[hsl(var(--muted-foreground))]/10'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-[hsl(var(--finance-gold))]" />
                            <span className="text-[10px] text-[hsl(var(--foreground))]">资金方</span>
                          </div>
                          {node.capital_provider_confirmed ? (
                            <CheckCircle2 className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                          ) : (
                            <Clock className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                          )}
                        </div>
                      )}

                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        node.introducer_confirmed
                          ? 'bg-[hsl(var(--tactical-green))]/10'
                          : 'bg-[hsl(var(--muted-foreground))]/10'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-[hsl(var(--military-olive))]" />
                          <span className="text-[10px] text-[hsl(var(--foreground))]">推荐人</span>
                        </div>
                        {node.introducer_confirmed ? (
                          <CheckCircle2 className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                        ) : (
                          <Clock className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        )}
                      </div>
                    </div>

                    {/* 底部信息 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                        <Clock className="w-3 h-3" />
                        <span>截止: {getRemainingTime(node.confirmation_deadline)}</span>
                      </div>

                      {/* 展开按钮 */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                        className="flex items-center gap-1 text-[10px] text-[hsl(var(--tech-cyan))]"
                      >
                        <span>{isExpanded ? '收起' : '详情'}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </motion.button>
                    </div>
                  </div>

                  {/* 展开详情 */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-[hsl(var(--border))]"
                      >
                        <div className="p-4 space-y-3">
                          {/* 节点详情 */}
                          <div>
                            <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">
                              节点信息
                            </div>
                            <div className="space-y-1 text-[10px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[hsl(var(--muted-foreground))]">节点ID</span>
                                <span className="text-[hsl(var(--tech-cyan))] font-mono">
                                  {node.id.slice(-8).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[hsl(var(--muted-foreground))]">项目ID</span>
                                <span className="text-[hsl(var(--tech-cyan))] font-mono">
                                  {node.project_id.slice(-8).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 确认说明 */}
                          <div className="p-2 bg-[hsl(var(--tech-cyan))]/10 border border-[hsl(var(--tech-cyan))]/30 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-3 h-3 text-[hsl(var(--tech-cyan))] flex-shrink-0 mt-0.5" />
                              <div className="text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
                                三方确认是保障交易安全的重要流程。请各方在截止日期前完成确认，逾期将自动取消对接。
                              </div>
                            </div>
                          </div>

                          {/* 操作按钮 */}
                          {canConfirm && (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleConfirm(node.id)}
                              className="w-full py-2 bg-[hsl(var(--tactical-green))] text-[hsl(var(--background))] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              确认此节点
                            </motion.button>
                          )}

                          {node.status === NodeStatus.CONFIRMED && (
                            <div className="p-2 bg-[hsl(var(--tactical-green))]/10 border border-[hsl(var(--tactical-green))]/30 rounded-lg text-center">
                              <CheckCircle2 className="w-4 h-4 text-[hsl(var(--tactical-green))] mx-auto mb-1" />
                              <div className="text-[10px] text-[hsl(var(--tactical-green))] font-bold">
                                三方已确认，流程继续
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
