import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Link2,
  MessageSquare,
  Plus,
  Edit3,
  Save,
  X,
  XCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { NodeStatus } from '@/types';
import { TacticalCard, TacticalBadge } from '@/components/ui/tactical';

/**
 * 模拟任务数据
 */
const mockTask = {
  id: 'task_001',
  project_id: 'proj_001',
  title: '完成尽职调查',
  description: '对项目方进行全面尽职调查，包括财务状况、市场前景、团队能力等方面评估。',
  status: NodeStatus.IN_PROGRESS,
  order: 1,
  dependencies: [],
  assignee_id: 'user_001',
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * 任务详情页面 - 移动端军事科技风格
 * KeyTrader 任务管理功能
 */
export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(mockTask);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');

  // 模拟评论数据
  const [comments] = useState([
    {
      id: 'comment_001',
      user_id: 'user_002',
      user_name: '张三',
      content: '尽职调查报告需要包含财务审计部分',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'comment_002',
      user_id: 'user_003',
      user_name: '李四',
      content: '市场调研数据已更新，请查看附件',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  // 获取状态颜色
  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.COMPLETED:
        return 'text-[hsl(var(--tactical-green))] bg-[hsl(var(--tactical-green))]/10 border-[hsl(var(--tactical-green))]/30';
      case NodeStatus.IN_PROGRESS:
        return 'text-[hsl(var(--tech-cyan))] bg-[hsl(var(--tech-cyan))]/10 border-[hsl(var(--tech-cyan))]/30';
      case NodeStatus.PENDING:
        return 'text-[hsl(var(--finance-gold))] bg-[hsl(var(--finance-gold))]/10 border-[hsl(var(--finance-gold))]/30';
      case NodeStatus.CANCELLED:
        return 'text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/30';
      default:
        return 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] border-[hsl(var(--border))]';
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: NodeStatus) => {
    const labels: Record<NodeStatus, string> = {
      [NodeStatus.PENDING]: '待开始',
      [NodeStatus.PROJECT_CONFIRMED]: '项目方已确认',
      [NodeStatus.CAPITAL_CONFIRMED]: '资金方已确认',
      [NodeStatus.INTRODUCER_CONFIRMED]: '推荐人已确认',
      [NodeStatus.CONFIRMED]: '已确认',
      [NodeStatus.IN_PROGRESS]: '进行中',
      [NodeStatus.COMPLETED]: '已完成',
      [NodeStatus.CANCELLED]: '已取消',
    };
    return labels[status] || status;
  };

  // 处理保存
  const handleSave = () => {
    console.log('保存任务:', editedTask);
    // TODO: 调用 API 保存任务
    setIsEditing(false);
  };

  // 处理添加评论
  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('添加评论:', newComment);
      // TODO: 调用 API 添加评论
      setNewComment('');
      setShowAddComment(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 计算剩余天数
  const getRemainingDays = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '已逾期';
    if (diffDays === 0) return '今天到期';
    if (diffDays === 1) return '明天到期';
    return `还剩 ${diffDays} 天`;
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
              <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">任务详情</h1>
              <FileText className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                任务 #{taskId?.slice(-4).toUpperCase()}
              </span>
            </div>
          </div>

          {/* 编辑按钮 */}
          {!isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-xs text-[hsl(var(--tech-cyan))] flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              编辑
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="px-3 py-1.5 bg-[hsl(var(--tactical-green))] text-[hsl(var(--background))] rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              保存
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* 任务信息卡片 */}
      <section className="px-4 space-y-3">
        <TacticalCard className="corner-deco">
          {/* 状态和标题 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full text-lg font-bold text-[hsl(var(--foreground))] bg-transparent border-b border-[hsl(var(--tech-cyan))] outline-none"
                />
              ) : (
                <h2 className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">
                  {mockTask.title}
                </h2>
              )}
              <TacticalBadge variant="tech" className={`${getStatusColor(mockTask.status)} text-[10px]`}>
                {getStatusLabel(mockTask.status)}
              </TacticalBadge>
            </div>
          </div>

          {/* 描述 */}
          <div className="mb-4">
            <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">任务描述</div>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] resize-none"
                rows={4}
              />
            ) : (
              <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
                {mockTask.description}
              </p>
            )}
          </div>

          {/* 任务信息 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
              <div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">负责人</div>
                <div className="text-xs text-[hsl(var(--foreground))]">推荐人</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[hsl(var(--finance-gold))]" />
              <div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">截止日期</div>
                <div className="text-xs text-[hsl(var(--foreground))]">
                  {formatDate(mockTask.due_date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[hsl(var(--military-olive))]" />
              <div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">剩余时间</div>
                <div className="text-xs text-[hsl(var(--foreground))]">
                  {getRemainingDays(mockTask.due_date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[hsl(var(--tech-cyan))]" />
              <div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))]">任务编号</div>
                <div className="text-xs text-[hsl(var(--tech-cyan))] font-mono">
                  #{mockTask.id.slice(-8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* 依赖任务 */}
          {mockTask.dependencies && mockTask.dependencies.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">依赖任务</div>
              <div className="flex flex-wrap gap-2">
                {mockTask.dependencies.map((depId) => (
                  <span
                    key={depId}
                    className="text-[10px] px-2 py-1 bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] rounded border border-[hsl(var(--tech-cyan))]/20 flex items-center gap-1"
                  >
                    <Link2 className="w-3 h-3" />
                    {depId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TacticalCard>

        {/* 评论区域 */}
        <TacticalCard className="corner-deco">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[hsl(var(--foreground))]">评论 ({comments.length})</h3>
            {!showAddComment && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddComment(true)}
                className="px-2 py-1 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded text-[10px] text-[hsl(var(--tech-cyan))] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                添加
              </motion.button>
            )}
          </div>

          <div className="space-y-3">
            {/* 添加评论输入框 */}
            <AnimatePresence>
              {showAddComment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="输入评论内容..."
                    className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] resize-none mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                        newComment.trim()
                          ? 'bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))]'
                          : 'bg-[hsl(var(--muted-foreground))]/30 text-[hsl(var(--muted-foreground))] cursor-not-allowed'
                      }`}
                    >
                      发表评论
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowAddComment(false);
                        setNewComment('');
                      }}
                      className="px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-xs text-[hsl(var(--muted-foreground))]"
                    >
                      取消
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 评论列表 */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">
                    暂无评论
                  </div>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[hsl(var(--tech-cyan))] rounded-full flex items-center justify-center text-[10px] font-bold text-[hsl(var(--background))]">
                          {comment.user_name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                          {comment.user_name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                        {new Date(comment.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </TacticalCard>

        {/* 操作按钮 */}
        {mockTask.status === NodeStatus.IN_PROGRESS && (
          <TacticalCard title="任务操作" className="corner-deco">
            <div className="space-y-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-[hsl(var(--tactical-green))] text-[hsl(var(--background))] rounded-lg text-sm font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                标记为完成
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-[hsl(var(--destructive))]/20 border border-[hsl(var(--destructive))]/30 text-[hsl(var(--destructive))] rounded-lg text-sm font-bold flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                取消任务
              </motion.button>
            </div>
          </TacticalCard>
        )}
      </section>
    </div>
  );
}
