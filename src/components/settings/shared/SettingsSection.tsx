/**
 * Settings Section Component
 * 设置区块卡片组件
 */

import { cn } from '@/utils';

interface SettingsSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
  action,
  noPadding = false,
}: SettingsSectionProps) {

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden bg-theme-card-bg border-theme-card-border',
        className
      )}
    >
      {(title || description || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-theme-text-primary">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs mt-1 text-theme-text-secondary">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0 ml-4">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}

export default SettingsSection;
