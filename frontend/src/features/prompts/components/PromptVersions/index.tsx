// 文件路径: frontend/src/features/prompts/components/PromptVersions/index.tsx

/**
 * PromptVersions 视图层
 * 仅负责声明式 UI 结构
 */

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, RotateCcw, Eye, GitCompare, Trash2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { formatRelativeTime, cn } from '@/utils';
import { Badge, Button } from '@/components/ui';
import { usePromptVersions, calculateDaysUntilExpiration, computeDiff } from './usePromptVersions';
import type { VersionModalProps } from './types';
import styles from './index.module.css';

/**
 * 版本查看模态框
 */
/** 高亮文本中的差异部分 */
const HighlightedText: React.FC<{
  text: string;
  compareText: string;
  type: 'old' | 'new';
}> = memo(({ text, compareText, type }) => {
  const diff = computeDiff(
    type === 'old' ? text : compareText,
    type === 'old' ? compareText : text
  );

  // 提取当前版本的行
  const lines = text.split('\n');

  // 找出变化的行号
  const changedLineNumbers = new Set<number>();
  let oldLineNum = 0;
  let newLineNum = 0;

  diff.forEach((d) => {
    if (d.type === 'same') {
      oldLineNum++;
      newLineNum++;
    } else if (d.type === 'removed') {
      if (type === 'old') changedLineNumbers.add(oldLineNum);
      oldLineNum++;
    } else if (d.type === 'added') {
      if (type === 'new') changedLineNumbers.add(newLineNum);
      newLineNum++;
    }
  });

  return (
    <>
      {lines.map((line, i) => {
        const isChanged = changedLineNumbers.has(i);
        return (
          <div
            key={i}
            className={cn(
              styles.diffLine,
              isChanged && (type === 'old' ? styles.diffLineRemoved : styles.diffLineAdded)
            )}
          >
            {line || '\u00A0'}
          </div>
        );
      })}
    </>
  );
});

HighlightedText.displayName = 'HighlightedText';

