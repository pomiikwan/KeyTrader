import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * LoadingState - 统一的加载状态组件
 *
 * 军事科技风格的加载动画
 */

export function LoadingState({ message = '加载中...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="mb-4"
      >
        <Loader2 className="w-12 h-12 text-tech-cyan" />
      </motion.div>
      <p className="text-sm text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
        LOADING_DATA...
      </p>
    </div>
  );
}
