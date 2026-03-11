import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useBrokerProtectionStore, useAuthStore } from '@/store';
import { ProtectionStatus, ProtectionType, DEFAULT_PROTECTION_TERMS } from '@/types/broker-protection';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';

/**
 * 推荐人保护机制页面 - 移动端军事科技风格
 * KeyTrader 核心特色功能
 */
export default function BrokerProtectionPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const protections = useBrokerProtectionStore((state) => state.protections);

  const [filterStatus, setFilterStatus] = useState<'ALL' | ProtectionStatus>('ALL');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'protections' | 'terms'>('overview');

  // 使用 useMemo 缓存统计数据，避免无限循环
  const stats = useMemo(() => {
    const filteredProtections = user?.id
      ? protections.filter((p) => p.introducer_id === user.id)
      : protections;

    const activeProtections = filteredProtections.filter((p) => p.protection_status === 'ACTIVE');
    const completedProtections = filteredProtections.filter((p) => p.protection_status === 'COMPLETED');
    const violatedProtections = filteredProtections.filter((p) => p.protection_status === 'VIOLATED');

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
  }, [protections, user?.id]);

  // 筛选保护记录
  const filteredProtections = protections.filter((prot) => {
    if (filterStatus === 'ALL') return true;
    return prot.protection_status === filterStatus;
  });

  // 获取保护状态颜色
  const getStatusColor = (status: ProtectionStatus) => {
    switch (status) {
      case ProtectionStatus.ACTIVE:
        return 'text-[hsl(var(--tech-cyan))] bg-[hsl(var(--tech-cyan))]/10 border-[hsl(var(--tech-cyan))]/30';
      case ProtectionStatus.PENDING:
        return 'text-[hsl(var(--finance-gold))] bg-[hsl(var(--finance-gold))]/10 border-[hsl(var(--finance-gold))]/30';
      case ProtectionStatus.COMPLETED:
        return 'text-[hsl(var(--tactical-green))] bg-[hsl(var(--tactical-green))]/10 border-[hsl(var(--tactical-green))]/30';
      case ProtectionStatus.VIOLATED:
        return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/30';
      case ProtectionStatus.EXPIRED:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
      default:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
    }
  };

  // 获取保护状态标签
  const getStatusLabel = (status: ProtectionStatus) => {
    const labels = {
      [ProtectionStatus.ACTIVE]: '激活中',
      [ProtectionStatus.PENDING]: '待确认',
      [ProtectionStatus.COMPLETED]: '已完成',
      [ProtectionStatus.VIOLATED]: '已违约',
      [ProtectionStatus.EXPIRED]: '已过期',
    };
    return labels[status];
  };

  // 获取保护类型标签
  const getProtectionTypeLabel = (type: ProtectionType) => {
    const labels = {
      [ProtectionType.EXCLUSIVE]: '独家保护',
      [ProtectionType.NON_EXCLUSIVE]: '非独家保护',
      [ProtectionType.TIME_LIMITED]: '限时保护',
    };
    return labels[type];
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  // 计算剩余天数
  const getRemainingDays = (endDate?: string) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
            <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">推荐人保护</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                独家保护机制
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
            onClick={() => setSelectedTab('protections')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              selectedTab === 'protections'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            保护记录
          </button>
          <button
            onClick={() => setSelectedTab('terms')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              selectedTab === 'terms'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            保护条款
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
            className="px-4 space-y-4"
          >
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 gap-3">
              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">总保护数</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--tech-cyan))]">
                  {stats.total_protections}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">激活中</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--tactical-green))]">
                  {stats.active_protections}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">已完成</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--finance-gold))]">
                  {stats.completed_protections}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--destructive))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">已违约</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--destructive))]">
                  {stats.violated_protections}
                </div>
              </TacticalCard>
            </div>

            {/* 佣金统计 */}
            <TacticalCard title="收益统计" className="corner-deco">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[hsl(var(--tactical-green))]/10 border border-[hsl(var(--tactical-green))]/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">已收入佣金</span>
                  </div>
                  <span className="text-lg font-bold text-[hsl(var(--tactical-green))]">
                    ¥{stats.total_commission_earned.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[hsl(var(--finance-gold))]/10 border border-[hsl(var(--finance-gold))]/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">待结算佣金</span>
                  </div>
                  <span className="text-lg font-bold text-[hsl(var(--finance-gold))]">
                    ¥{stats.pending_commission.toLocaleString()}
                  </span>
                </div>
              </div>
            </TacticalCard>

            {/* 快速操作 */}
            <TacticalCard title="快速操作" className="corner-deco">
              <div className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/projects')}
                  className="w-full flex items-center justify-between p-3 bg-[hsl(var(--tech-cyan))]/10 border border-[hsl(var(--tech-cyan))]/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[hsl(var(--tech-cyan))] rounded flex items-center justify-center">
                      <Plus className="w-4 h-4 text-[hsl(var(--background))]" />
                    </div>
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      创建新保护
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTab('terms')}
                  className="w-full flex items-center justify-between p-3 bg-[hsl(var(--finance-gold))]/10 border border-[hsl(var(--finance-gold))]/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[hsl(var(--finance-gold))] rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[hsl(var(--background))]" />
                    </div>
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      查看保护条款
                    </span>
                  </div>
                </motion.button>
              </div>
            </TacticalCard>
          </motion.section>
        )}

        {/* 保护记录 Tab */}
        {selectedTab === 'protections' && (
          <motion.section
            key="protections"
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
                全部 ({protections.length})
              </button>
              <button
                onClick={() => setFilterStatus(ProtectionStatus.ACTIVE)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === ProtectionStatus.ACTIVE
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                激活中 ({stats.active_protections})
              </button>
              <button
                onClick={() => setFilterStatus(ProtectionStatus.COMPLETED)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === ProtectionStatus.COMPLETED
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                已完成 ({stats.completed_protections})
              </button>
              <button
                onClick={() => setFilterStatus(ProtectionStatus.VIOLATED)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === ProtectionStatus.VIOLATED
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                已违约 ({stats.violated_protections})
              </button>
            </div>

            {/* 保护记录列表 */}
            <AnimatePresence mode="popLayout">
              {filteredProtections.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🛡️</div>
                  <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无保护记录</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                    开始创建推荐人保护记录吧
                  </div>
                </motion.div>
              ) : (
                filteredProtections.map((prot, index) => {
                  const remainingDays = getRemainingDays(prot.end_date);

                  return (
                    <motion.div
                      key={prot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden"
                    >
                      <div className="absolute inset-0 hud-grid opacity-20" />

                      <div className="relative">
                        {/* 头部信息 */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold text-[hsl(var(--foreground))]">
                                项目 {prot.project_id.slice(-4).toUpperCase()}
                              </h3>
                              <TacticalBadge variant="tech" className={`${getStatusColor(prot.protection_status)} text-[10px]`}>
                                {getStatusLabel(prot.protection_status)}
                              </TacticalBadge>
                            </div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                              {getProtectionTypeLabel(prot.protection_type)}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-bold text-[hsl(var(--finance-gold))]">
                              {prot.commission_rate}%
                            </div>
                            <div className="text-[10px] text-[hsl(var(--muted-foreground))]">佣金比例</div>
                          </div>
                        </div>

                        {/* 详细信息 */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                            <Clock className="w-3 h-3" />
                            <span>开始: {formatDate(prot.start_date)}</span>
                          </div>
                          {remainingDays !== null && (
                            <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                              <Clock className="w-3 h-3" />
                              <span>
                                剩余: {remainingDays > 0 ? `${remainingDays}天` : '已过期'}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                            <Shield className="w-3 h-3" />
                            <span>
                              {prot.violation_count > 0
                                ? `${prot.violation_count} 次违约`
                                : '无违约记录'}
                            </span>
                          </div>
                          {prot.minimum_guarantee && (
                            <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                              <DollarSign className="w-3 h-3" />
                              <span>保证金: ¥{prot.minimum_guarantee.toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        {/* 保护条款 */}
                        <div className="flex flex-wrap gap-1">
                          {prot.protection_terms.slice(0, 3).map((term, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-2 py-0.5 bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] rounded border border-[hsl(var(--tech-cyan))]/20"
                            >
                              {term}
                            </span>
                          ))}
                          {prot.protection_terms.length > 3 && (
                            <span className="text-[9px] px-2 py-0.5 bg-[hsl(var(--muted-foreground))]/10 text-[hsl(var(--muted-foreground))] rounded">
                              +{prot.protection_terms.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* 保护条款 Tab */}
        {selectedTab === 'terms' && (
          <motion.section
            key="terms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 space-y-3"
          >
            {/* 条款说明 */}
            <TacticalCard title="保护条款说明" className="corner-deco">
              <div className="space-y-4">
                <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                  推荐人保护机制是 KeyTrader 平台的核心特色功能，旨在保障推荐人的合法权益，
                  防止项目方与资金方绕过推荐人私下交易，确保推荐人能够获得应得的佣金收益。
                </div>

                <div className="space-y-2">
                  {DEFAULT_PROTECTION_TERMS.map((term) => (
                    <div
                      key={term.id}
                      className="p-3 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]"
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <FileText className="w-4 h-4 text-[hsl(var(--tech-cyan))] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-[hsl(var(--foreground))]">
                              {term.title}
                            </h4>
                            {term.is_required && (
                              <TacticalBadge variant="tech" className="text-[9px] px-1.5 py-0.5 bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/30">
                                必选
                              </TacticalBadge>
                            )}
                          </div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                            {term.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TacticalCard>

            {/* 违约处理 */}
            <TacticalCard title="违约处理机制" className="corner-deco border-[hsl(var(--destructive))]/30">
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--destructive))] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">
                      违约行为定义
                    </h4>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                      包括私下联系、绕过推荐人自行交易、泄露交易信息等行为。
                      一经确认，将扣除保证金并承担相应法律责任。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-[hsl(var(--tactical-green))]/10 border border-[hsl(var(--tactical-green))]/30 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-[hsl(var(--tactical-green))] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">
                      保护措施
                    </h4>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                      平台将全程监督交易过程，记录所有通信和操作日志。
                      推荐人可随时举报违约行为，平台将进行核查并处理。
                    </p>
                  </div>
                </div>
              </div>
            </TacticalCard>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
