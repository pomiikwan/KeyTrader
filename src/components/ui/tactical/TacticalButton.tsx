import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

/**
 * TacticalButton - 军事风格按钮组件
 *
 * 内置 Framer Motion 动画效果
 * 支持多种视觉变体和尺寸
 */

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-tactical font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-tech-primary text-background hover:bg-tech-primary/90 shadow-lg',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        finance: 'bg-finance-gold text-background hover:bg-finance-gold/90 shadow-lg',
        military: 'bg-military-olive text-background hover:bg-military-olive/90',
        ghost: 'hover:bg-muted text-foreground',
        outline: 'border border-border hover:bg-muted',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    }
  }
);

export interface TacticalButtonProps
  extends HTMLMotionProps<'button'>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

/**
 * TacticalButton 组件
 *
 * @param variant - 视觉变体（primary | secondary | finance | military | ghost | outline）
 * @param size - 尺寸（sm | md | lg | icon）
 * @param children - 按钮内容
 */
export const TacticalButton = forwardRef<HTMLButtonElement, TacticalButtonProps>(
  ({
    variant,
    size,
    className,
    children,
    whileTap,
    ...props
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={whileTap ?? { scale: 0.95 }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

TacticalButton.displayName = 'TacticalButton';
