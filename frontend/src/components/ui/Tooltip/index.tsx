/**
 * Tooltip 组件 - 视图层
 * 悬停提示
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/utils';
import { useTooltip } from './useTooltip';
import type { TooltipProps, SimpleTooltipProps } from './types';
import styles from './index.module.css';

/** 动画配置 */
const animationVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/**
 * Tooltip 组件
 */
const TooltipComponent: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  disabled = false,
  variant = 'default',
  className,
  offset = 8,
}) => {
  const { triggerRef, isVisible, handleMouseEnter, handleMouseLeave, getTooltipStyle, variantClasses } = useTooltip({
    placement,
    offset,
    delay,
    disabled,
    variant,
  });

  // 克隆子元素并添加事件监听器
  const trigger = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      // 保留原有的 ref
      const { ref } = children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave();
      children.props.onMouseLeave?.(e);
    },
  });

  return (
    <>
      {trigger}
      {createPortal(
        <AnimatePresence>
          {isVisible && !disabled && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ duration: 0.15 }}
              style={getTooltipStyle()}
              className={cn(styles.tooltip, variantClasses, className)}
              role="tooltip"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

TooltipComponent.displayName = 'Tooltip';

export const Tooltip = memo(TooltipComponent);

/**
 * 简化版 Tooltip
 */
const SimpleTooltipComponent: React.FC<SimpleTooltipProps> = ({
  title,
  children,
  placement = 'top',
  variant = 'default',
}) => (
  <Tooltip content={title} placement={placement} variant={variant}>
    {children}
  </Tooltip>
);

SimpleTooltipComponent.displayName = 'SimpleTooltip';

export const SimpleTooltip = memo(SimpleTooltipComponent);

// 导出
export type { TooltipProps, SimpleTooltipProps, TooltipPlacement } from './types';
export default Tooltip;
