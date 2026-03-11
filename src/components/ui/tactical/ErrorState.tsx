import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorState - 统一的错误状态组件
 *
 * 军事科技风格的错误显示
 */

export function ErrorState({
  title = '操作失败',
  message,
  onRetry
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="w-20 h-20 bg-alert-red/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-alert-red/30">
        <AlertCircle className="w-10 h-10 text-alert-red" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      {onRetry && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-2 bg-tech-primary text-background rounded-lg font-medium text-sm"
        >
          重试
        </motion.button>
      )}
    </motion.div>
  );
}
