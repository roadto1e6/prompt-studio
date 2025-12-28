/**
 * Animation Utilities
 * 动画工具函数和配置
 */

import { Variants } from 'framer-motion';

/**
 * 淡入动画
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * 从下方滑入
 */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * 从上方滑入
 */
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * 从左侧滑入
 */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/**
 * 从右侧滑入
 */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * 缩放动画
 */
export const scale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/**
 * 旋转淡入
 */
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 10 },
};

/**
 * 弹簧缩放（类似 Material Design）
 */
export const springScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  exit: { opacity: 0, scale: 0.8 },
};

/**
 * 列表项交错动画
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

/**
 * 卡片悬停效果
 */
export const cardHover = {
  hover: {
    y: -4,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * 按钮点击效果
 */
export const buttonTap = {
  tap: {
    scale: 0.95,
  },
};

/**
 * 渐变背景动画
 */
export const gradientAnimation = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * 脉冲动画
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * 摇晃动画（用于错误提示）
 */
export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * 通用过渡配置
 */
export const transitions = {
  // 快速过渡
  fast: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
  },
  // 标准过渡
  normal: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
  // 慢速过渡
  slow: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
  // 弹簧过渡
  spring: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
  // 柔和弹簧
  softSpring: {
    type: 'spring',
    stiffness: 120,
    damping: 14,
  },
};

/**
 * 缓动函数
 */
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
};
