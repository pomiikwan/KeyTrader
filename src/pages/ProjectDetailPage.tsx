import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, User as UserIcon, Shield, Edit, MessageSquare, Copy, Trash2 } from 'lucide-react';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';
import { DealType, NodeStatus, UserRole } from '@/types';

/**
 * 项目详情页面 - 移动端军事科技风格
 */
export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'related'>('info');

  // 模拟项目数据
  const mockProject = {
    id: id || '1',
    type: DealType.PROJECT,
    title: '新能源电池研发项目',
    description: '寻求A轮融资5000万元，用于新一代动力电池研发和生产线建设。项目团队由清华大学电池技术专家领衔，已获得3项核心专利，能量密度达到300Wh/kg，循环寿命超过2000次。',
    budget: 50000000,
    budget_range: '3000-8000万',
    location: '江苏省苏州市',
    status: NodeStatus.PENDING,
    created_at: '2026-03-10',
    updated_at: '2026-03-10',
    tags: ['新能源', '电池', 'A轮'],
    creator: {
      virtual_id: 'IDABCD1234',
      nickname: '创新科技公司',
      role: UserRole.PROJECT_OWNER,
      trust_score: 85,
    },
    requirements: {
      industry: '新能源',
      stage: 'A轮',
      use_of_funds: '研发70% + 产线30%',
      timeline: '2026年内完成',
    },
    // 三方确认状态
    confirmations: {
      project_owner: {
        user_id: '1',
        virtual_id: 'IDABCD1234',
        confirmed: true,
        confirmed_at: '2026-03-10T10:00:00Z',
        role: UserRole.PROJECT_OWNER,
      },
      capital_provider: {
        user_id: null,
        virtual_id: null,
        confirmed: false,
        confirmed_at: null,
        role: UserRole.CAPITAL_PROVIDER,
      },
      introducer: {
        user_id: '3',
        virtual_id: 'IDXYZ5678',
        confirmed: true,
        confirmed_at: '2026-03-10T11:00:00Z',
        role: UserRole.INTRODUCER,
      },
    },
  };

  // 相关推荐
  const relatedProjects = [
    {
      id: '2',
      type: DealType.CAPITAL,
      title: '智能制造产业基金',
      budget: 200000000,
      location: '北京市',
      tags: ['基金', '智能制造', '股权投资'],
    },
    {
      id: '3',
      type: DealType.TRADE,
      title: '半导体设备进口贸易',
      budget: 8000000,
      location: '上海市',
      tags: ['半导体', '设备', '进出口'],
    },
  ];

  // 活动时间线
  const timeline = [
    {
      id: '1',
      action: '创建对接',
      user: '创新科技公司',
      role: UserRole.PROJECT_OWNER,
      timestamp: '2026-03-10T10:00:00Z',
      description: '发布了新能源电池研发项目',
    },
    {
      id: '2',
      action: '推荐确认',
      user: '推荐人(IDXYZ5678)',
      role: UserRole.INTRODUCER,
      timestamp: '2026-03-10T11:00:00Z',
      description: '确认推荐此对接',
    },
  ];

  // 类型配置
  const typeConfig = {
    [DealType.PROJECT]: { label: 'PROJECT', color: 'text-[hsl(var(--tech-cyan))]' },
    [DealType.CAPITAL]: { label: 'CAPITAL', color: 'text-[hsl(var(--finance-gold))]' },
    [DealType.TRADE]: { label: 'TRADE', color: 'text-[hsl(var(--military-olive))]' },
  };

  // 状态配置
  const statusConfig = {
    [NodeStatus.PENDING]: { label: '待确认', color: 'text-yellow-500' },
    [NodeStatus.PROJECT_CONFIRMED]: { label: '项目方已确认', color: 'text-blue-400' },
    [NodeStatus.CAPITAL_CONFIRMED]: { label: '资金方已确认', color: 'text-cyan-500' },
    [NodeStatus.INTRODUCER_CONFIRMED]: { label: '推荐人已确认', color: 'text-purple-500' },
    [NodeStatus.CONFIRMED]: { label: '已确认', color: 'text-green-500' },
    [NodeStatus.IN_PROGRESS]: { label: '进行中', color: 'text-blue-500' },
    [NodeStatus.COMPLETED]: { label: '已完成', color: 'text-gray-500' },
    [NodeStatus.CANCELLED]: { label: '已取消', color: 'text-red-500' },
  };

  const formatBudget = (budget: number) => {
    if (budget >= 100000000) {
      return `${(budget / 100000000).toFixed(1)}亿`;
    }
    if (budget >= 10000) {
      return `${(budget / 10000).toFixed(0)}万`;
    }
    return budget.toLocaleString();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const typeInfo = typeConfig[mockProject.type];
  const statusInfo = statusConfig[mockProject.status];
  const confirmations = mockProject.confirmations;
  const confirmationCount = Object.values(confirmations).filter(c => c.confirmed).length;
  const confirmationProgress = (confirmationCount / 3) * 100;

  return (
    <div className="space-y-4 pb-6 bg-background min-h-full">
      {/* 顶部导航栏 - 移动端风格 */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/projects')}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">对接详情</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TacticalBadge variant="tech" className={`${typeInfo.color} text-[10px] px-2 py-0.5`}>
              {typeInfo.label}
            </TacticalBadge>
            <TacticalBadge variant="tech" className={`${statusInfo.color} text-[10px] px-2 py-0.5`}>
              {statusInfo.label}
            </TacticalBadge>
          </div>
        </motion.div>

        {/* 标签切换 - 水平滚动 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              activeTab === 'info'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            基本信息
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              activeTab === 'timeline'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            活动时间线
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              activeTab === 'related'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            相关推荐
          </button>
        </motion.div>
      </section>

      {/* 主内容区域 */}
      <section className="px-4">
        <AnimatePresence mode="wait">
          {/* 基本信息 */}
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* 对接信息卡片 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))]/50 to-transparent" />

                <div className="relative">
                  <h2 className="text-lg font-bold text-[hsl(var(--foreground))] mb-3">
                    {mockProject.title}
                  </h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                    {mockProject.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockProject.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-[10px] px-2 py-0.5 rounded bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] border border-[hsl(var(--tech-cyan))]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 关键信息 */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[hsl(var(--background))]/50 rounded-lg p-3">
                      <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1">预算范围</div>
                      <div className="text-base font-bold text-[hsl(var(--finance-gold))]">
                        ¥{mockProject.budget_range}
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--background))]/50 rounded-lg p-3">
                      <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1">所在地区</div>
                      <div className="text-base font-bold text-[hsl(var(--tech-cyan))]">
                        {mockProject.location}
                      </div>
                    </div>
                  </div>

                  {/* 详细要求 */}
                  {mockProject.requirements && (
                    <div className="pt-3 border-t border-[hsl(var(--border))]">
                      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">详细要求</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-[10px] text-[hsl(var(--muted-foreground))]">行业领域</div>
                          <div className="text-[hsl(var(--foreground))]">{mockProject.requirements.industry}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[hsl(var(--muted-foreground))]">融资阶段</div>
                          <div className="text-[hsl(var(--foreground))]">{mockProject.requirements.stage}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[hsl(var(--muted-foreground))]">资金用途</div>
                          <div className="text-[hsl(var(--foreground))]">{mockProject.requirements.use_of_funds}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[hsl(var(--muted-foreground))]">时间要求</div>
                          <div className="text-[hsl(var(--foreground))]">{mockProject.requirements.timeline}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 三方确认状态卡片 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[hsl(var(--foreground))]">三方确认状态</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">{confirmationCount}/3</span>
                      <div className="w-16 h-2 bg-[hsl(var(--background))] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[hsl(var(--tech-cyan))] to-[hsl(var(--finance-gold))] transition-all"
                          style={{ width: `${confirmationProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* 项目方确认 */}
                    <div className={`p-3 rounded-lg border ${
                      confirmations.project_owner.confirmed
                        ? 'border-[hsl(var(--tactical-green))]/50 bg-[hsl(var(--tactical-green))]/10'
                        : 'border-[hsl(var(--border))]'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
                          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">项目方</span>
                        </div>
                        {confirmations.project_owner.confirmed ? (
                          <TacticalBadge variant="success" className="text-[10px]">已确认</TacticalBadge>
                        ) : (
                          <TacticalBadge variant="tech" className="text-[10px]">待确认</TacticalBadge>
                        )}
                      </div>
                      {confirmations.project_owner.confirmed && (
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))] space-y-0.5">
                          <div>确认方: {confirmations.project_owner.virtual_id}</div>
                          <div>确认时间: {formatTimestamp(confirmations.project_owner.confirmed_at!)}</div>
                        </div>
                      )}
                    </div>

                    {/* 资金方/贸易方确认 */}
                    <div className={`p-3 rounded-lg border ${
                      confirmations.capital_provider.confirmed
                        ? 'border-[hsl(var(--tactical-green))]/50 bg-[hsl(var(--tactical-green))]/10'
                        : 'border-[hsl(var(--border))]'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
                          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                            {mockProject.type === DealType.TRADE ? '贸易方' : '资金方'}
                          </span>
                        </div>
                        {confirmations.capital_provider.confirmed ? (
                          <TacticalBadge variant="success" className="text-[10px]">已确认</TacticalBadge>
                        ) : (
                          <TacticalBadge variant="tech" className="text-[10px]">待确认</TacticalBadge>
                        )}
                      </div>
                      {confirmations.capital_provider.confirmed && confirmations.capital_provider.virtual_id && (
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))] space-y-0.5">
                          <div>确认方: {confirmations.capital_provider.virtual_id}</div>
                          <div>确认时间: {formatTimestamp(confirmations.capital_provider.confirmed_at!)}</div>
                        </div>
                      )}
                      {!confirmations.capital_provider.confirmed && (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="mt-2 w-full py-2 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded text-xs text-[hsl(var(--tech-cyan))]"
                        >
                          我就是{mockProject.type === DealType.TRADE ? '贸易方' : '资金方'}，确认对接
                        </motion.button>
                      )}
                    </div>

                    {/* 推荐人确认 */}
                    <div className={`p-3 rounded-lg border ${
                      confirmations.introducer.confirmed
                        ? 'border-[hsl(var(--tactical-green))]/50 bg-[hsl(var(--tactical-green))]/10'
                        : 'border-[hsl(var(--border))]'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[hsl(var(--military-olive))]" />
                          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">推荐人</span>
                        </div>
                        {confirmations.introducer.confirmed ? (
                          <TacticalBadge variant="success" className="text-[10px]">已确认</TacticalBadge>
                        ) : (
                          <TacticalBadge variant="tech" className="text-[10px]">待确认</TacticalBadge>
                        )}
                      </div>
                      {confirmations.introducer.confirmed && (
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))] space-y-0.5">
                          <div>确认方: {confirmations.introducer.virtual_id}</div>
                          <div>确认时间: {formatTimestamp(confirmations.introducer.confirmed_at!)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 创建者信息卡片 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative">
                  <h3 className="text-sm font-bold text-[hsl(var(--foreground))] mb-3">创建者信息</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">虚拟ID</span>
                      <span className="font-mono text-[hsl(var(--tech-cyan))]">{mockProject.creator.virtual_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">昵称</span>
                      <span className="text-[hsl(var(--foreground))]">{mockProject.creator.nickname}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">用户角色</span>
                      <span className="text-[hsl(var(--tech-cyan))]">
                        {mockProject.creator.role === UserRole.PROJECT_OWNER ? '项目方' :
                         mockProject.creator.role === UserRole.CAPITAL_PROVIDER ? '资金方' :
                         mockProject.creator.role === UserRole.TRADER ? '贸易方' : '推荐人'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">信任评分</span>
                      <span className="font-bold text-[hsl(var(--finance-gold))]">{mockProject.creator.trust_score}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 时间信息卡片 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative">
                  <h3 className="text-sm font-bold text-[hsl(var(--foreground))] mb-3">时间信息</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">创建时间</span>
                      </div>
                      <span className="text-[hsl(var(--foreground))]">
                        {new Date(mockProject.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">更新时间</span>
                      </div>
                      <span className="text-[hsl(var(--foreground))]">
                        {new Date(mockProject.updated_at).toLocaleString('zh-CN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 活动时间线 */}
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative">
                  <h3 className="text-sm font-bold text-[hsl(var(--foreground))] mb-4">活动时间线</h3>
                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-[hsl(var(--tech-cyan))]" />
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-[hsl(var(--tech-cyan))]/30 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{item.action}</span>
                            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                              {formatTimestamp(item.timestamp)}
                            </span>
                          </div>
                          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{item.user}</div>
                          <div className="text-xs text-[hsl(var(--foreground))]">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 相关推荐 */}
          {activeTab === 'related' && (
            <motion.div
              key="related"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden mb-4">
                <div className="absolute inset-0 hud-grid opacity-20" />
                <div className="relative">
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    基于此对接的智能匹配推荐
                  </p>
                </div>
              </div>

              {relatedProjects.map((project) => {
                const info = typeConfig[project.type];
                return (
                  <motion.div
                    key={project.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 hud-grid opacity-20" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))]/50 to-transparent" />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-2">
                        <TacticalBadge variant="tech" className={`${info.color} text-[10px] px-2 py-0.5`}>
                          {info.label}
                        </TacticalBadge>
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{project.location}</div>
                      </div>
                      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">{project.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-[hsl(var(--finance-gold))]">
                          ¥{formatBudget(project.budget)}
                        </div>
                        <div className="flex gap-1">
                          {project.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="text-[10px] px-2 py-0.5 rounded bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] border border-[hsl(var(--tech-cyan))]/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 底部操作栏 - 固定 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-16 left-0 right-0 z-30 px-4 py-3 bg-[hsl(var(--background))]/95 backdrop-blur-sm border-t border-[hsl(var(--border))]"
        style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div className="grid grid-cols-4 gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={mockProject.status !== NodeStatus.PENDING}
            className="flex flex-col items-center gap-1 py-2 px-3 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded-lg disabled:opacity-50"
          >
            <Edit className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
            <span className="text-[10px] text-[hsl(var(--tech-cyan))]">编辑</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!confirmations.capital_provider.confirmed}
            className="flex flex-col items-center gap-1 py-2 px-3 bg-[hsl(var(--finance-gold))]/20 border border-[hsl(var(--finance-gold))]/30 rounded-lg disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
            <span className="text-[10px] text-[hsl(var(--finance-gold))]">沟通</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/projects/create')}
            className="flex flex-col items-center gap-1 py-2 px-3 bg-[hsl(var(--military-olive))]/20 border border-[hsl(var(--military-olive))]/30 rounded-lg"
          >
            <Copy className="w-4 h-4 text-[hsl(var(--military-olive))]" />
            <span className="text-[10px] text-[hsl(var(--military-olive))]">相似</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1 py-2 px-3 bg-[hsl(var(--alert-red))]/20 border border-[hsl(var(--alert-red))]/30 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-[hsl(var(--alert-red))]" />
            <span className="text-[10px] text-[hsl(var(--alert-red))]">删除</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
