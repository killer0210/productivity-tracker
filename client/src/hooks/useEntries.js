import { useState, useCallback } from 'react';
import api from '../services/api';

export function useEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const fetchEntries = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/entries', { params });
      setEntries(data.entries);
      setMeta({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEntry = useCallback(async (entryData) => {
    const { data } = await api.post('/entries', entryData);
    return data;
  }, []);

  const updateEntry = useCallback(async (id, entryData) => {
    const { data } = await api.put(`/entries/${id}`, entryData);
    return data;
  }, []);

  const deleteEntry = useCallback(async (id) => {
    await api.delete(`/entries/${id}`);
  }, []);

  return { entries, loading, error, meta, fetchEntries, createEntry, updateEntry, deleteEntry };
}
