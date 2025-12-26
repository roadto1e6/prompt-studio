/**
 * Settings Row Component
 * 设置行组件，用于展示单个设置项
 */

import { cn } from '@/utils';

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export function SettingsRow({ label, description, children, className, vertical = false }: SettingsRowProps) {

  if (vertical) {
    return (
      <div className={cn('space-y-3', className)}>
        <div>
          <p className="text-sm font-medium text-theme-text-primary">{label}</p>
          {description && (
            <p className="text-xs mt-0.5 text-theme-text-secondary">{description}</p>
          )}
        </div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-between gap-4 py-3', className)}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-theme-text-primary">{label}</p>
        {description && (
          <p className="text-xs mt-0.5 text-theme-text-secondary">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default SettingsRow;
