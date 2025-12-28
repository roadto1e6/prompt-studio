/**
 * Badge 组件 - 视图层
 * 徽章/标签组件
 */

import React, { memo } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils';
import { useBadge } from './useBadge';
import type { BadgeProps } from './types';
import styles from './index.module.css';

// ============ 内联子组件 ============

// 移除按钮
const RemoveButton: React.FC<{
  onRemove?: () => void;
  iconClass: string;
}> = ({ onRemove, iconClass }) => (
  <button
    onClick={onRemove}
    className={styles.removeButton}
    aria-label="Remove badge"
    type="button"
  >
    <X className={styles[iconClass]} />
  </button>
);

// ============ Badge 主组件 ============

export const Badge = memo<BadgeProps>(({
  children,
  variant = 'default',
  size = 'sm',
  removable = false,
  onRemove,
  onClick,
  icon,
  dot = false,
  className,
}) => {
  const { variantClasses, sizeClasses, isClickable, removeIconClass } = useBadge({
    variant,
    size,
    onClick,
  });

  const BadgeElement = isClickable ? 'button' : 'span';

  return (
    <BadgeElement
      onClick={onClick}
      className={cn(
        styles.badge,
        variantClasses,
        sizeClasses,
        isClickable && styles.badgeClickable,
        className
      )}
      type={isClickable ? 'button' : undefined}
    >
      {dot && <span className={styles.dot} />}
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      {children}
      {removable && <RemoveButton onRemove={onRemove} iconClass={removeIconClass} />}
    </BadgeElement>
  );
});

Badge.displayName = 'Badge';

// 导出
export type { BadgeProps } from './types';
export default Badge;
