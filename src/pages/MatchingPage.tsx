import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Target,
  DollarSign,
  MapPin,
  Calendar,
  Award,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { useMatchingStore, useAuthStore } from '@/store';
import { MatchStatus, MatchType } from '@/types/matching';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';

/**
 * AI 智能匹配推荐页面 - 移动端军事科技风格
 * KeyTrader 核心推荐功能
 */
export default function MatchingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const matches = useMatchingStore((state) => state.matches);
  const { updateMatchStatus, selectMatch } = useMatchingStore();

  // 使用 useMemo 缓存统计数据，避免无限循环
  const stats = useMemo(() => {
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
  }, [matches]);

  const [filterStatus, setFilterStatus] = useState<'ALL' | MatchStatus>('ALL');
  const [selectedTab, setSelectedTab] = useState<'recommendations' | 'stats'>('recommendations');
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  // 筛选匹配
  const filteredMatches = matches
    .filter((match) => {
      if (filterStatus === 'ALL') return true;
      return match.status === filterStatus;
    })
    .sort((a, b) => b.match_score.total_score - a.match_score.total_score);

  // 获取状态颜色
  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.PENDING:
        return 'text-[hsl(var(--finance-gold))] bg-[hsl(var(--finance-gold))]/10 border-[hsl(var(--finance-gold))]/30';
      case MatchStatus.VIEWED:
        return 'text-[hsl(var(--tech-cyan))] bg-[hsl(var(--tech-cyan))]/10 border-[hsl(var(--tech-cyan))]/30';
      case MatchStatus.INTERESTED:
        return 'text-[hsl(var(--military-olive))] bg-[hsl(var(--military-olive))]/10 border-[hsl(var(--military-olive))]/30';
      case MatchStatus.ACCEPTED:
        return 'text-[hsl(var(--tactical-green))] bg-[hsl(var(--tactical-green))]/10 border-[hsl(var(--tactical-green))]/30';
      case MatchStatus.REJECTED:
        return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/30';
      case MatchStatus.EXPIRED:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
      default:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: MatchStatus) => {
    const labels = {
      [MatchStatus.PENDING]: '待处理',
      [MatchStatus.VIEWED]: '已查看',
      [MatchStatus.INTERESTED]: '有意向',
      [MatchStatus.ACCEPTED]: '已接受',
      [MatchStatus.REJECTED]: '已拒绝',
      [MatchStatus.EXPIRED]: '已过期',
      [MatchStatus.COMPLETED]: '已完成',
    };
    return labels[status];
  };

  // 获取分数等级
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { label: '极佳', color: 'text-[hsl(var(--tactical-green))]' };
    if (score >= 80) return { label: '优秀', color: 'text-[hsl(var(--tech-cyan))]' };
    if (score >= 70) return { label: '良好', color: 'text-[hsl(var(--finance-gold))]' };
    if (score >= 60) return { label: '一般', color: 'text-[hsl(var(--military-olive))]' };
    return { label: '较低', color: 'text-[hsl(var(--destructive))]' };
  };

  // 处理匹配操作
  const handleAccept = (matchId: string) => {
    updateMatchStatus(matchId, MatchStatus.ACCEPTED);
    // TODO: 创建聊天会话、发送通知等
  };

  const handleReject = (matchId: string) => {
    updateMatchStatus(matchId, MatchStatus.REJECTED);
  };

  const handleView = (matchId: string) => {
    selectMatch(matchId);
    navigate(`/matching/${matchId}`);
  };

  // 格式化剩余时间
  const getRemainingTime = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffHours = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffHours < 0) return '已过期';
    if (diffHours < 24) return `${diffHours}小时`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}天`;
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
              <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">AI 智能匹配</h1>
              <Sparkles className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                精准推荐算法
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
            onClick={() => setSelectedTab('recommendations')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              selectedTab === 'recommendations'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            推荐列表
          </button>
          <button
            onClick={() => setSelectedTab('stats')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              selectedTab === 'stats'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            统计分析
          </button>
        </motion.div>
      </section>

      {/* 推荐列表 Tab */}
      <AnimatePresence mode="wait">
        {selectedTab === 'recommendations' && (
          <motion.section
            key="recommendations"
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
                全部 ({matches.length})
              </button>
              <button
                onClick={() => setFilterStatus(MatchStatus.PENDING)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === MatchStatus.PENDING
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                待处理 ({stats.pending_matches})
              </button>
              <button
                onClick={() => setFilterStatus(MatchStatus.ACCEPTED)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                  filterStatus === MatchStatus.ACCEPTED
                    ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                    : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                已接受 ({stats.accepted_matches})
              </button>
            </div>

            {/* 匹配列表 */}
            <AnimatePresence mode="popLayout">
              {filteredMatches.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">✨</div>
                  <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无匹配</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                    AI 正在为您寻找最佳匹配对象
                  </div>
                </motion.div>
              ) : (
                filteredMatches.map((match, index) => {
                  const scoreGrade = getScoreGrade(match.match_score.total_score);
                  const isExpanded = expandedMatch === match.id;

                  return (
                    <motion.div
                      key={match.id}
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
                                {match.requester_virtual_id} ↔ {match.target_virtual_id}
                              </h3>
                              <TacticalBadge variant="tech" className={`${getStatusColor(match.status)} text-[10px]`}>
                                {getStatusLabel(match.status)}
                              </TacticalBadge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-[hsl(var(--finance-gold))]" />
                              <span className={`text-xs font-bold ${scoreGrade.color}`}>
                                {match.match_score.total_score} 分
                              </span>
                              <span className={`text-[10px] ${scoreGrade.color}`}>
                                {scoreGrade.label}
                              </span>
                            </div>
                          </div>

                          {/* 总分圆环 */}
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                className="stroke-[hsl(var(--border))]"
                                strokeWidth="4"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                className="stroke-[hsl(var(--tech-cyan))]"
                                strokeWidth="4"
                                strokeDasharray={`${(match.match_score.total_score / 100) * 175.93} 175.93`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold text-[hsl(var(--foreground))]">
                                {match.match_score.total_score}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 维度分数 */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {Object.entries(match.match_score.dimensions).slice(0, 3).map(([key, value]) => {
                            const labels: Record<string, string> = {
                              business_fit: '业务',
                              financial_match: '财务',
                              timeline_alignment: '时间',
                              location_proximity: '地理',
                              expertise_match: '专业',
                              reputation_score: '声誉',
                            };
                            return (
                              <div key={key} className="text-center">
                                <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-0.5">
                                  {labels[key]}
                                </div>
                                <div className="text-sm font-bold text-[hsl(var(--tech-cyan))]">
                                  {value}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 匹配原因 */}
                        <div className="mb-3">
                          <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1.5">
                            匹配原因
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {match.reasons.slice(0, 2).map((reason, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] px-2 py-0.5 bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] rounded border border-[hsl(var(--tech-cyan))]/20 line-clamp-1"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 底部信息 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                              <Clock className="w-3 h-3" />
                              <span>{getRemainingTime(match.expires_at)}</span>
                            </div>
                            {match.is_protected && (
                              <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--tactical-green))]">
                                <Shield className="w-3 h-3" />
                                <span>推荐人保护</span>
                              </div>
                            )}
                          </div>

                          {/* 展开按钮 */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
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
                              {/* 全部维度分数 */}
                              <div>
                                <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">
                                  详细评分
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(match.match_score.dimensions).map(([key, value]) => {
                                    const labels: Record<string, string> = {
                                      business_fit: '业务匹配度',
                                      financial_match: '财务匹配度',
                                      timeline_alignment: '时间匹配度',
                                      location_proximity: '地理位置',
                                      expertise_match: '专业能力',
                                      reputation_score: '声誉评分',
                                    };
                                    return (
                                      <div key={key} className="flex items-center justify-between">
                                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                          {labels[key]}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <div className="w-16 h-1 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-[hsl(var(--tech-cyan))]"
                                              style={{ width: `${value}%` }}
                                            />
                                          </div>
                                          <span className="text-[10px] font-bold text-[hsl(var(--tech-cyan))]">
                                            {value}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* 匹配亮点 */}
                              {match.highlights.length > 0 && (
                                <div>
                                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1.5">
                                    匹配亮点
                                  </div>
                                  <div className="space-y-1">
                                    {match.highlights.map((highlight, idx) => (
                                      <div key={idx} className="text-[10px] text-[hsl(var(--foreground))]">
                                        • {highlight}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 操作按钮 */}
                              {match.status === MatchStatus.PENDING || match.status === MatchStatus.VIEWED ? (
                                <div className="flex gap-2 pt-2">
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAccept(match.id)}
                                    className="flex-1 py-2 bg-[hsl(var(--tactical-green))] text-[hsl(var(--background))] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    接受匹配
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReject(match.id)}
                                    className="flex-1 py-2 bg-[hsl(var(--destructive))] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    暂不考虑
                                  </motion.button>
                                </div>
                              ) : match.status === MatchStatus.ACCEPTED ? (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigate('/chats')}
                                  className="w-full py-2 bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))] rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  查看聊天
                                </motion.button>
                              ) : null}
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

        {/* 统计分析 Tab */}
        {selectedTab === 'stats' && (
          <motion.section
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 space-y-3"
          >
            {/* 核心指标 */}
            <div className="grid grid-cols-2 gap-3">
              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">总匹配数</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--tech-cyan))]">
                  {stats.total_matches}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">平均分数</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--finance-gold))]">
                  {stats.average_score}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--tactical-green))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">已接受</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--tactical-green))]">
                  {stats.accepted_matches}
                </div>
              </TacticalCard>

              <TacticalCard className="corner-deco">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[hsl(var(--military-olive))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">接受率</span>
                </div>
                <div className="text-2xl font-bold text-[hsl(var(--military-olive))]">
                  {stats.acceptance_rate}%
                </div>
              </TacticalCard>
            </div>

            {/* 匹配质量分析 */}
            <TacticalCard title="匹配质量分析" className="corner-deco">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">平均兼容性</span>
                  <span className="text-sm font-bold text-[hsl(var(--tech-cyan))]">
                    {stats.average_compatibility}
                  </span>
                </div>
                <div className="w-full h-2 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[hsl(var(--tech-cyan))] to-[hsl(var(--tactical-green))]"
                    style={{ width: `${stats.average_compatibility}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">平均响应时间</span>
                  <span className="text-sm font-bold text-[hsl(var(--finance-gold))]">
                    {stats.avg_response_time_hours} 小时
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">待处理匹配</span>
                  <span className="text-sm font-bold text-[hsl(var(--finance-gold))]">
                    {stats.pending_matches}
                  </span>
                </div>
              </div>
            </TacticalCard>

            {/* 算法说明 */}
            <TacticalCard title="匹配算法说明" className="corner-deco">
              <div className="space-y-2 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                <p>
                  KeyTrader 采用多维度智能匹配算法，综合考虑业务兼容性、财务匹配度、时间线对齐、地理位置、专业能力和声誉评分等因素，为您推荐最合适的合作对象。
                </p>
                <p>
                  算法版本：v1.0.0
                </p>
                <p>
                  置信度：基于机器学习模型计算，反映推荐结果的可靠程度。
                </p>
              </div>
            </TacticalCard>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
