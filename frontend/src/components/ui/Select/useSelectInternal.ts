// 文件路径: frontend/src/components/ui/Select/useSelectInternal.ts

/**
 * Select 内部工具 Hooks
 * 提供细粒度的位置计算和键盘导航功能
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  SelectPosition,
  UseSelectPositionOptions,
  UseSelectKeyboardOptions,
} from './types';

/**
 * Select 位置计算 Hook
 */
export function useSelectPosition(options: UseSelectPositionOptions) {
  const {
    triggerRef,
    isOpen,
    maxHeight = 320,
    closeOnScroll = true,
    onScrollClose,
  } = options;

  const [position, setPosition] = useState<SelectPosition>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
    flipUp: false,
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !isOpen) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldFlipUp = spaceBelow < 200 && spaceAbove > spaceBelow;

    const calculatedMaxHeight = shouldFlipUp
      ? Math.min(spaceAbove - 20, maxHeight)
      : Math.min(spaceBelow - 20, maxHeight);

    const top = shouldFlipUp
      ? rect.top + scrollY - calculatedMaxHeight - 4
      : rect.bottom + scrollY + 4;

    setPosition({
      top,
      left: rect.left + scrollX,
      width: rect.width,
      maxHeight: calculatedMaxHeight,
      flipUp: shouldFlipUp,
    });
  }, [triggerRef, isOpen, maxHeight]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScroll = () => {
      if (closeOnScroll) {
        onScrollClose?.();
      } else {
        updatePosition();
      }
    };

    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, updatePosition, closeOnScroll, onScrollClose]);

  return { position, updatePosition };
}

/**
 * Select 键盘导航 Hook
 */
export function useSelectKeyboard<T = any>(options: UseSelectKeyboardOptions<T>) {
  const {
    isOpen,
    disabled = false,
    options: visibleOptions,
    getOptionValue,
    onSelect,
    onOpen,
    onClose,
    listRef,
  } = options;

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const onSelectRef = useRef(onSelect);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  }, [onSelect, onOpen, onClose]);

  const resetHighlight = useCallback(() => {
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef?.current) {
      const items = listRef.current.querySelectorAll('[data-option]');
      const item = items[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex, listRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (!isOpen) {
            onOpenRef.current();
          } else if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
            const option = visibleOptions[highlightedIndex];
            const value = getOptionValue(option);
            onSelectRef.current(value);
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (isOpen) {
            onCloseRef.current();
            resetHighlight();
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            onOpenRef.current();
          } else {
            setHighlightedIndex((prev) =>
              prev < visibleOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : visibleOptions.length - 1
            );
          }
          break;

        case 'Home':
          if (isOpen) {
            e.preventDefault();
            setHighlightedIndex(0);
          }
          break;

        case 'End':
          if (isOpen) {
            e.preventDefault();
            setHighlightedIndex(visibleOptions.length - 1);
          }
          break;

        case 'Tab':
          if (isOpen) {
            onCloseRef.current();
            resetHighlight();
          }
          break;

        default:
          if (isOpen && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const searchChar = e.key.toLowerCase();
            const startIndex = highlightedIndex + 1;

            for (let i = 0; i < visibleOptions.length; i++) {
              const index = (startIndex + i) % visibleOptions.length;
              const option = visibleOptions[index];
              const value = getOptionValue(option);

              if (value.toLowerCase().startsWith(searchChar)) {
                setHighlightedIndex(index);
                break;
              }
            }
          }
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, visibleOptions, getOptionValue, resetHighlight]
  );

  useEffect(() => {
    if (highlightedIndex >= visibleOptions.length) {
      setHighlightedIndex(visibleOptions.length > 0 ? 0 : -1);
    }
  }, [visibleOptions.length, highlightedIndex]);

  return {
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    resetHighlight,
  };
}
