import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Target, Shield, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { DealType, NodeStatus } from '@/types';
import { TacticalBadge } from '@/components/ui/tactical';
import { useProjectsStore, useAuthStore } from '@/store';
import type { Project } from '@/store/projects';

/**
 * 项目列表页面 - 移动端军事科技风格
 */
export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const userProjects = useProjectsStore((state) => state.projects);

  // Tab 状态
  const currentTab = searchParams.get('tab') || 'all-projects';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // 筛选状态
  const [filters, setFilters] = useState({
    type: 'ALL' as DealType | 'ALL',
    status: 'ALL' as NodeStatus | 'ALL',
    search: '',
  });

  // 模拟项目数据（目标库）
  const mockProjects: Project[] = [
    {
      id: '1',
      user_id: 'other_001',
      type: DealType.PROJECT,
      title: '新能源电池研发项目',
      description: '寻求A轮融资5000万元，用于新一代动力电池研发和生产线建设',
      budget_min: 45000000,
      budget_max: 55000000,
      location: '江苏省苏州市',
      status: NodeStatus.PENDING,
      created_at: '2026-03-10',
      updated_at: '2026-03-10',
      tags: ['新能源', '电池', 'A轮'],
      isFeatured: true,
      isUrgent: false,
    },
    {
      id: '2',
      user_id: 'other_002',
      type: DealType.CAPITAL,
      title: '智能制造产业基金',
      description: '专注投资智能制造、工业自动化等领域，单笔投资500-5000万元',
      budget_min: 500000000,
      budget_max: 200000000,
      location: '北京市',
      status: NodeStatus.IN_PROGRESS,
      created_at: '2026-03-09',
      updated_at: '2026-03-09',
      tags: ['基金', '智能制造', '股权投资'],
      isFeatured: true,
      isUrgent: true,
    },
    {
      id: '3',
      user_id: 'other_003',
      type: DealType.TRADE,
      title: '半导体设备进口贸易',
      description: '代理进口日本、德国半导体生产设备，提供清关和物流服务',
      budget_min: 7000000,
      budget_max: 9000000,
      location: '上海市',
      status: NodeStatus.CONFIRMED,
      created_at: '2026-03-08',
      updated_at: '2026-03-08',
      tags: ['半导体', '设备', '进出口'],
      isFeatured: false,
      isUrgent: false,
    },
  ];

  // 根据 Tab 选择数据源
  const displayProjects = useMemo(() => {
    if (currentTab === 'my-projects') {
      // 显示用户创建的项目
      return userProjects;
    } else {
      // 显示目标库的所有项目
      return mockProjects;
    }
  }, [currentTab, userProjects]);

  // 筛选后的项目列表
  const filteredProjects = displayProjects.filter((project) => {
    // 类型筛选
    if (filters.type !== 'ALL' && project.type !== filters.type) {
      return false;
    }
    // 状态筛选
    if (filters.status !== 'ALL' && project.status !== filters.status) {
      return false;
    }
    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // 类型配置
  const typeConfig = {
    ALL: { label: '全部', color: 'text-[hsl(var(--foreground))]' },
    [DealType.PROJECT]: { label: 'PROJECT', color: 'text-[hsl(var(--tech-cyan))]' },
    [DealType.CAPITAL]: { label: 'CAPITAL', color: 'text-[hsl(var(--finance-gold))]' },
    [DealType.TRADE]: { label: 'TRADE', color: 'text-[hsl(var(--military-olive))]' },
  };

  // 状态配置
  const statusConfig = {
    ALL: { label: '全部', color: 'text-[hsl(var(--foreground))]' },
    [NodeStatus.PENDING]: { label: '待确认', color: 'text-yellow-500' },
    [NodeStatus.IN_PROGRESS]: { label: '进行中', color: 'text-blue-500' },
    [NodeStatus.CONFIRMED]: { label: '已确认', color: 'text-green-500' },
    [NodeStatus.COMPLETED]: { label: '已完成', color: 'text-gray-500' },
  };

  const formatBudget = (budget_min: number, budget_max: number) => {
    const avgBudget = (budget_min + budget_max) / 2;
    if (avgBudget >= 100000000) {
      return `${(avgBudget / 100000000).toFixed(1)}亿`;
    }
    if (avgBudget >= 10000) {
      return `${(avgBudget / 10000).toFixed(0)}万`;
    }
    return avgBudget.toLocaleString();
  };

  return (
    <div className="space-y-4 pb-6 bg-background min-h-full">
      {/* 页面标题和筛选 */}
      <section className="px-4 pt-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-3"
        >
          <div className="w-1 h-5 bg-[hsl(var(--tech-cyan))] rounded-full" />
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">对接中心</h2>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] tracking-wider">
              DEALS CENTER
            </p>
          </div>
        </motion.div>

        {/* Tab 切换按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex gap-2 mb-3"
        >
          <button
            onClick={() => setTab('all-projects')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              currentTab === 'all-projects'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            目标库
          </button>
          <button
            onClick={() => setTab('my-projects')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wider border transition-all ${
              currentTab === 'my-projects'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            我的对接
          </button>
        </motion.div>

        {/* 搜索框 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-3"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="搜索标题、描述或标签..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
          />
        </motion.div>

        {/* 类型筛选标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide"
        >
          {Object.entries(typeConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilters({ ...filters, type: key as DealType | 'ALL' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                filters.type === key
                  ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                  : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
              }`}
            >
              {config.label}
            </button>
          ))}
        </motion.div>

        {/* 状态筛选标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilters({ ...filters, status: key as NodeStatus | 'ALL' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                filters.status === key
                  ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                  : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
              }`}
            >
              {config.label}
            </button>
          ))}
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] mt-3 pt-3 border-t border-[hsl(var(--border))]"
        >
          <span>
            找到 <span className="text-[hsl(var(--tech-cyan))] font-bold">{filteredProjects.length}</span> 个对接
          </span>
        </motion.div>
      </section>

      {/* 项目列表 */}
      <section className="px-4">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📭</div>
              <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无对接</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                {filters.search || filters.type !== 'ALL' || filters.status !== 'ALL'
                  ? '尝试调整筛选条件'
                  : '点击下方按钮创建第一个对接'}
              </div>
            </motion.div>
          ) : (
            filteredProjects.map((project, index) => {
              const typeInfo = typeConfig[project.type];
              const statusInfo = statusConfig[project.status];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-xl border border-[hsl(var(--border))] corner-deco overflow-hidden mb-3 cursor-pointer"
                >
                  {/* HUD网格背景 */}
                  <div className="absolute inset-0 hud-grid opacity-20" />

                  {/* 顶部扫描线 */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))]/50 to-transparent" />

                  <div className="relative p-4">
                    {/* 标签行 */}
                    <div className="flex items-center gap-2 mb-3">
                      {/* 类型标签 */}
                      <TacticalBadge variant="info" className={`${typeInfo.color} text-[10px] px-2 py-0.5`}>
                        {typeInfo.label}
                      </TacticalBadge>

                      {/* 状态标签 */}
                      <TacticalBadge variant="info" className={`${statusInfo.color} text-[10px] px-2 py-0.5`}>
                        {statusInfo.label}
                      </TacticalBadge>

                      {/* 特殊标签 */}
                      {project.isUrgent && (
                        <span className="tag-urgent px-2 py-0.5">紧急</span>
                      )}
                      {project.isFeatured && (
                        <span className="tag-finance px-2 py-0.5">精选</span>
                      )}
                    </div>

                    {/* 标题 */}
                    <h3 className="text-base font-bold text-[hsl(var(--foreground))] mb-2 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* 描述 */}
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-[10px] px-2 py-0.5 rounded bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] border border-[hsl(var(--tech-cyan))]/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* 底部信息 */}
                    <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))]">预算</div>
                        <div className="text-sm font-bold text-[hsl(var(--finance-gold))]">
                          ¥{formatBudget(project.budget_min, project.budget_max)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))]">地区</div>
                        <div className="text-sm font-semibold text-[hsl(var(--tech-cyan))]">
                          {project.location}
                        </div>
                      </div>
                    </div>

                    {/* 用户项目：AI 匹配按钮 */}
                    {currentTab === 'my-projects' && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/matching');
                        }}
                        className="w-full mt-3 py-2.5 bg-gradient-to-r from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))] text-[hsl(var(--background))] rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI 智能匹配</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </section>

      {/* 悬浮创建按钮 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/projects/create')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))] rounded-full flex items-center justify-center shadow-lg z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
