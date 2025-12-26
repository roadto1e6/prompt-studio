import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-theme-text-secondary py-20">
      {icon || <FolderOpen className="w-16 h-16 mb-4 text-theme-text-muted" />}
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
      {action && (
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
