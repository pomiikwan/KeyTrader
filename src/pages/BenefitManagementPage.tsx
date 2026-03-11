import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  PieChart,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Vote,
  History,
  ChevronDown,
  Plus,
  Edit3,
} from 'lucide-react';
import { useBenefitStore, useAuthStore } from '@/store';
import { BenefitStatus } from '@/types/benefit';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';

/**
 * 利益分配管理页面 - 移动端军事科技风格
 * KeyTrader 佣金管理功能
 */
export default function BenefitManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const benefits = useBenefitStore((state) => state.benefits);
  const { requestAdjustment, lockBenefit, castVote, selectBenefit } = useBenefitStore();

  // 使用 useMemo 缓存统计数据，避免无限循环
  const stats = useMemo(() => {
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
  }, [benefits]);

  const [filterStatus, setFilterStatus] = useState<'ALL' | BenefitStatus>('ALL');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'benefits' | 'votes'>('overview');
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustValue, setAdjustValue] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');

  // 筛选分配
  const filteredBenefits = benefits.filter((ben) => {
    if (filterStatus === 'ALL') return true;
    return ben.status === filterStatus;
  });

  // 获取状态颜色
  const getStatusColor = (status: BenefitStatus) => {
    switch (status) {
      case BenefitStatus.APPROVED:
        return 'text-[hsl(var(--tactical-green))] bg-[hsl(var(--tactical-green))]/10 border-[hsl(var(--tactical-green))]/30';
      case BenefitStatus.PENDING:
        return 'text-[hsl(var(--finance-gold))] bg-[hsl(var(--finance-gold))]/10 border-[hsl(var(--finance-gold))]/30';
      case BenefitStatus.REJECTED:
        return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/30';
      case BenefitStatus.LOCKED:
        return 'text-[hsl(var(--tech-cyan))] bg-[hsl(var(--tech-cyan))]/10 border-[hsl(var(--tech-cyan))]/30';
      case BenefitStatus.COMPLETED:
        return 'text-[hsl(var(--military-olive))] bg-[hsl(var(--military-olive))]/10 border-[hsl(var(--military-olive))]/30';
      default:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: BenefitStatus) => {
    const labels = {
      [BenefitStatus.DRAFT]: '草稿',
      [BenefitStatus.PENDING]: '待投票',
      [BenefitStatus.APPROVED]: '已通过',
      [BenefitStatus.REJECTED]: '已拒绝',
      [BenefitStatus.LOCKED]: '已锁定',
      [BenefitStatus.COMPLETED]: '已完成',
    };
    return labels[status];
  };

  // 处理调整请求
  const handleAdjustment = (benefitId: string) => {
    if (adjustReason.trim()) {
      requestAdjustment(benefitId, adjustValue, adjustReason);
      setShowAdjustModal(false);
      setAdjustValue(0);
      setAdjustReason('');
    }
  };

  // 处理投票
  const handleVote = (benefitId: string, voteType: 'APPROVE' | 'REJECT') => {
    if (user) {
      castVote(benefitId, user.id, voteType);
    }
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(1)}万`;
    }
    return `¥${amount.toLocaleString()}`;
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
              <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">利益分配</h1>
              <DollarSign className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <PieChart className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                佣金管理系统
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tab 切换 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              selectedTab === 'overview'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            概览
          </button>
          <button
            onClick={() => setSelectedTab('benefits')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              selectedTab === 'benefits'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            分配列表
          </button>
          <button
            onClick={() => setSelectedTab('votes')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              selectedTab === 'votes'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            投票
          </button>
        </motion.div>
      </section>

      {/* 概览 Tab */}
      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.section
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 space-y-3"
          >
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 gap-3">
              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">总分配数</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--finance-gold))]">
                  {stats.total_benefits}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">已通过</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--tactical-green))]">
                  {stats.approved_benefits}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">待投票</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--tech-cyan))]">
                  {stats.pending_benefits}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-[hsl(var(--military-olive))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">已锁定</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--military-olive))]">
                  {stats.locked_benefits}
                </div>
              </TacticalCard>
            </div>

            {/* 金额统计 */}
            <TacticalCard title="金额统计" className="corner-deco">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[hsl(var(--tactical-green))]/10 border border-[hsl(var(--tactical-green))]/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      推荐人总金额
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[hsl(var(--tactical-green))]">
                    {formatAmount(stats.total_introducer_amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[hsl(var(--tech-cyan))]/10 border border-[hsl(var(--tech-cyan))]/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      平台总金额
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[hsl(var(--tech-cyan))]">
                    {formatAmount(stats.total_platform_amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[hsl(var(--finance-gold))]/10 border border-[hsl(var(--finance-gold))]/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      待结算金额
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[hsl(var(--finance-gold))]">
                    {formatAmount(stats.pending_amount)}
                  </span>
                </div>
              </div>
            </TacticalCard>

            {/* 平均比例 */}
            <TacticalCard title="平均比例" className="corner-deco">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[hsl(var(--muted-foreground))]">推荐人平均比例</span>
                    <span className="font-bold text-[hsl(var(--tactical-green))]">
                      {stats.avg_introducer_ratio}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--tactical-green))]"
                      style={{ width: `${stats.avg_introducer_ratio * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[hsl(var(--muted-foreground))]">平台平均比例</span>
                    <span className="font-bold text-[hsl(var(--tech-cyan))]">
                      {stats.avg_platform_ratio}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--tech-cyan))]"
                      style={{ width: `${stats.avg_platform_ratio * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </TacticalCard>
          </motion.section>
        )}

        {/* 分配列表 Tab */}
        {selectedTab === 'benefits' && (
          <motion.section
            key="benefits"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 space-y-3"
          >
            {/* 筛选按钮 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === 'ALL'
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                全部 ({benefits.length})
              </button>
              <button
                onClick={() => setFilterStatus(BenefitStatus.PENDING)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === BenefitStatus.PENDING
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                待投票 ({stats.pending_benefits})
              </button>
              <button
                onClick={() => setFilterStatus(BenefitStatus.APPROVED)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === BenefitStatus.APPROVED
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                已通过 ({stats.approved_benefits})
              </button>
            </div>

            {/* 分配列表 */}
            <AnimatePresence mode="popLayout">
              {filteredBenefits.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">💰</div>
                  <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无分配记录</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                    创建新的利益分配方案吧
                  </div>
                </motion.div>
              ) : (
                filteredBenefits.map((benefit, index) => {
                  const isExpanded = expandedBenefit === benefit.id;

                  return (
                    <motion.div
                      key={benefit.id}
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
                                项目 {benefit.project_id.slice(-4).toUpperCase()}
                              </h3>
                              <TacticalBadge variant="tech" className={`${getStatusColor(benefit.status)} text-[10px]`}>
                                {getStatusLabel(benefit.status)}
                              </TacticalBadge>
                              {benefit.is_locked && (
                                <TacticalBadge variant="tech" className="text-[9px] px-1.5 py-0.5 bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] border-[hsl(var(--tech-cyan))]/30">
                                  <Lock className="w-2 h-2 inline mr-0.5" />
                                  已锁定
                                </TacticalBadge>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">推荐人</div>
                                <div className="text-sm font-bold text-[hsl(var(--tactical-green))]">
                                  {benefit.introducer_ratio}%
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">平台</div>
                                <div className="text-sm font-bold text-[hsl(var(--tech-cyan))]">
                                  {benefit.platform_ratio}%
                                </div>
                              </div>
                            </div>
                          </div>

                          {benefit.total_amount && (
                            <div className="text-right">
                              <div className="text-xs text-[hsl(var(--muted-foreground))]">总金额</div>
                              <div className="text-lg font-bold text-[hsl(var(--finance-gold))]">
                                {formatAmount(benefit.total_amount)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 底部信息 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                              <History className="w-3 h-3" />
                              <span>调整: {benefit.adjustment_count}/3</span>
                            </div>
                            {benefit.voting_deadline && (
                              <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                                <Clock className="w-3 h-3" />
                                <span>
                                  截止: {new Date(benefit.voting_deadline).toLocaleDateString('zh-CN')}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* 展开按钮 */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setExpandedBenefit(isExpanded ? null : benefit.id)}
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
                              {/* 金额明细 */}
                              {benefit.introducer_amount && benefit.platform_amount && (
                                <div>
                                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">
                                    金额明细
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 bg-[hsl(var(--tactical-green))]/10 rounded-lg">
                                      <span className="text-xs text-[hsl(var(--muted-foreground))]">推荐人应得</span>
                                      <span className="text-sm font-bold text-[hsl(var(--tactical-green))]">
                                        {formatAmount(benefit.introducer_amount)}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-[hsl(var(--tech-cyan))]/10 rounded-lg">
                                      <span className="text-xs text-[hsl(var(--muted-foreground))]">平台应得</span>
                                      <span className="text-sm font-bold text-[hsl(var(--tech-cyan))]">
                                        {formatAmount(benefit.platform_amount)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 投票情况 */}
                              {benefit.status === BenefitStatus.PENDING && (
                                <div>
                                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">
                                    投票情况
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 flex items-center justify-between p-2 bg-[hsl(var(--tactical-green))]/10 rounded-lg">
                                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">赞成</span>
                                      <span className="text-sm font-bold text-[hsl(var(--tactical-green))]">
                                        {benefit.approval_count}
                                      </span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between p-2 bg-[hsl(var(--destructive))]/10 rounded-lg">
                                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">反对</span>
                                      <span className="text-sm font-bold text-[hsl(var(--destructive))]">
                                        {benefit.rejection_count}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleVote(benefit.id, 'APPROVE')}
                                      className="flex-1 py-2 bg-[hsl(var(--tactical-green))] text-[hsl(var(--background))] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      赞成
                                    </motion.button>
                                    <motion.button
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleVote(benefit.id, 'REJECT')}
                                      className="flex-1 py-2 bg-[hsl(var(--destructive))] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                    >
                                      <XCircle className="w-3 h-3" />
                                      反对
                                    </motion.button>
                                  </div>
                                </div>
                              )}

                              {/* 调整历史 */}
                              {benefit.adjustments && benefit.adjustments.length > 0 && (
                                <div>
                                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">
                                    调整历史
                                  </div>
                                  <div className="space-y-2">
                                    {benefit.adjustments.map((adj) => (
                                      <div
                                        key={adj.id}
                                        className="p-2 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]"
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                            {new Date(adj.adjusted_at).toLocaleDateString('zh-CN')}
                                          </span>
                                          <span className="text-xs font-bold text-[hsl(var(--tech-cyan))]">
                                            {adj.old_ratio}% → {adj.new_ratio}%
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                          {adj.reason}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 操作按钮 */}
                              {!benefit.is_locked && benefit.status === BenefitStatus.APPROVED && (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => lockBenefit(benefit.id)}
                                  className="w-full py-2 bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                >
                                  <Lock className="w-3 h-3" />
                                  锁定分配
                                </motion.button>
                              )}

                              {!benefit.is_locked && benefit.adjustment_count < 3 && (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setExpandedBenefit(benefit.id);
                                    setShowAdjustModal(true);
                                  }}
                                  className="w-full py-2 bg-[hsl(var(--finance-gold))]/20 border border-[hsl(var(--finance-gold))]/30 text-[hsl(var(--finance-gold))] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  请求调整 ({benefit.adjustment_count}/3)
                                </motion.button>
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
          </motion.section>
        )}

        {/* 投票 Tab */}
        {selectedTab === 'votes' && (
          <motion.section
            key="votes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 space-y-3"
          >
            <TacticalCard title="待投票项目" className="corner-deco">
              <div className="space-y-3">
                {benefits
                  .filter((b) => b.status === BenefitStatus.PENDING)
                  .map((benefit) => (
                    <div
                      key={benefit.id}
                      className="p-3 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-[hsl(var(--foreground))]">
                          项目 {benefit.project_id.slice(-4).toUpperCase()}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[hsl(var(--tactical-green))]">
                            {benefit.approval_count} 赞成
                          </span>
                          <span className="text-xs text-[hsl(var(--destructive))]">
                            {benefit.rejection_count} 反对
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          推荐人比例
                        </span>
                        <span className="text-sm font-bold text-[hsl(var(--tactical-green))]">
                          {benefit.introducer_ratio}%
                        </span>
                      </div>
                      {benefit.voting_deadline && (
                        <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))] mb-2">
                          <Clock className="w-3 h-3" />
                          <span>
                            截止: {new Date(benefit.voting_deadline).toLocaleString('zh-CN')}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVote(benefit.id, 'APPROVE')}
                          className="flex-1 py-2 bg-[hsl(var(--tactical-green))] text-[hsl(var(--background))] rounded-lg text-xs font-bold"
                        >
                          赞成
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVote(benefit.id, 'REJECT')}
                          className="flex-1 py-2 bg-[hsl(var(--destructive))] text-white rounded-lg text-xs font-bold"
                        >
                          反对
                        </motion.button>
                      </div>
                    </div>
                  ))}

                {benefits.filter((b) => b.status === BenefitStatus.PENDING).length === 0 && (
                  <div className="text-center py-8">
                    <Vote className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">
                      暂无待投票项目
                    </div>
                  </div>
                )}
              </div>
            </TacticalCard>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 调整模态框 */}
      <AnimatePresence>
        {showAdjustModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdjustModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[hsl(var(--card))] rounded-xl p-4 w-full max-w-sm border border-[hsl(var(--border))] corner-deco"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">请求调整比例</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAdjustModal(false)}
                  className="w-6 h-6 flex items-center justify-center text-[hsl(var(--muted-foreground))]"
                >
                  ✕
                </motion.button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">
                    新比例 (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={adjustValue}
                    onChange={(e) => setAdjustValue(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))]"
                    placeholder="输入新的比例"
                  />
                </div>

                <div>
                  <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">
                    调整原因
                  </label>
                  <textarea
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] resize-none"
                    rows={3}
                    placeholder="请说明调整原因..."
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAdjustment(expandedBenefit || '')}
                  disabled={!adjustValue || !adjustReason.trim()}
                  className={`w-full py-2 rounded-lg text-sm font-bold ${
                    adjustValue && adjustReason.trim()
                      ? 'bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))]'
                      : 'bg-[hsl(var(--muted-foreground))]/30 text-[hsl(var(--muted-foreground))] cursor-not-allowed'
                  }`}
                >
                  提交调整请求
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
