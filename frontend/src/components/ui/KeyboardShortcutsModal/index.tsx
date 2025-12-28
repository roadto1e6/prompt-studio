// 文件路径: frontend/src/components/ui/KeyboardShortcutsModal/index.tsx

/**
 * KeyboardShortcutsModal 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { Command } from 'lucide-react';
import { Modal } from '../Modal';
import { useI18nStore } from '@/stores';
import { useKeyboardShortcutsModal } from './useKeyboardShortcutsModal';
import type { KeyboardShortcutsModalProps } from './types';
import styles from './index.module.css';

/**
 * KeyboardShortcutsModal - 快捷键帮助面板
 *
 * @description
 * 采用 Headless UI 模式的生产级组件。
 * 显示应用中所有可用的键盘快捷键，并根据操作系统自动调整显示。
 *
 * @architecture
 * - 契约层：types.ts（类型定义）
 * - 表现层：index.module.css（样式封装）
 * - 逻辑层：useKeyboardShortcutsModal.ts（Headless Hook）
 * - 视图层：index.tsx（本文件）
 *
 * @performance
 * - 使用 React.memo 防止不必要的重渲染
 * - 快捷键数据在 Hook 中缓存，避免重复计算
 * - 格式化方法在 Hook 中定义，确保引用稳定
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * return (
 *   <KeyboardShortcutsModal
 *     isOpen={isOpen}
 *     onClose={() => setIsOpen(false)}
 *   />
 * );
 * ```
 */
export const KeyboardShortcutsModal = React.memo<KeyboardShortcutsModalProps>(
  ({ isOpen, onClose, className }) => {
    // ==================== Hook 状态和方法 ====================
    const { groupedShortcuts, isMac, formatKeys } = useKeyboardShortcutsModal();
    const { t } = useI18nStore();

    // ==================== 视图渲染 ====================

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t.keyboard?.title || '键盘快捷键'}
        size="lg"
        className={className}
      >
        <div className={styles.container}>
          {/* ==================== 快捷键分类列表 ==================== */}
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <section key={category} className={styles.categorySection}>
              {/* 分类标题 */}
              <h3 className={styles.categoryTitle}>{category}</h3>

              {/* 该分类下的快捷键列表 */}
              <div className={styles.shortcutList}>
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className={styles.shortcutItem}
                    role="row"
                  >
                    {/* 快捷键描述 */}
                    <span className={styles.shortcutDescription}>
                      {shortcut.description}
                    </span>

                    {/* 快捷键组合 */}
                    <div className={styles.shortcutKeys} role="cell">
                      {formatKeys(shortcut.keys).map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {/* 单个按键 */}
                          <kbd
                            className={styles.key}
                            aria-label={t.keyboard?.keyLabel?.replace('{key}', key) || `Key: ${key}`}
                          >
                            {key}
                          </kbd>

                          {/* 按键分隔符（+ 号） */}
                          {keyIndex < formatKeys(shortcut.keys).length - 1 && (
                            <span className={styles.keySeparator} aria-hidden="true">
                              +
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* ==================== 底部平台提示 ==================== */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Command className={styles.footerIcon} aria-hidden="true" />
              <p className={styles.footerText}>
                {isMac
                  ? (t.keyboard?.macTip || '提示：使用 ⌘ Command 键执行快捷操作')
                  : (t.keyboard?.otherTip || '提示：在 macOS 上使用 ⌘ Command 键，在 Windows/Linux 上使用 Ctrl 键')}
              </p>
            </div>
          </footer>
        </div>
      </Modal>
    );
  }
);

KeyboardShortcutsModal.displayName = 'KeyboardShortcutsModal';
