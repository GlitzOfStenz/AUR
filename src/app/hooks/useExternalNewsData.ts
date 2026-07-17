import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/universities';

export interface ExternalNewsItem {
  title: string;
  description?: string;
  url: string;
  source?: string;
  published_at?: string;
  image?: string;
}

export function useExternalNewsData() {
  const [externalNews, setExternalNews] = useState<ExternalNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchExternalNews = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_BASE_URL}/api/news/external`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch external news');
        const data = await res.json();
        setExternalNews(data.data || []);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(true);
          setExternalNews([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExternalNews();
    return () => controller.abort();
  }, []);

  return { externalNews, loading, error };
}