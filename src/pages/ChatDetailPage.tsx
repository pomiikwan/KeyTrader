import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Lock,
  Shield,
  Plus,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  FileText,
  FolderOpen,
  MapPin,
  X,
} from 'lucide-react';
import { useIdentity } from '@/hooks/use-identity';

/**
 * 聊天详情页面 - 移动端军事科技风格
 */
export default function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatOtherIdentity, getUserAvatarText, getUserAvatarGradient, hints } = useIdentity();

  const [messageText, setMessageText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([
    {
      id: '1',
      senderId: 'IDXYZ5678',
      senderName: '推荐人',
      content: '您好！我看到了您的新能源电池项目，非常感兴趣。',
      timestamp: '2026-03-10T10:00:00Z',
      isEncrypted: true,
      isFromMe: false,
    },
    {
      id: '2',
      senderId: 'IDABCD1234',
      senderName: '我',
      content: '谢谢关注！我们的项目有清华大学团队支持，能量密度已达300Wh/kg。',
      timestamp: '2026-03-10T10:05:00Z',
      isEncrypted: true,
      isFromMe: true,
    },
    {
      id: '3',
      senderId: 'IDXYZ5678',
      senderName: '推荐人',
      content: '技术团队实力很强！目前的融资阶段是？',
      timestamp: '2026-03-10T10:10:00Z',
      isEncrypted: true,
      isFromMe: false,
    },
    {
      id: '4',
      senderId: 'IDABCD1234',
      senderName: '我',
      content: 'A轮融资5000万元，主要用于研发和产线建设。您方便详细介绍资金方的背景吗？',
      timestamp: '2026-03-10T10:15:00Z',
      isEncrypted: true,
      isFromMe: true,
    },
    {
      id: '5',
      senderId: 'IDXYZ5678',
      senderName: '推荐人',
      content: '当然，资金方是智能制造领域的专业投资机构，有丰富的新能源投资经验。',
      timestamp: '2026-03-10T20:30:00Z',
      isEncrypted: true,
      isFromMe: false,
    },
  ]);

  // 模拟对话数据
  const mockChat = {
    id: id || '1',
    projectId: '1',
    projectTitle: '新能源电池研发项目',
    counterpartId: 'IDXYZ5678',
    // 对方用户信息（包含角色）
    counterpartUser: {
      id: 'IDXYZ5678',
      role: 'broker', // 推荐人角色
      isVerified: true,
    },
    isEncrypted: true,
  };

  // 上传菜单选项
  const uploadOptions = [
    {
      id: 'image',
      label: '图片',
      icon: ImageIcon,
      color: 'from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))]',
      description: '上传图片资料',
    },
    {
      id: 'document',
      label: '文档',
      icon: FileText,
      color: 'from-[hsl(var(--finance-gold))] to-[hsl(var(--tech-cyan))]',
      description: '分享文档文件',
    },
    {
      id: 'project',
      label: '项目资料',
      icon: FolderOpen,
      color: 'from-[hsl(var(--military-olive))] to-[hsl(var(--tactical-green))]',
      description: '项目相关资料',
    },
    {
      id: 'location',
      label: '位置',
      icon: MapPin,
      color: 'from-[hsl(var(--tech-cyan))] to-[hsl(var(--finance-gold))]',
      description: '分享位置信息',
    },
  ];

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始加载和消息变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    // 创建新消息
    const newMessage = {
      id: String(messages.length + 1),
      senderId: 'IDABCD1234',
      senderName: '我',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      isEncrypted: true,
      isFromMe: true,
    };

    // 添加到消息列表
    setMessages([...messages, newMessage]);
    setMessageText('');

    // TODO: 后续接入真实API
    console.log('发送消息:', newMessage);
  };

  const handleUploadAction = (actionId: string) => {
    setShowUploadMenu(false);

    const action = uploadOptions.find((opt) => opt.id === actionId);
    if (!action) return;

    // TODO: 实现具体的上传功能
    console.log('上传操作:', action.label);
    alert(`${action.label}上传功能开发中...\n\n${action.description}`);
  };

  return (
    <div className="flex flex-col h-screen bg-background relative">
      {/* 顶部导航栏 */}
      <section className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-[hsl(var(--border))]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/chats')}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <h2 className="text-base font-bold text-[hsl(var(--foreground))] line-clamp-1">
              {formatOtherIdentity(mockChat.counterpartUser, 'chat')}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">关于 {mockChat.projectTitle}</span>
              {mockChat.counterpartUser.isVerified && (
                <div className="flex items-center gap-0.5">
                  <Shield className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
                  <span className="text-[10px] text-[hsl(var(--tech-cyan))]">已验证</span>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowActions(!showActions)}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--muted-foreground))]"
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* 消息列表 */}
      <section className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${message.isFromMe ? 'flex-row-reverse' : ''}`}
            >
              {/* 头像 */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  message.isFromMe
                    ? 'bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))]'
                    : 'bg-[hsl(var(--military-olive))] text-[hsl(var(--foreground))]'
                }`}
              >
                {message.isFromMe ? '我' : message.senderName.charAt(0)}
              </div>

              {/* 消息内容 */}
              <div className={`flex flex-col max-w-[75%] ${message.isFromMe ? 'items-end' : 'items-start'}`}>
                {/* 发送者名称和时间 */}
                <div
                  className={`flex items-center gap-2 mb-1 text-[10px] text-[hsl(var(--muted-foreground))] ${
                    message.isFromMe ? 'flex-row-reverse' : ''
                  }`}
                >
                  {!message.isFromMe && (
                    <span>
                      {message.isFromMe
                        ? '我'
                        : formatOtherIdentity({
                            id: message.senderId,
                            role: message.senderId === 'IDXYZ5678' ? 'broker' : 'project_owner',
                            isVerified: true,
                          }, 'chat')}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {message.isEncrypted && <Lock className="w-3 h-3" />}
                    <span>{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>

                {/* 消息气泡 */}
                <div
                  className={`relative px-4 py-2.5 rounded-2xl ${
                    message.isFromMe
                      ? 'bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 text-[hsl(var(--foreground))]'
                      : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))]'
                  }`}
                >
                  {/* 角标装饰 */}
                  {message.isFromMe ? (
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-tr-lg bg-[hsl(var(--tech-cyan))]/20" />
                  ) : (
                    <div className="absolute top-0 left-0 w-2 h-2 rounded-tl-lg bg-[hsl(var(--card))]" />
                  )}

                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 滚动锚点 - 用于自动滚动到底部 */}
        <div ref={messagesEndRef} />

        {/* 加密提示 */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--tech-cyan))]/10 border border-[hsl(var(--tech-cyan))]/20 rounded-lg">
            <Lock className="w-3 h-3 text-[hsl(var(--tech-cyan))]" />
            <span className="text-[10px] text-[hsl(var(--tech-cyan))]">消息已端到端加密</span>
          </div>
        </div>
      </section>

      {/* 上传菜单弹出层 */}
      <AnimatePresence>
        {showUploadMenu && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadMenu(false)}
              className="fixed inset-0 bg-black/60 z-40"
              style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}
            />

            {/* 菜单面板 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-24 left-0 right-0 z-50 px-4"
              style={{ maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="bg-[hsl(var(--card))] border border-[hsl(var(--tech-cyan))]/30 rounded-xl p-4 corner-deco overflow-hidden">
                {/* 装饰线 */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))] to-transparent" />
                <div className="absolute inset-0 hud-grid opacity-10" />

                <div className="relative">
                  {/* 标题 */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[hsl(var(--foreground))] tracking-wide">
                      上传内容
                    </h3>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowUploadMenu(false)}
                      className="w-6 h-6 flex items-center justify-center text-[hsl(var(--muted-foreground))]"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* 选项网格 */}
                  <div className="grid grid-cols-2 gap-3">
                    {uploadOptions.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUploadAction(option.id)}
                          className="relative bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-3 hover:border-[hsl(var(--tech-cyan))]/50 transition-all"
                        >
                          {/* 背景渐变 */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5 rounded-lg`} />

                          <div className="relative flex flex-col items-center gap-2">
                            {/* 图标 */}
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>

                            {/* 标签 */}
                            <span className="text-xs font-medium text-[hsl(var(--foreground))]">{option.label}</span>

                            {/* 描述 */}
                            <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-center">
                              {option.description}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 底部输入栏 */}
      <section className="border-t border-[hsl(var(--border))] bg-background/95 backdrop-blur-sm px-4 py-3 relative z-30">
        {/* 匿名提示 */}
        <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2 text-center">
          <span className="text-[hsl(var(--tech-cyan))]">⚠</span> {hints.CHAT}
        </div>

        {/* 输入框和操作按钮 */}
        <div className="flex items-end gap-2">
          {/* 附件按钮 */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                showUploadMenu
                  ? 'bg-[hsl(var(--tech-cyan))]/20 border-2 border-[hsl(var(--tech-cyan))]'
                  : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))]'
              }`}
            >
              <Plus className={`w-5 h-5 ${showUploadMenu ? 'text-[hsl(var(--tech-cyan))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
            </motion.button>

            {/* 激活指示器 */}
            <AnimatePresence>
              {showUploadMenu && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--tech-cyan))] rounded-full"
                />
              )}
            </AnimatePresence>
          </div>

          {/* 输入框 */}
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="输入加密消息..."
              rows={1}
              className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))] resize-none max-h-32"
              style={{ minHeight: '42px' }}
            />
          </div>

          {/* 表情按钮 */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] flex-shrink-0"
          >
            <Smile className="w-5 h-5" />
          </motion.button>

          {/* 发送按钮 */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))] flex items-center justify-center text-[hsl(var(--background))] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
