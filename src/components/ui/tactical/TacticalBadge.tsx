import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

/**
 * TacticalBadge - 军事风格徽章组件
 *
 * 用于标签、状态显示和分类
 * 支持图标和多种语义化颜色
 */

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold tracking-wider border transition-colors',
  {
    variants: {
      variant: {
        tech: 'bg-tech-primary/10 text-tech-cyan border-tech-cyan/30',
        finance: 'bg-finance-gold/10 text-finance-gold border-finance-gold/30',
        military: 'bg-military-olive/20 text-military-olive border-military-olive/30',
        success: 'bg-green-500/10 text-green-400 border-green-500/30',
        warning: 'bg-finance-gold/10 text-finance-gold border-finance-gold/30',
        danger: 'bg-alert-red/10 text-alert-red border-alert-red/30',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'tech',
      size: 'sm',
    }
  }
);

export interface TacticalBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * TacticalBadge 组件
 *
 * @param variant - 视觉变体（tech | finance | military | success | warning | danger）
 * @param size - 尺寸（sm | md | lg）
 * @param icon - 可选图标组件
 * @param children - 徽章内容
 */
export const TacticalBadge = forwardRef<HTMLDivElement, TacticalBadgeProps>(
  ({
    variant,
    size,
    className,
    icon: Icon,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {Icon && <Icon className="w-3 h-3" />}
        {children}
      </div>
    );
  }
);

TacticalBadge.displayName = 'TacticalBadge';
