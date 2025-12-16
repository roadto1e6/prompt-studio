/**
 * Settings Section Component
 * 设置区块卡片组件
 */

import { useThemeStore } from '@/stores/themeStore';
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
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden',
        isDark ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-slate-200',
        className
      )}
    >
      {(title || description || action) && (
        <div
          className={cn(
            'flex items-center justify-between px-5 py-4 border-b',
            isDark ? 'border-slate-800/50' : 'border-slate-200'
          )}
        >
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900')}>
                {title}
              </h3>
            )}
            {description && (
              <p className={cn('text-xs mt-1', isDark ? 'text-slate-500' : 'text-slate-600')}>
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
