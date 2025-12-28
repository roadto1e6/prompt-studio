/**
 * Button 组件类型定义
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link';
  /** 按钮尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 图标 */
  icon?: React.ReactNode;
  /** 图标位置 */
  iconPosition?: 'left' | 'right';
  /** 加载状态 */
  loading?: boolean;
  /** 加载时显示的文本 */
  loadingText?: string;
  /** 成功状态 */
  success?: boolean;
  /** 成功状态持续时间（毫秒） */
  successDuration?: number;
  /** 是否为块级按钮 */
  fullWidth?: boolean;
}
