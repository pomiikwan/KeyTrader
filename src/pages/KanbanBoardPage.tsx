import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Plus, Calendar, AlertCircle, ChevronRight, Clock } from 'lucide-react';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';
import { NodeStatus, UserRole } from '@/types';

/**
 * 看板管理页面 - 移动端军事科技风格
 */
export default function KanbanBoardPage() {
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | NodeStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // 状态配置
  const statusConfig = {
    ALL: { label: '全部', color: 'text-[hsl(var(--foreground))]' },
    [NodeStatus.PENDING]: { label: '待确认', color: 'text-yellow-500' },
    [NodeStatus.PROJECT_CONFIRMED]: { label: '项目方已确认', color: 'text-blue-400' },
    [NodeStatus.CAPITAL_CONFIRMED]: { label: '资金方已确认', color: 'text-cyan-500' },
    [NodeStatus.INTRODUCER_CONFIRMED]: { label: '推荐人已确认', color: 'text-purple-500' },
    [NodeStatus.CONFIRMED]: { label: '已确认', color: 'text-green-500' },
    [NodeStatus.IN_PROGRESS]: { label: '进行中', color: 'text-blue-500' },
    [NodeStatus.COMPLETED]: { label: '已完成', color: 'text-gray-500' },
    [NodeStatus.CANCELLED]: { label: '已取消', color: 'text-red-500' },
  };

  // 优先级配置
  const priorityConfig = {
    high: { label: '高', color: 'text-[hsl(var(--alert-red))]', bg: 'bg-[hsl(var(--alert-red))]/10' },
    medium: { label: '中', color: 'text-[hsl(var(--finance-gold))]', bg: 'bg-[hsl(var(--finance-gold))]/10' },
    low: { label: '低', color: 'text-[hsl(var(--tech-cyan))]', bg: 'bg-[hsl(var(--tech-cyan))]/10' },
  };

  // 模拟任务数据
  const mockTasks = [
    {
      id: '1',
      project_id: '1',
      title: '签署保密协议',
      description: '项目方和资金方签署NDA',
      status: NodeStatus.COMPLETED,
      priority: 'high' as const,
      assignees: ['IDABCD1234'],
      due_date: '2026-03-15',
      created_at: '2026-03-10',
    },
    {
      id: '2',
      project_id: '1',
      title: '初步尽职调查',
      description: '资金方对项目方进行初步DD',
      status: NodeStatus.IN_PROGRESS,
      priority: 'high' as const,
      assignees: ['IDXYZ5678'],
      due_date: '2026-03-20',
      created_at: '2026-03-11',
    },
    {
      id: '3',
      project_id: '1',
      title: '商务谈判',
      description: '双方就合作条款进行谈判',
      status: NodeStatus.PENDING,
      priority: 'medium' as const,
      assignees: ['IDABCD1234', 'IDXYZ5678'],
      due_date: '2026-03-25',
      created_at: '2026-03-12',
    },
    {
      id: '4',
      project_id: '2',
      title: '资料准备',
      description: '准备项目相关资料',
      status: NodeStatus.PENDING,
      priority: 'low' as const,
      assignees: ['IDTEST9999'],
      due_date: '2026-03-18',
      created_at: '2026-03-13',
    },
  ];

  // 模拟对接列表
  const mockProjects = [
    { id: '1', title: '新能源电池研发项目' },
    { id: '2', title: '智能制造产业基金' },
  ];

  // 筛选任务
  const filteredTasks = mockTasks.filter((task) => {
    // 状态筛选
    if (filterStatus !== 'ALL' && task.status !== filterStatus) {
      return false;
    }
    // 项目筛选
    if (selectedProject && task.project_id !== selectedProject) {
      return false;
    }
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // 移动任务到下一个状态
  const moveToNextStatus = (taskId: string) => {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    const statusFlow: NodeStatus[] = [
      NodeStatus.PENDING,
      NodeStatus.IN_PROGRESS,
      NodeStatus.CONFIRMED,
      NodeStatus.COMPLETED,
    ];

    const currentIndex = statusFlow.indexOf(task.status);
    if (currentIndex < statusFlow.length - 1) {
      const newStatus = statusFlow[currentIndex + 1];
      // TODO: 调用API更新任务状态
      console.log(`Move task ${taskId} from ${task.status} to ${newStatus}`);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <div className="flex items-center gap-1 text-[hsl(var(--alert-red))]">
          <AlertCircle className="w-3 h-3" />
          <span>已逾期 {Math.abs(diffDays)} 天</span>
        </div>
      );
    } else if (diffDays === 0) {
      return (
        <div className="flex items-center gap-1 text-[hsl(var(--finance-gold))]">
          <Clock className="w-3 h-3" />
          <span>今天到期</span>
        </div>
      );
    } else if (diffDays === 1) {
      return (
        <div className="flex items-center gap-1 text-[hsl(var(--finance-gold))]">
          <Clock className="w-3 h-3" />
          <span>明天到期</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
          <Calendar className="w-3 h-3" />
          <span>{dateString}</span>
        </div>
      );
    }
  };

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
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">看板管理</h1>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="px-3 py-1.5 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-xs text-[hsl(var(--tech-cyan))] flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>新建</span>
          </motion.button>
        </motion.div>

        {/* 搜索框 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-3"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
          />
        </motion.div>

        {/* 项目选择 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-3"
        >
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value || null)}
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-4 py-2.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
          >
            <option value="">全部对接</option>
            {mockProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </motion.div>

        {/* 状态筛选标签 - 水平滚动 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key as 'ALL' | NodeStatus)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
                filterStatus === key
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
          transition={{ delay: 0.25 }}
          className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] mt-3 pt-3 border-t border-[hsl(var(--border))]"
        >
          <span>
            找到 <span className="text-[hsl(var(--tech-cyan))] font-bold">{filteredTasks.length}</span> 个任务
          </span>
          {selectedProject && (
            <span className="text-[hsl(var(--muted-foreground))]/70">
              {mockProjects.find((p) => p.id === selectedProject)?.title}
            </span>
          )}
        </motion.div>
      </section>

      {/* 任务列表 */}
      <section className="px-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📋</div>
              <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无任务</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                {selectedProject || searchQuery || filterStatus !== 'ALL'
                  ? '尝试调整筛选条件'
                  : '点击上方按钮创建第一个任务'}
              </div>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => {
              const statusInfo = statusConfig[task.status];
              const priority = priorityConfig[task.priority];
              const project = mockProjects.find((p) => p.id === task.project_id);

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden mb-3"
                >
                  <div className="absolute inset-0 hud-grid opacity-20" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))]/50 to-transparent" />

                  {/* 可点击的内容区域 */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="relative cursor-pointer"
                  >
                    <div className="relative">
                      {/* 顶部信息行 */}
                      <div className="flex items-start justify-between mb-3">
                        {/* 状态标签 */}
                        <TacticalBadge variant="tech" className={`${statusInfo.color} text-[10px] px-2 py-0.5`}>
                          {statusInfo.label}
                        </TacticalBadge>

                        {/* 优先级标签 */}
                        <TacticalBadge variant="tech" className={`${priority.color} ${priority.bg} text-[10px] px-2 py-0.5`}>
                          {priority.label}优先级
                        </TacticalBadge>
                      </div>

                      {/* 任务标题 */}
                      <h3 className="text-base font-bold text-[hsl(var(--foreground))] mb-2">
                        {task.title}
                      </h3>

                      {/* 任务描述 */}
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3 line-clamp-2">
                        {task.description}
                      </p>

                      {/* 所属对接 */}
                      {project && (
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-3">
                          所属对接: <span className="text-[hsl(var(--tech-cyan))]">{project.title}</span>
                        </div>
                      )}

                      {/* 底部信息行 */}
                      <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                        {/* 截止日期 */}
                        <div className="text-xs">
                          {formatDate(task.due_date)}
                        </div>

                        {/* 负责人 */}
                        {task.assignees.length > 0 && (
                          <div className="flex items-center gap-1">
                            {task.assignees.slice(0, 3).map((assignee, assigneeIndex) => (
                              <div
                                key={assigneeIndex}
                                className="w-6 h-6 rounded-full bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/40 flex items-center justify-center text-[10px] text-[hsl(var(--tech-cyan))]"
                                title={assignee}
                              >
                                {assignee.charAt(0)}
                              </div>
                            ))}
                            {task.assignees.length > 3 && (
                              <div className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                +{task.assignees.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 任务ID */}
                      <div className="text-[10px] text-[hsl(var(--muted-foreground))]/50 mt-2 text-right">
                        #{task.id}
                      </div>
                    </div>
                  </motion.div>

                  {/* 快速操作按钮 - 独立出来，不触发卡片点击 */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveToNextStatus(task.id);
                    }}
                    disabled={task.status === NodeStatus.COMPLETED}
                    className={`mt-3 w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                      task.status === NodeStatus.COMPLETED
                        ? 'bg-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] cursor-not-allowed'
                        : 'bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 text-[hsl(var(--tech-cyan))]'
                    }`}
                  >
                    <span>
                      {task.status === NodeStatus.PENDING && '开始任务'}
                      {task.status === NodeStatus.IN_PROGRESS && '标记确认'}
                      {task.status === NodeStatus.CONFIRMED && '完成任务'}
                      {task.status === NodeStatus.COMPLETED && '已完成'}
                    </span>
                    {task.status !== NodeStatus.COMPLETED && <ChevronRight className="w-3 h-3" />}
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
