import type { Transition } from 'framer-motion';

/**
 * 统一的动画配置
 *
 * 提供一致的动画效果，提升用户体验
 * 所有动画都使用 Framer Motion 实现
 */

// ============================================
// 页面过渡动画
// ============================================

/**
 * 统一的页面过渡动画配置
 */
export const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

// ============================================
// 基础动画配置
// ============================================

/**
 * 淡入动画配置
 *
 * 用途: 页面加载、内容显示
 */
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 },
};

/**
 * 缩放动画配置
 *
 * 用途: 弹窗、对话框
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

/**
 * 滑入动画配置
 *
 * 用途: 侧边栏、抽屉
 */
export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2 },
};

// ============================================
// 列表动画配置
// ============================================

/**
 * 列表项动画配置（带延迟）
 *
 * @param index - 列表项索引，用于计算延迟
 *
 * 用途: 列表项逐个显示
 */
export const listItemAnimation = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * 0.05, duration: 0.2 },
});

/**
 * 列表重新排序动画
 *
 * 用途: 列表项排序、过滤
 */
export const layoutAnimation = {
  layout: true,
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// ============================================
// 交互动画配置
// ============================================

/**
 * 卡片悬停效果
 *
 * 用途: 卡片悬停时的缩放效果
 */
export const cardHover = {
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  whileTap: {
    scale: 0.98
  },
};

/**
 * 按钮点击效果
 *
 * 用途: 按钮点击时的缩放效果
 */
export const buttonTap = {
  whileTap: { scale: 0.95 }
};

/**
 * 图标按钮动画
 *
 * 用途: 图标按钮的点击效果
 */
export const iconButtonTap = {
  whileTap: { scale: 0.9 },
  whileHover: { scale: 1.1 }
};

// ============================================
// 状态动画配置
// ============================================

/**
 * 脉冲动画（用于状态指示器）
 *
 * 用途: 在线状态、加载状态
 */
export const pulseAnimation = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

/**
 * 旋转动画
 *
 * 用途: 加载指示器
 */
export const spinAnimation = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  }
};

/**
 * 弹跳动画
 *
 * 用途: 通知、提示
 */
export const bounceAnimation = {
  initial: { scale: 0 },
  animate: {
    scale: [0, 1.2, 1],
    transition: {
      duration: 0.4,
      times: [0, 0.6, 1],
    }
  }
};

// ============================================
// 过渡动画配置
// ============================================

/**
 * 平滑过渡配置
 *
 * 用途: 状态切换、属性变化
 */
export const smoothTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.3,
};

/**
 * 弹性过渡配置
 *
 * 用途: 弹性效果
 */
export const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

// ============================================
// 使用示例
// ============================================

/**
 * @example 淡入动画
 * ```tsx
 * <motion.div {...fadeIn}>
 *   内容
 * </motion.div>
 * ```
 */

/**
 * @example 列表项动画
 * ```tsx
 * {items.map((item, index) => (
 *   <motion.div key={item.id} {...listItemAnimation(index)}>
 *     {item.content}
 *   </motion.div>
 * ))}
 * ```
 */

/**
 * @example 卡片悬停
 * ```tsx
 * <motion.div {...cardHover}>
 *   卡片内容
 * </motion.div>
 * ```
 */
