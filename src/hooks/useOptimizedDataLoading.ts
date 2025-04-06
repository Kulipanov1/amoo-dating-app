import { useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from 'lodash';

interface UseOptimizedDataLoadingProps<T> {
  initialData: T[];
  loadMore: () => Promise<T[]>;
  hasMore: boolean;
  debounceTime?: number;
}

export const useOptimizedDataLoading = <T>({
  initialData,
  loadMore,
  hasMore,
  debounceTime = 300
}: UseOptimizedDataLoadingProps<T>) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(hasMore);

  // Мемоизируем функцию загрузки
  const loadMoreData = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const newData = await loadMore();
      setData(prev => [...prev, ...newData]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [loadMore]);

  // Дебаунсим функцию загрузки
  const debouncedLoadMore = useCallback(
    debounce(loadMoreData, debounceTime),
    [loadMoreData, debounceTime]
  );

  // Обновляем ref при изменении hasMore
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Очищаем дебаунс при размонтировании
  useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, [debouncedLoadMore]);

  return {
    data,
    loading,
    loadMore: debouncedLoadMore,
    hasMore: hasMoreRef.current
  };
}; 