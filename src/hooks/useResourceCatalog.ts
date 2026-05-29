import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, isApiConfigured } from '../lib/api';
import {
  mergeResourceCatalog,
  staticResourceItems,
  type ApiResourceRow,
  type ResourceItem,
} from '../lib/resourceCatalog';

export function useResourceCatalog() {
  const [apiItems, setApiItems] = useState<ApiResourceRow[]>([]);
  const [loading, setLoading] = useState(isApiConfigured());
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.resources();
      setApiItems(res.resources);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load chapter resources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resources = useMemo<ResourceItem[]>(() => {
    if (!apiItems.length) return staticResourceItems();
    return mergeResourceCatalog(apiItems);
  }, [apiItems]);

  return { resources, loading, error, refresh };
}
