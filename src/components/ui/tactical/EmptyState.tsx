import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * EmptyState - 统一的空状态组件
 *
 * 军事科技风格的空状态显示
 */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 bg-card rounded-xl flex items-center justify-center mx-auto mb-4 border border-border corner-deco">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </motion.div>
  );
}
