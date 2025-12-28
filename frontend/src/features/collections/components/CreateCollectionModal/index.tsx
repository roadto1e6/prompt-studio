// 文件路径: frontend/src/features/collections/components/CreateCollectionModal/index.tsx

/**
 * CreateCollectionModal 视图层
 * 纯声明式 UI，零业务逻辑
 */

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useUIStore, useI18nStore } from '@/stores';
import { Modal, Input, Button } from '@/components/ui';
import { ColorPicker } from '../ColorPicker';
import { useCreateCollectionModal } from './useCreateCollectionModal';
import type { CreateCollectionModalProps } from './types';
import styles from './index.module.css';

/**
 * CreateCollectionModal - 创建集合弹窗
 */
export const CreateCollectionModal = React.memo<CreateCollectionModalProps>(() => {
  const { modals } = useUIStore();
  const { t } = useI18nStore();
  const modal = useCreateCollectionModal();

  const isFormDisabled = modal.isSubmitting;

  return (
    <Modal
      isOpen={modals.createCollection}
      onClose={modal.handleClose}
      title={t.createCollection?.title || 'Create Collection'}
      size="md"
    >
      <form onSubmit={modal.handleSubmit} className={styles.formContainer}>
        {/* 错误提示 */}
        {modal.errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <AlertCircle className={styles.errorAlertIcon} aria-hidden="true" />
            <p className={styles.errorAlertMessage}>{modal.errorMessage}</p>
          </div>
        )}

        {/* 名称输入 */}
        <div className={styles.formSection}>
          <label htmlFor="collection-name" className={styles.formSectionLabel}>
            {t.createCollection?.nameLabel || 'Name'}
          </label>
          <Input
            id="collection-name"
            value={modal.values.name}
            onChange={(e) => modal.handleNameChange(e.target.value)}
            placeholder={t.createCollection?.namePlaceholder || 'Enter collection name...'}
            error={modal.errors.name}
            autoFocus
            disabled={isFormDisabled}
            maxLength={100}
          />
          {modal.errors.name && (
            <p className={styles.errorText} role="alert">
              {modal.errors.name}
            </p>
          )}
        </div>

        {/* 描述输入 */}
        <div className={styles.formSection}>
          <label htmlFor="collection-description" className={styles.formSectionLabel}>
            {t.createCollection?.descriptionLabel || 'Description (Optional)'}
          </label>
          <Input
            id="collection-description"
            value={modal.values.description}
            onChange={(e) => modal.handleDescriptionChange(e.target.value)}
            placeholder={t.createCollection?.descriptionPlaceholder || 'Brief description...'}
            error={modal.errors.description}
            disabled={isFormDisabled}
            maxLength={500}
          />
          {modal.errors.description && (
            <p className={styles.errorText} role="alert">
              {modal.errors.description}
            </p>
          )}
        </div>

        {/* 颜色选择器 */}
        <div className={styles.formSection}>
          <ColorPicker
            label={t.createCollection?.colorLabel || 'Color'}
            value={modal.values.color}
            onChange={modal.handleColorChange}
            disabled={isFormDisabled}
            showCheckIcon={true}
            size="md"
          />
        </div>

        {/* 操作按钮 */}
        <div className={styles.actionsContainer}>
          <Button
            type="button"
            variant="ghost"
            onClick={modal.handleClose}
            disabled={isFormDisabled}
          >
            {t.common?.cancel || 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isFormDisabled}
          >
            {modal.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                <span>{t.createCollection?.creating || 'Creating...'}</span>
              </>
            ) : (
              t.createCollection?.createButton || 'Create Collection'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
});

CreateCollectionModal.displayName = 'CreateCollectionModal';
