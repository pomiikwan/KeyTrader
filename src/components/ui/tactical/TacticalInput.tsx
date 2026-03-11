import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * TacticalInput - 军事风格输入框组件
 *
 * 支持标签、错误提示和图标
 * 焦点状态科技青高亮
 */

export interface TacticalInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
}

/**
 * TacticalInput 组件
 *
 * @param label - 输入框标签
 * @param error - 错误提示信息
 * @param leftIcon - 左侧图标
 * @param rightIcon - 右侧图标
 */
export const TacticalInput = forwardRef<HTMLInputElement, TacticalInputProps>(
  ({
    className,
    label,
    error,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    ...props
  }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-foreground/80">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2.5 bg-card border-border rounded-tactical',
              'text-foreground text-sm placeholder:text-muted-foreground',
              'focus:border-tech-cyan/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan/20',
              'transition-colors',
              LeftIcon && 'pl-10',
              RightIcon && 'pr-10',
              error && 'border-alert-red/50 focus:border-alert-red focus:ring-alert-red/20',
              className
            )}
            {...props}
          />
          {RightIcon && (
            <RightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-alert-red"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

TacticalInput.displayName = 'TacticalInput';
