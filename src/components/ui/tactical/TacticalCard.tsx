import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

/**
 * TacticalCard - 军事风格卡片组件
 *
 * 支持多种视觉变体和特效的统一卡片组件
 * 完全兼容现有设计，消除硬编码颜色值
 */

const cardVariants = cva(
  // 基础样式
  'relative overflow-hidden corner-deco transition-all duration-200',
  {
    variants: {
      variant: {
        tactical: 'bg-tactical-card border-border',
        tech: 'bg-gradient-to-br from-gradient-tech-start to-gradient-tech-end border-tech-cyan/30',
        finance: 'bg-gradient-to-br from-gradient-finance-start to-gradient-finance-end border-finance-gold/30',
        military: 'bg-gradient-to-br from-[hsl(80,50%,25%)] to-[hsl(150,60%,20%)] border-military-olive/30',
        stealth: 'bg-gradient-to-br from-[hsl(150,20%,5%)] to-[hsl(150,20%,4%)] border-border/50',
      },
      size: {
        sm: 'p-3 rounded-lg',
        md: 'p-4 rounded-xl',
        lg: 'p-5 rounded-2xl',
        xl: 'p-6 rounded-3xl',
      },
      interactive: {
        true: 'cursor-pointer hover:border-tech-cyan/50 hover:shadow-lg',
        false: '',
      },
      effect: {
        none: '',
        glow: 'tech-glow',
        pulse: 'radar-pulse',
      },
    },
    defaultVariants: {
      variant: 'tactical',
      size: 'md',
      interactive: false,
      effect: 'none',
    }
  }
);

export interface TacticalCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  hudGrid?: boolean;
  topScanline?: boolean;
}

/**
 * TacticalCard 组件
 *
 * @param variant - 视觉变体（tactical | tech | finance | military | stealth）
 * @param size - 尺寸（sm | md | lg | xl）
 * @param interactive - 是否可交互（添加悬停效果）
 * @param effect - 特效（none | glow | pulse）
 * @param hudGrid - 是否显示 HUD 网格背景（默认 true）
 * @param topScanline - 是否显示顶部扫描线（默认 true）
 */
export const TacticalCard = forwardRef<HTMLDivElement, TacticalCardProps>(
  ({
    variant,
    size,
    interactive,
    effect,
    hudGrid = true,
    topScanline = true,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, interactive, effect }),
          className
        )}
        {...props}
      >
        {/* HUD 网格背景 */}
        {hudGrid && (
          <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
        )}

        {/* 顶部扫描线 */}
        {topScanline && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tech-cyan/50 to-transparent" />
        )}

        {children}
      </div>
    );
  }
);

TacticalCard.displayName = 'TacticalCard';
