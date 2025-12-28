/**
 * usePagination Hook
 * 分页管理 Hook
 *
 * 提供完整的分页状态管理和计算
 * 支持页码跳转、页面大小变更、总数计算等功能
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * 分页配置选项
 */
export interface UsePaginationOptions {
  /**
   * 总项目数
   */
  totalItems: number;

  /**
   * 初始页码（从 1 开始）
   * @default 1
   */
  initialPage?: number;

  /**
   * 每页项目数
   * @default 10
   */
  pageSize?: number;

  /**
   * 是否显示首页/尾页按钮
   * @default true
   */
  showFirstLast?: boolean;

  /**
   * 页码改变回调
   */
  onPageChange?: (page: number) => void;

  /**
   * 页面大小改变回调
   */
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * 分页返回值
 */
export interface UsePaginationReturn {
  /**
   * 当前页码（从 1 开始）
   */
  currentPage: number;

  /**
   * 每页项目数
   */
  pageSize: number;

  /**
   * 总页数
   */
  totalPages: number;

  /**
   * 总项目数
   */
  totalItems: number;

  /**
   * 是否是第一页
   */
  isFirstPage: boolean;

  /**
   * 是否是最后一页
   */
  isLastPage: boolean;

  /**
   * 当前页的第一个项目的索引（从 0 开始）
   */
  startIndex: number;

  /**
   * 当前页的最后一个项目的索引（从 0 开始）
   */
  endIndex: number;

  /**
   * 页码范围（用于显示页码列表）
   */
  pageRange: number[];

  /**
   * 跳转到指定页
   */
  goToPage: (page: number) => void;

  /**
   * 上一页
   */
  previousPage: () => void;

  /**
   * 下一页
   */
  nextPage: () => void;

  /**
   * 第一页
   */
  firstPage: () => void;

  /**
   * 最后一页
   */
  lastPage: () => void;

  /**
   * 设置每页项目数
   */
  setPageSize: (size: number) => void;

  /**
   * 重置到第一页
   */
  reset: () => void;

  /**
   * 获取当前页的数据（用于客户端分页）
   */
  getCurrentPageData: <T>(data: T[]) => T[];
}

/**
 * 计算页码范围
 */
function calculatePageRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - halfVisible);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * usePagination Hook
 *
 * @example
 * ```tsx
 * const { currentPage, totalPages, goToPage, nextPage, previousPage } = usePagination({
 *   totalItems: 100,
 *   pageSize: 10,
 * });
 *
 * return (
 *   <div>
 *     <button onClick={previousPage} disabled={currentPage === 1}>
 *       Previous
 *     </button>
 *     <span>Page {currentPage} of {totalPages}</span>
 *     <button onClick={nextPage} disabled={currentPage === totalPages}>
 *       Next
 *     </button>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 客户端分页
 * const allItems = [...]; // 所有数据
 * const pagination = usePagination({
 *   totalItems: allItems.length,
 *   pageSize: 20,
 * });
 *
 * const currentPageItems = pagination.getCurrentPageData(allItems);
 *
 * return (
 *   <div>
 *     {currentPageItems.map(item => <div key={item.id}>{item.name}</div>)}
 *   </div>
 * );
 * ```
 */
export function usePagination(
  options: UsePaginationOptions
): UsePaginationReturn {
  const {
    totalItems,
    initialPage = 1,
    pageSize: initialPageSize = 10,
    onPageChange,
    onPageSizeChange,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  // 计算总页数
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  // 确保当前页在有效范围内
  const validCurrentPage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages]
  );

  // 计算索引
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // 是否是第一页/最后一页
  const isFirstPage = validCurrentPage === 1;
  const isLastPage = validCurrentPage === totalPages;

  // 页码范围
  const pageRange = useMemo(
    () => calculatePageRange(validCurrentPage, totalPages),
    [validCurrentPage, totalPages]
  );

  /**
   * 跳转到指定页
   */
  const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.min(Math.max(1, page), totalPages);
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    },
    [totalPages, onPageChange]
  );

  /**
   * 上一页
   */
  const previousPage = useCallback(() => {
    if (validCurrentPage > 1) {
      goToPage(validCurrentPage - 1);
    }
  }, [validCurrentPage, goToPage]);

  /**
   * 下一页
   */
  const nextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      goToPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages, goToPage]);

  /**
   * 第一页
   */
  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  /**
   * 最后一页
   */
  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  /**
   * 设置每页项目数
   */
  const setPageSize = useCallback(
    (newSize: number) => {
      setPageSizeState(newSize);
      setCurrentPage(1); // 重置到第一页
      onPageSizeChange?.(newSize);
    },
    [onPageSizeChange]
  );

  /**
   * 重置到第一页
   */
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  /**
   * 获取当前页的数据（客户端分页）
   */
  const getCurrentPageData = useCallback(
    <T,>(data: T[]): T[] => {
      const start = startIndex;
      const end = startIndex + pageSize;
      return data.slice(start, end);
    },
    [startIndex, pageSize]
  );

  return {
    currentPage: validCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    isFirstPage,
    isLastPage,
    startIndex,
    endIndex,
    pageRange,
    goToPage,
    previousPage,
    nextPage,
    firstPage,
    lastPage,
    setPageSize,
    reset,
    getCurrentPageData,
  };
}

