/**
 * Settings Row Component
 * 设置行组件，用于展示单个设置项
 */

import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/utils';

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export function SettingsRow({ label, description, children, className, vertical = false }: SettingsRowProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (vertical) {
    return (
      <div className={cn('space-y-3', className)}>
        <div>
          <p className={cn('text-sm font-medium', isDark ? 'text-slate-200' : 'text-slate-700')}>{label}</p>
          {description && (
            <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-500' : 'text-slate-600')}>{description}</p>
          )}
        </div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-between gap-4 py-3', className)}>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', isDark ? 'text-slate-200' : 'text-slate-700')}>{label}</p>
        {description && (
          <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-500' : 'text-slate-600')}>{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default SettingsRow;
