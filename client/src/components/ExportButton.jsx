import { useState } from 'react';
import { DownloadSimple } from '@phosphor-icons/react';
import api from '../services/api';

export default function ExportButton({ params = {} }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/entries/export', {
        params,
        responseType: 'blob',
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'entries.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-secondary hover:bg-secondary-dark px-3 py-2 transition-colors disabled:opacity-50"
    >
      <DownloadSimple size={13} />
      {loading ? 'Гаргаж байна...' : 'Excel-р гаргах'}
    </button>
  );
}