/**
 * usePaginationWithData Hook
 * 集成数据的分页 Hook（自动处理客户端分页）
 *
 * @example
 * ```tsx
 * const allUsers = [...]; // 所有用户数据
 * const { currentPageData, ...pagination } = usePaginationWithData(allUsers, {
 *   pageSize: 20,
 * });
 *
 * return (
 *   <div>
 *     {currentPageData.map(user => <UserCard key={user.id} user={user} />)}
 *     <Pagination {...pagination} />
 *   </div>
 * );
 * ```
 */
export interface UsePaginationWithDataReturn<T>
  extends UsePaginationReturn {
  /**
   * 当前页的数据
   */
  currentPageData: T[];
}

export function usePaginationWithData<T>(
  data: T[],
  options: Omit<UsePaginationOptions, 'totalItems'> = {}
): UsePaginationWithDataReturn<T> {
  const pagination = usePagination({
    ...options,
    totalItems: data.length,
  });

  const currentPageData = useMemo(
    () => pagination.getCurrentPageData(data),
    [data, pagination.getCurrentPageData] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    ...pagination,
    currentPageData,
  };
}

/**
 * useInfinitePagination Hook
 * 无限滚动分页（加载更多）
 *
 * @example
 * ```tsx
 * const {
 *   items,
 *   hasMore,
 *   loadMore,
 *   isLoading,
 * } = useInfinitePagination({
 *   fetchItems: async (page) => {
 *     const response = await fetch(`/api/items?page=${page}`);
 *     return response.json();
 *   },
 *   pageSize: 20,
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <ItemCard key={item.id} item={item} />)}
 *     {hasMore && (
 *       <button onClick={loadMore} disabled={isLoading}>
 *         {isLoading ? 'Loading...' : 'Load More'}
 *       </button>
 *     )}
 *   </div>
 * );
 * ```
 */
export interface UseInfinitePaginationOptions<T> {
  /**
   * 获取数据的函数
   */
  fetchItems: (page: number, pageSize: number) => Promise<T[]>;

  /**
   * 每页项目数
   * @default 10
   */
  pageSize?: number;

  /**
   * 是否立即加载第一页
   * @default true
   */
  immediate?: boolean;
}

export interface UseInfinitePaginationReturn<T> {
  /**
   * 所有已加载的项目
   */
  items: T[];

  /**
   * 是否还有更多数据
   */
  hasMore: boolean;

  /**
   * 是否正在加载
   */
  isLoading: boolean;

  /**
   * 当前页码
   */
  currentPage: number;

  /**
   * 加载更多
   */
  loadMore: () => Promise<void>;

  /**
   * 重置（清空并重新加载第一页）
   */
  reset: () => void;
}

export function useInfinitePagination<T>(
  options: UseInfinitePaginationOptions<T>
): UseInfinitePaginationReturn<T> {
  const { fetchItems, pageSize = 10, immediate = true } = options;

  const [items, setItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const newItems = await fetchItems(nextPage, pageSize);

      setItems((prev) => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setHasMore(newItems.length === pageSize);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, fetchItems, pageSize, isLoading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    loadMore();
  }, [loadMore]);

  // 立即加载第一页
  useMemo(() => {
    if (immediate && items.length === 0 && !isLoading) {
      loadMore();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items,
    hasMore,
    isLoading,
    currentPage,
    loadMore,
    reset,
  };
}

export default usePagination;
