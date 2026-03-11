import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Plus, X } from 'lucide-react';
import { TacticalBadge } from '@/components/ui/tactical';
import { DealType } from '@/types';
import { useProjectsStore, useAuthStore } from '@/store';

/**
 * 创建对接页面 - 移动端军事科技风格
 */
export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addProject } = useProjectsStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 步骤1: 选择对接类型
  const [selectedType, setSelectedType] = useState<DealType | null>(null);

  // 步骤2: 基本信息
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    location: '',
  });

  // 步骤3: 详细信息
  const [detailInfo, setDetailInfo] = useState({
    tags: [] as string[],
    newTag: '',
    // 项目相关
    industry: '',
    stage: '',
    use_of_funds: '',
    timeline: '',
    // 资金相关
    investment_stage: '',
    investment_areas: '',
    singleInvestment_range: '',
    // 贸易相关
    trade_category: '',
    trade_type: '',
    commodity_type: '',
  });

  // 对接类型配置
  const typeConfig = {
    [DealType.PROJECT]: {
      label: 'PROJECT',
      description: '我是项目方，寻求资金或合作',
      icon: '▶',
      color: 'text-[hsl(var(--tech-cyan))]',
      bg: 'bg-[hsl(var(--tech-cyan))]/10',
      border: 'border-[hsl(var(--tech-cyan))]/30',
      gradient: 'from-[hsl(var(--tech-cyan))]/30 to-[hsl(var(--hud-blue))]/30',
    },
    [DealType.CAPITAL]: {
      label: 'CAPITAL',
      description: '我是资金方，寻找优质项目',
      icon: '▶',
      color: 'text-[hsl(var(--finance-gold))]',
      bg: 'bg-[hsl(var(--finance-gold))]/10',
      border: 'border-[hsl(var(--finance-gold))]/30',
      gradient: 'from-[hsl(var(--finance-gold))]/30 to-[hsl(var(--tech-cyan))]/30',
    },
    [DealType.TRADE]: {
      label: 'TRADE',
      description: '我是贸易方，寻求贸易机会',
      icon: '▶',
      color: 'text-[hsl(var(--military-olive))]',
      bg: 'bg-[hsl(var(--military-olive))]/10',
      border: 'border-[hsl(var(--military-olive))]/30',
      gradient: 'from-[hsl(var(--military-olive))]/30 to-[hsl(var(--tactical-green))]/30',
    },
  };

  const handleTypeSelect = (type: DealType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBasicInfoChange = (field: string, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleDetailInfoChange = (field: string, value: string) => {
    setDetailInfo((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  // 添加标签
  const handleAddTag = () => {
    const tag = detailInfo.newTag.trim();
    if (tag && !detailInfo.tags.includes(tag)) {
      if (detailInfo.tags.length >= 5) {
        setError('最多只能添加5个标签');
        return;
      }
      setDetailInfo((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        newTag: '',
      }));
      setError('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setDetailInfo((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // 验证步骤2（基本信息）
  const validateBasicInfo = (): boolean => {
    if (!basicInfo.title.trim()) {
      setError('请输入对接标题');
      return false;
    }
    if (basicInfo.title.length > 100) {
      setError('标题不能超过100个字符');
      return false;
    }
    if (!basicInfo.description.trim()) {
      setError('请输入详细描述');
      return false;
    }
    if (basicInfo.description.length > 2000) {
      setError('描述不能超过2000个字符');
      return false;
    }
    if (!basicInfo.budget_min || !basicInfo.budget_max) {
      setError('请输入预算范围');
      return false;
    }
    const min = parseInt(basicInfo.budget_min);
    const max = parseInt(basicInfo.budget_max);
    if (min >= max) {
      setError('最小预算必须小于最大预算');
      return false;
    }
    if (!basicInfo.location.trim()) {
      setError('请输入所在地区');
      return false;
    }
    return true;
  };

  // 验证步骤3（详细信息）
  const validateDetailInfo = (): boolean => {
    if (detailInfo.tags.length === 0) {
      setError('请至少添加一个标签');
      return false;
    }

    // 根据类型验证特定字段
    if (selectedType === DealType.PROJECT) {
      if (!detailInfo.industry || !detailInfo.stage) {
        setError('请填写项目行业和融资阶段');
        return false;
      }
    } else if (selectedType === DealType.CAPITAL) {
      if (!detailInfo.investment_stage || !detailInfo.investment_areas) {
        setError('请填写投资阶段和投资领域');
        return false;
      }
    } else if (selectedType === DealType.TRADE) {
      if (!detailInfo.trade_category || !detailInfo.trade_type) {
        setError('请填写贸易类别和贸易类型');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateBasicInfo() || !validateDetailInfo()) {
      return;
    }

    if (!user) {
      setError('请先登录');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 模拟创建过程
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 创建项目对象
      const projectData = {
        user_id: user.id,
        type: selectedType!,
        title: basicInfo.title,
        description: basicInfo.description,
        budget_min: parseInt(basicInfo.budget_min),
        budget_max: parseInt(basicInfo.budget_max),
        location: basicInfo.location,
        tags: detailInfo.tags,
        // 根据类型添加特定字段
        ...(selectedType === DealType.PROJECT && {
          industry: detailInfo.industry,
          stage: detailInfo.stage,
          use_of_funds: detailInfo.use_of_funds,
          timeline: detailInfo.timeline,
        }),
        ...(selectedType === DealType.CAPITAL && {
          investment_stage: detailInfo.investment_stage,
          investment_areas: detailInfo.investment_areas,
          singleInvestment_range: detailInfo.singleInvestment_range,
        }),
        ...(selectedType === DealType.TRADE && {
          trade_category: detailInfo.trade_category,
          trade_type: detailInfo.trade_type,
          commodity_type: detailInfo.commodity_type,
        }),
        isFeatured: false,
        isUrgent: false,
      };

      // 保存到 Store
      addProject(projectData);

      // 创建成功，跳转到"我的对接"标签页
      navigate('/projects?tab=my-projects');
    } catch (err: any) {
      setError(err.response?.data?.error || '创建失败，请稍后重试');
    } finally {
      setLoading(false);
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
            onClick={() => navigate('/projects')}
            className="w-8 h-8 flex items-center justify-center text-[hsl(var(--tech-cyan))]"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">创建对接</h1>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
              step >= 1 ? 'bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))]' : 'bg-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}>
              1
            </div>
            <ChevronRight className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
              step >= 2 ? 'bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))]' : 'bg-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}>
              2
            </div>
            <ChevronRight className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
              step >= 3 ? 'bg-[hsl(var(--tech-cyan))] text-[hsl(var(--background))]' : 'bg-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
            }`}>
              3
            </div>
          </div>
        </motion.div>

        {/* 当前步骤标题 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`step-title-${step}`}
          className="text-xs text-[hsl(var(--muted-foreground))] tracking-wider"
        >
          {step === 1 && '步骤 1/3: 选择对接类型'}
          {step === 2 && '步骤 2/3: 基本信息'}
          {step === 3 && '步骤 3/3: 详细信息'}
        </motion.div>
      </section>

      {/* 主内容区域 */}
      <section className="px-4">
        <AnimatePresence mode="wait">
          {/* 步骤1: 选择对接类型 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                请选择您要创建的对接类型
              </p>

              {Object.entries(typeConfig).map(([key, config], index) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect(key as DealType)}
                  className={`w-full relative bg-gradient-to-br ${config.gradient} rounded-xl p-4 border ${
                    selectedType === key ? config.border : 'border-[hsl(var(--border))]'
                  } overflow-hidden text-left transition-all`}
                >
                  <div className="absolute inset-0 hud-grid opacity-20" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--tech-cyan))]/30 to-transparent" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`text-2xl mb-2 ${config.color}`}>
                          {config.icon}
                        </div>
                        <div className={`text-base font-bold mb-1 ${config.color}`}>
                          {config.label}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">
                          {config.description}
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${config.color} mt-2`} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* 步骤2: 基本信息 */}
          {step === 2 && selectedType && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* 对接类型标签 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1">对接类型</div>
                    <TacticalBadge variant="info" className={`${typeConfig[selectedType].color} text-xs`}>
                      {typeConfig[selectedType].label}
                    </TacticalBadge>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setStep(1)}
                    className="text-xs text-[hsl(var(--muted-foreground))]"
                  >
                    修改
                  </motion.button>
                </div>
              </div>

              {/* 基本信息表单 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative space-y-4">
                  {/* 错误提示 */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[hsl(var(--alert-red))]/10 border border-[hsl(var(--alert-red))]/30 rounded-lg p-3"
                    >
                      <p className="text-xs text-[hsl(var(--alert-red))] flex items-center gap-2">
                        <span>⚠</span>
                        <span>{error}</span>
                      </p>
                    </motion.div>
                  )}

                  {/* 标题 */}
                  <div>
                    <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                      对接标题 <span className="text-[hsl(var(--alert-red))]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="请输入对接标题（1-100个字符）"
                      value={basicInfo.title}
                      onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                      maxLength={100}
                      className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                    />
                    <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 text-right">
                      {basicInfo.title.length}/100
                    </div>
                  </div>

                  {/* 详细描述 */}
                  <div>
                    <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                      详细描述 <span className="text-[hsl(var(--alert-red))]">*</span>
                    </label>
                    <textarea
                      placeholder="请详细描述您的对接需求..."
                      value={basicInfo.description}
                      onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                      maxLength={2000}
                      rows={6}
                      className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))] resize-none"
                    />
                    <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 text-right">
                      {basicInfo.description.length}/2000
                    </div>
                  </div>

                  {/* 预算范围 */}
                  <div>
                    <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                      预算范围（元）<span className="text-[hsl(var(--alert-red))]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="最小预算"
                        value={basicInfo.budget_min}
                        onChange={(e) => handleBasicInfoChange('budget_min', e.target.value)}
                        min="0"
                        className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                      />
                      <input
                        type="number"
                        placeholder="最大预算"
                        value={basicInfo.budget_max}
                        onChange={(e) => handleBasicInfoChange('budget_max', e.target.value)}
                        min="0"
                        className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                      />
                    </div>
                  </div>

                  {/* 所在地区 */}
                  <div>
                    <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                      所在地区 <span className="text-[hsl(var(--alert-red))]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="例如：北京市海淀区"
                      value={basicInfo.location}
                      onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                      className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 步骤3: 详细信息 */}
          {step === 3 && selectedType && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* 标签 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative">
                  <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                    标签 <span className="text-[hsl(var(--alert-red))]">*</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="输入标签后按回车或点击添加"
                      value={detailInfo.newTag}
                      onChange={(e) => handleDetailInfoChange('newTag', e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1 bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddTag}
                      className="px-4 bg-[hsl(var(--tech-cyan))]/20 border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-[hsl(var(--tech-cyan))] flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detailInfo.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] border border-[hsl(var(--tech-cyan))]/20 flex items-center gap-1 cursor-pointer"
                      >
                        {tag}
                        <X className="w-3 h-3" />
                      </motion.span>
                    ))}
                  </div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2">
                    已添加 {detailInfo.tags.length}/5 个标签（点击标签可删除）
                  </div>
                </div>
              </div>

              {/* 根据类型显示不同字段 */}
              <div className="relative bg-[hsl(var(--card))] rounded-xl p-4 border border-[hsl(var(--border))] corner-deco overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-20" />

                <div className="relative space-y-4">
                  {/* 错误提示 */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[hsl(var(--alert-red))]/10 border border-[hsl(var(--alert-red))]/30 rounded-lg p-3"
                    >
                      <p className="text-xs text-[hsl(var(--alert-red))] flex items-center gap-2">
                        <span>⚠</span>
                        <span>{error}</span>
                      </p>
                    </motion.div>
                  )}

                  {selectedType === DealType.PROJECT && (
                    <>
                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          行业领域 <span className="text-[hsl(var(--alert-red))]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="例如：新能源、人工智能、生物医药"
                          value={detailInfo.industry}
                          onChange={(e) => handleDetailInfoChange('industry', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          融资阶段 <span className="text-[hsl(var(--alert-red))]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="例如：天使轮、A轮、B轮"
                          value={detailInfo.stage}
                          onChange={(e) => handleDetailInfoChange('stage', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          资金用途
                        </label>
                        <input
                          type="text"
                          placeholder="例如：研发70% + 产线30%"
                          value={detailInfo.use_of_funds}
                          onChange={(e) => handleDetailInfoChange('use_of_funds', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          时间要求
                        </label>
                        <input
                          type="text"
                          placeholder="例如：2026年内完成"
                          value={detailInfo.timeline}
                          onChange={(e) => handleDetailInfoChange('timeline', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>
                    </>
                  )}

                  {selectedType === DealType.CAPITAL && (
                    <>
                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          投资阶段 <span className="text-[hsl(var(--alert-red))]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="例如：天使轮、A轮、B轮、Pre-IPO"
                          value={detailInfo.investment_stage}
                          onChange={(e) => handleDetailInfoChange('investment_stage', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          投资领域 <span className="text-[hsl(var(--alert-red))]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="例如：新能源、人工智能、半导体"
                          value={detailInfo.investment_areas}
                          onChange={(e) => handleDetailInfoChange('investment_areas', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          单笔投资范围
                        </label>
                        <input
                          type="text"
                          placeholder="例如：500-5000万元"
                          value={detailInfo.singleInvestment_range}
                          onChange={(e) => handleDetailInfoChange('singleInvestment_range', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>
                    </>
                  )}

                  {selectedType === DealType.TRADE && (
                    <>
                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          贸易类别 <span className="text-[hsl(var(--alert-red))]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="例如：设备、原材料、消费品"
                          value={detailInfo.trade_category}
                          onChange={(e) => handleDetailInfoChange('trade_category', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          贸易类型 <span className="text-[hsl(var(--alert-red))]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="例如：进口、出口、代理进口"
                          value={detailInfo.trade_type}
                          onChange={(e) => handleDetailInfoChange('trade_type', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[hsl(var(--tech-cyan))]/80 mb-2">
                          商品类型
                        </label>
                        <input
                          type="text"
                          placeholder="例如：半导体设备、精密仪器"
                          value={detailInfo.commodity_type}
                          onChange={(e) => handleDetailInfoChange('commodity_type', e.target.value)}
                          className="w-full bg-[hsl(var(--background))]/80 border border-[hsl(var(--border))] rounded-lg px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--tech-cyan))]"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
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
        {step === 1 && (
          <div className="text-xs text-[hsl(var(--muted-foreground))] text-center">
            选择对接类型后自动进入下一步
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
              className="py-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] font-semibold"
            >
              上一步
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (validateBasicInfo()) {
                  setStep(3);
                } else {
                  setError('请填写所有必填项');
                }
              }}
              className="py-3 bg-[hsl(var(--tech-cyan))] border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-sm text-[hsl(var(--background))] font-semibold"
            >
              下一步
            </motion.button>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(2)}
              disabled={loading}
              className="py-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] font-semibold disabled:opacity-50"
            >
              上一步
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className="py-3 bg-gradient-to-r from-[hsl(var(--tech-cyan))] to-[hsl(var(--hud-blue))] border border-[hsl(var(--tech-cyan))]/30 rounded-lg text-sm text-[hsl(var(--background))] font-semibold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⚙</span>
                  <span>创建中...</span>
                </span>
              ) : (
                '创建对接'
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
