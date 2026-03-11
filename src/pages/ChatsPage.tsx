import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Lock, Shield, Clock, Radio } from 'lucide-react';
import { useIdentity } from '@/hooks/use-identity';

/**
 * 对话列表页面 - 移动端军事科技风格
 */
export default function ChatsPage() {
  const navigate = useNavigate();
  const { formatOtherIdentity, getUserAvatarText, getUserAvatarGradient } = useIdentity();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'important'>('all');

  // 模拟对话数据
  const mockChats = [
    {
      id: '1',
      projectId: '1',
      projectTitle: '新能源电池研发项目',
      counterpartId: 'IDXYZ5678',
      // 对方用户信息（包含角色）
      counterpartUser: {
        id: 'IDXYZ5678',
        role: 'broker', // 推荐人角色
        isVerified: true,
      },
      lastMessage: '您好，我对这个项目很感兴趣，可以详细聊聊吗？',
      lastMessageTime: '2026-03-10T20:30:00Z',
      unreadCount: 2,
      isEncrypted: true,
      isVerified: true,
      status: 'active',
      tags: ['新能源', 'A轮'],
    },
    {
      id: '2',
      projectId: '2',
      projectTitle: '智能制造产业基金',
      counterpartId: 'IDABCD1234',
      counterpartUser: {
        id: 'IDABCD1234',
        role: 'project_owner', // 项目方角色
        isVerified: true,
      },
      lastMessage: '资料已经发送到您的加密邮箱了',
      lastMessageTime: '2026-03-10T18:15:00Z',
      unreadCount: 0,
      isEncrypted: true,
      isVerified: true,
      status: 'active',
      tags: ['基金', '智能制造'],
    },
    {
      id: '3',
      projectId: '3',
      projectTitle: '半导体设备进口贸易',
      counterpartId: 'IDTEST9999',
      counterpartUser: {
        id: 'IDTEST9999',
        role: 'trader', // 贸易方角色
        isVerified: false,
      },
      lastMessage: '请问设备的具体型号是什么？',
      lastMessageTime: '2026-03-10T15:45:00Z',
      unreadCount: 1,
      isEncrypted: true,
      isVerified: false,
      status: 'active',
      tags: ['半导体', '设备'],
    },
    {
      id: '4',
      projectId: '1',
      projectTitle: '新能源电池研发项目',
      counterpartId: 'IDCAP001',
      counterpartUser: {
        id: 'IDCAP001',
        role: 'capital_provider', // 资金方角色
        isVerified: true,
      },
      lastMessage: '感谢推荐，我们会尽快评估项目',
      lastMessageTime: '2026-03-09T12:00:00Z',
      unreadCount: 0,
      isEncrypted: true,
      isVerified: true,
      status: 'archived',
      tags: ['已完成'],
    },
  ];

  // 筛选对话
  const filteredChats = mockChats.filter((chat) => {
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const displayName = formatOtherIdentity(chat.counterpartUser, 'list').toLowerCase();
      return (
        chat.projectTitle.toLowerCase().includes(query) ||
        displayName.includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // 根据标签筛选
  const getFilteredChats = () => {
    if (filterTab === 'unread') {
      return filteredChats.filter((chat) => chat.unreadCount > 0);
    }
    if (filterTab === 'important') {
      return filteredChats.filter((chat) => chat.isVerified);
    }
    return filteredChats;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
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
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">加密通信</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Lock className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">端到端加密</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/projects')}
            className="px-3 py-1.5 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-xs text-[hsl(var(--tech-cyan))] flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>新对话</span>
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
            placeholder="搜索对话、项目或消息..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
          />
        </motion.div>

        {/* 筛选标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
        >
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterTab === 'all'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterTab === 'unread'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            未读
          </button>
          <button
            onClick={() => setFilterTab('important')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border whitespace-nowrap transition-all ${
              filterTab === 'important'
                ? 'bg-[hsl(var(--tech-cyan))]/20 border-[hsl(var(--tech-cyan))] text-[hsl(var(--tech-cyan))]'
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}
          >
            已验证
          </button>
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] mt-3 pt-3 border-t border-[hsl(var(--border))]"
        >
          <span>
            共 <span className="text-[hsl(var(--tech-cyan))] font-bold">{getFilteredChats().length}</span> 个对话
          </span>
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
            <span>加密保护</span>
          </span>
        </motion.div>
      </section>

      {/* 对话列表 */}
      <section className="px-4">
        <AnimatePresence mode="popLayout">
          {getFilteredChats().length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔐</div>
              <div className="text-xl text-[hsl(var(--muted-foreground))] mb-2">暂无对话</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]/70">
                {searchQuery || filterTab !== 'all'
                  ? '尝试调整筛选条件'
                  : '点击上方按钮创建第一个对话'}
              </div>
            </motion.div>
          ) : (
            getFilteredChats().map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/chats/${chat.id}`)}
                className="relative bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--background))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden mb-3 cursor-pointer"
              >
                <div className="absolute inset-0 hud-grid opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))]/50 to-transparent" />

                <div className="relative">
                  {/* 顶部信息行 */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* 头像 */}
                    <div className="relative">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getUserAvatarGradient(chat.counterpartUser)} rounded-xl flex items-center justify-center text-lg font-bold text-[hsl(var(--foreground))] border-2 border-[hsl(var(--tech-cyan))]/30`}>
                        {getUserAvatarText(chat.counterpartUser)}
                      </div>
                      {/* 在线状态 */}
                      {chat.status === 'active' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[hsl(var(--tactical-green))] rounded-full border-2 border-[hsl(var(--background))] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                      {/* 验证徽章 */}
                      {chat.isVerified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--tech-cyan))] rounded-full flex items-center justify-center border-2 border-[hsl(var(--background))]">
                          <Shield className="w-2.5 h-2.5 text-[hsl(var(--background))]" />
                        </div>
                      )}
                    </div>

                    {/* 对话信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-[hsl(var(--foreground))] line-clamp-1">
                            {formatOtherIdentity(chat.counterpartUser, 'list')}
                          </h3>
                          <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                            关于 {chat.projectTitle}
                          </div>
                        </div>
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))] ml-2 flex-shrink-0">
                          {formatTimestamp(chat.lastMessageTime)}
                        </div>
                      </div>

                      {/* 最后消息 */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {chat.isEncrypted && (
                            <Lock className="w-3 h-3 text-[hsl(var(--tech-cyan))]/60 flex-shrink-0 mt-0.5" />
                          )}
                          <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 flex-1">
                            {chat.lastMessage}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <div className="flex-shrink-0 w-5 h-5 bg-[hsl(var(--tech-cyan))] rounded-full flex items-center justify-center text-[10px] font-bold text-[hsl(var(--background))]">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5">
                    {chat.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-[10px] px-2 py-0.5 rounded bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] border border-[hsl(var(--tech-cyan))]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      {/* 浮动操作按钮 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/projects')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))] rounded-full flex items-center justify-center shadow-lg z-40"
        style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}
