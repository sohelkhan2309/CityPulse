import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchEventsPaged, EventItem } from '../api/api';

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 200) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function useEvents() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<EventItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (q: string, p: number, append: boolean) => {
    setLoading(true);
    const res = await fetchEventsPaged(q.toLowerCase(), p);
    setItems(prev => append ? [...prev, ...res.items] : res.items);
    setPage(res.page);
    setTotalPages(res.totalPages);
    setLoading(false);
  }, []);

  // initial load
  useEffect(() => { load('', 0, false); }, [load]);

  const debounced = useMemo(() => debounce((text: string) => {
    const q = text || '';
    load(q, 0, false);
  }, 200), [load]);

  useEffect(() => {
    debounced(query);
  }, [query, debounced]);

  const onEnd = () => {
    if (loading) return;
    if (page + 1 >= totalPages) return;
    const next = page + 1;
    load(query, next, true);
  };

  const refresh = async () => {
    setRefreshing(true);
    await load(query, 0, false);
    setRefreshing(false);
  };

  return { query, setQuery, items, loading, onEnd, refresh, refreshing };
}