const VersionModal: React.FC<VersionModalProps> = memo(({
  viewingVersion,
  versions,
  currentVersionId,
  showDiff,
  copied,
  versionDiffs,
  t,
  onClose,
  onToggleDiff,
  onRestore,
  onCopy,
}) => {
  if (!viewingVersion) return null;

  const versionIndex = versions.findIndex(v => v.id === viewingVersion.id);
  const previousVersion = versionIndex < versions.length - 1 ? versions[versionIndex + 1] : null;
  const hasPreviousVersion = !!previousVersion;
  const changedFields = previousVersion ? [
    previousVersion.systemPrompt !== viewingVersion.systemPrompt ? 'System Prompt' : null,
    previousVersion.userTemplate !== viewingVersion.userTemplate ? 'User Template' : null,
    previousVersion.model !== viewingVersion.model ? 'Model' : null,
    previousVersion.temperature !== viewingVersion.temperature ? 'Temperature' : null,
    previousVersion.maxTokens !== viewingVersion.maxTokens ? 'Max Tokens' : null,
  ].filter(Boolean) : [];

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.modalOverlay}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.modalHeader}>
            <div className={styles.modalHeaderLeft}>
              <h3 className={styles.modalTitle}>
                {t.versions.modal.version.replace('{number}', viewingVersion.versionNumber)}
              </h3>
              {viewingVersion.id === currentVersionId && (
                <Badge variant="primary" size="sm">{t.versions.current}</Badge>
              )}
            </div>
            <div className={styles.modalHeaderActions}>
              {hasPreviousVersion && (
                <button
                  onClick={onToggleDiff}
                  className={cn(
                    styles.modalDiffButton,
                    showDiff ? styles.modalDiffButtonActive : styles.modalDiffButtonInactive
                  )}
                >
                  <GitCompare className={styles.modalDiffIcon} />
                  {t.versions.diff}
                </button>
              )}
              {viewingVersion.id !== currentVersionId && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRestore(viewingVersion.id, viewingVersion.versionNumber)}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  {t.versions.restore}
                </Button>
              )}
              <button onClick={onClose} className={styles.modalCloseButton}>
                <X className={styles.modalCloseIcon} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className={styles.modalBody}>
            {/* Meta Info */}
            <div className={styles.modalMeta}>
              <span className={styles.modalMetaBadge}>{viewingVersion.model}</span>
              <span className={styles.modalMetaDot} />
              <span>Temp {viewingVersion.temperature}</span>
              <span className={styles.modalMetaDot} />
              <span>{viewingVersion.maxTokens} tokens</span>
              <span className={styles.modalMetaDot} />
              <span>{formatRelativeTime(viewingVersion.createdAt)}</span>
              {versionDiffs.get(viewingVersion.id) && (
                <>
                  <span className={styles.modalMetaDot} />
                  <span>
                    <span className={styles.diffAdded}>+{versionDiffs.get(viewingVersion.id)!.added}</span>
                    {' / '}
                    <span className={styles.diffRemoved}>-{versionDiffs.get(viewingVersion.id)!.removed}</span>
                  </span>
                </>
              )}
            </div>

            {changedFields.length > 0 && (
              <div className={styles.modalChangedFields}>
                <span className={styles.modalChangedFieldsLabel}>{t.versions.changed}:</span>
                {changedFields.map(field => (
                  <span key={field} className={styles.modalChangedFieldBadge}>{field}</span>
                ))}
              </div>
            )}

            {/* Change Note */}
            {viewingVersion.changeNote && (
              <div className={styles.modalSection}>
                <label className={styles.modalSectionLabel}>{t.versions.changeNote}</label>
                <p className={styles.modalNote}>{viewingVersion.changeNote}</p>
              </div>
            )}

            {/* System Prompt - Side by Side Diff */}
            <div className={styles.modalSection}>
              <div className={styles.modalSectionHeader}>
                <label className={styles.modalSectionLabel}>{t.versions.modal.systemPrompt}</label>
                <button
                  onClick={() => onCopy(viewingVersion.systemPrompt)}
                  className={styles.modalCopyButton}
                  title={t.versions.copyToClipboard}
                >
                  {copied ? (
                    <Check className={cn(styles.modalCopyIcon, styles.diffAdded)} />
                  ) : (
                    <Copy className={styles.modalCopyIcon} />
                  )}
                </button>
              </div>

              {showDiff && previousVersion ? (
                <div className={styles.diffSideBySide}>
                  {/* Old Version */}
                  <div className={styles.diffPanel}>
                    <div className={styles.diffPanelHeader}>
                      <span className={styles.diffPanelTitle}>v{previousVersion.versionNumber}</span>
                      <span className={cn(styles.diffPanelBadge, styles.diffPanelBadgeOld)}>
                        {t.versions.oldVersion || 'OLD'}
                      </span>
                    </div>
                    <div className={styles.diffPanelContent}>
                      {previousVersion.systemPrompt ? (
                        <HighlightedText
                          text={previousVersion.systemPrompt}
                          compareText={viewingVersion.systemPrompt || ''}
                          type="old"
                        />
                      ) : (
                        <span className={styles.contentDisplayEmpty}>{t.versions.modal.noSystemPrompt}</span>
                      )}
                    </div>
                  </div>

                  {/* New Version */}
                  <div className={styles.diffPanel}>
                    <div className={styles.diffPanelHeader}>
                      <span className={styles.diffPanelTitle}>v{viewingVersion.versionNumber}</span>
                      <span className={cn(styles.diffPanelBadge, styles.diffPanelBadgeNew)}>
                        {t.versions.newVersion || 'NEW'}
                      </span>
                    </div>
                    <div className={styles.diffPanelContent}>
                      {viewingVersion.systemPrompt ? (
                        <HighlightedText
                          text={viewingVersion.systemPrompt}
                          compareText={previousVersion.systemPrompt || ''}
                          type="new"
                        />
                      ) : (
                        <span className={styles.contentDisplayEmpty}>{t.versions.modal.noSystemPrompt}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.contentDisplay}>
                  {viewingVersion.systemPrompt || (
                    <span className={styles.contentDisplayEmpty}>{t.versions.modal.noSystemPrompt}</span>
                  )}
                </div>
              )}
            </div>

            {/* User Template - Side by Side if diff mode */}
            {(viewingVersion.userTemplate || (showDiff && previousVersion?.userTemplate)) && (
              <div className={styles.modalSection}>
                <label className={styles.modalSectionLabel}>{t.versions.modal.userTemplate}</label>

                {showDiff && previousVersion ? (
                  <div className={styles.diffSideBySide}>
                    <div className={styles.diffPanel}>
                      <div className={styles.diffPanelHeader}>
                        <span className={styles.diffPanelTitle}>v{previousVersion.versionNumber}</span>
                        <span className={cn(styles.diffPanelBadge, styles.diffPanelBadgeOld)}>
                          {t.versions.oldVersion || 'OLD'}
                        </span>
                      </div>
                      <div className={styles.diffPanelContent}>
                        {previousVersion.userTemplate ? (
                          <HighlightedText
                            text={previousVersion.userTemplate}
                            compareText={viewingVersion.userTemplate || ''}
                            type="old"
                          />
                        ) : (
                          <span className={styles.contentDisplayEmpty}>—</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.diffPanel}>
                      <div className={styles.diffPanelHeader}>
                        <span className={styles.diffPanelTitle}>v{viewingVersion.versionNumber}</span>
                        <span className={cn(styles.diffPanelBadge, styles.diffPanelBadgeNew)}>
                          {t.versions.newVersion || 'NEW'}
                        </span>
                      </div>
                      <div className={styles.diffPanelContent}>
                        {viewingVersion.userTemplate ? (
                          <HighlightedText
                            text={viewingVersion.userTemplate}
                            compareText={previousVersion.userTemplate || ''}
                            type="new"
                          />
                        ) : (
                          <span className={styles.contentDisplayEmpty}>—</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.contentDisplay}>{viewingVersion.userTemplate}</div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

VersionModal.displayName = 'VersionModal';

/**
 * PromptVersions 组件
 */
const PromptVersionsComponent: React.FC = () => {
  const {
    prompt,
    activeVersions,
    deletedVersions,
    versionDiffs,
    viewingVersion,
    showDiff,
    copied,
    showDeletedVersions,
    t,
    setViewingVersion,
    setShowDiff,
    setShowDeletedVersions,
    handleRestore,
    handleDelete,
    handleRestoreDeleted,
    handlePermanentDelete,
    handleCopy,
    handleCloseModal,
    toggleDiff,
  } = usePromptVersions();

  if (!prompt) {
    return (
      <div className={styles.emptyState}>
        <p>{t.versions.selectPrompt}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>
          {t.versions.activeVersions || t.versions.title}
        </h3>
        <span className={styles.headerCount}>
          {activeVersions.length > 1
            ? t.versions.versionCountPlural.replace('{count}', String(activeVersions.length))
            : t.versions.versionCount.replace('{count}', String(activeVersions.length))}
        </span>
      </div>

      {/* Active Versions Timeline */}
      <div className={styles.timeline}>
        {activeVersions.map((version, index) => {
          const isCurrent = version.id === prompt.currentVersionId;

          return (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                styles.timelineItem,
                isCurrent && styles.timelineItemCurrent
              )}
            >
              <div className={cn(
                styles.timelineDot,
                isCurrent ? styles.timelineDotCurrent : styles.timelineDotNormal
              )} />

              <div className={cn(
                styles.versionCard,
                isCurrent ? styles.versionCardCurrent : styles.versionCardNormal
              )}>
                <div className={styles.versionHeader}>
                  <div className={styles.versionInfo}>
                    <span className={cn(
                      styles.versionNumber,
                      isCurrent ? styles.versionNumberCurrent : styles.versionNumberNormal
                    )}>
                      v{version.versionNumber}
                    </span>
                    {isCurrent && <Badge variant="primary" size="sm">{t.versions.current}</Badge>}
                  </div>
                  <span className={styles.versionTime}>
                    {t.versions.timeAgo.replace('{time}', formatRelativeTime(version.createdAt))}
                  </span>
                </div>

                <p className={styles.versionNote}>{version.changeNote}</p>

                <div className={styles.versionMeta}>
                  {versionDiffs.get(version.id) && (
                    <>
                      <span className={styles.diffAdded}>+{versionDiffs.get(version.id)!.added}</span>
                      <span className={styles.diffRemoved}>-{versionDiffs.get(version.id)!.removed}</span>
                      <span className={styles.versionMetaDivider}>|</span>
                    </>
                  )}
                  <span className={styles.versionMetaBadge}>{version.model}</span>
                  <span>{t.versions.temp.replace('{value}', String(version.temperature))}</span>
                </div>

                <div className={styles.versionActions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-[10px] px-2 py-1"
                    onClick={() => { setViewingVersion(version); setShowDiff(true); }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {t.versions.view}
                  </Button>
                  {!isCurrent && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-[10px] px-2 py-1"
                        onClick={() => handleRestore(version.id, version.versionNumber)}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        {t.versions.restore}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-[10px] px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleDelete(version.id, version.versionNumber)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        {t.versions.delete}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Deleted Versions Section */}
      {deletedVersions.length > 0 && (
        <div className={styles.deletedSection}>
          <button
            onClick={() => setShowDeletedVersions(!showDeletedVersions)}
            className={styles.deletedHeader}
          >
            <div className={styles.deletedHeaderLeft}>
              {showDeletedVersions ? (
                <ChevronUp className={styles.deletedHeaderIcon} />
              ) : (
                <ChevronDown className={styles.deletedHeaderIcon} />
              )}
              <h3 className={styles.deletedHeaderTitle}>{t.versions.deletedVersions}</h3>
              <span className={styles.deletedHeaderCount}>{deletedVersions.length}</span>
            </div>
            <span className={styles.deletedHeaderHint}>{t.versions.autoDeleteWarning}</span>
          </button>

          <AnimatePresence>
            {showDeletedVersions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={styles.timeline}
              >
                {deletedVersions.map((version, index) => {
                  const daysLeft = version.deletedAt ? calculateDaysUntilExpiration(version.deletedAt) : 0;

                  return (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={styles.timelineItem}
                    >
                      <div className={cn(styles.timelineDot, styles.timelineDotNormal)} />

                      <div className={cn(styles.versionCard, styles.versionCardNormal)}>
                        <div className={styles.versionHeader}>
                          <div className={styles.versionInfo}>
                            <span className={cn(styles.versionNumber, styles.versionNumberNormal)}>
                              v{version.versionNumber}
                            </span>
                            <Badge variant="danger" size="sm">{t.versions.deleted}</Badge>
                            {version.deletedAt && (
                              <div className={styles.expirationBadge}>
                                <Clock className={styles.expirationIcon} />
                                <span>
                                  {daysLeft === 0
                                    ? t.versions.expiresToday
                                    : t.versions.expiresIn.replace('{days}', String(daysLeft))}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={styles.versionTime}>
                            {t.versions.timeAgo.replace('{time}', formatRelativeTime(version.createdAt))}
                          </span>
                        </div>

                        <p className={styles.versionNote}>{version.changeNote}</p>

                        <div className={styles.versionMeta}>
                          <span className={styles.versionMetaBadge}>{version.model}</span>
                          <span>{t.versions.temp.replace('{value}', String(version.temperature))}</span>
                        </div>

                        <div className={styles.versionActions}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[10px] px-2 py-1"
                            onClick={() => { setViewingVersion(version); setShowDiff(false); }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {t.versions.view}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[10px] px-2 py-1"
                            onClick={() => handleRestoreDeleted(version.id, version.versionNumber)}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            {t.versions.restore}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[10px] px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handlePermanentDelete(version.id, version.versionNumber)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            {t.versions.permanentDelete}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Version Modal */}
      <VersionModal
        viewingVersion={viewingVersion}
        versions={activeVersions}
        currentVersionId={prompt.currentVersionId}
        showDiff={showDiff}
        copied={copied}
        versionDiffs={versionDiffs}
        t={t}
        onClose={handleCloseModal}
        onToggleDiff={toggleDiff}
        onRestore={handleRestore}
        onCopy={handleCopy}
      />
    </div>
  );
};

export const PromptVersions = memo(PromptVersionsComponent);
