import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MagnifyingGlass, PencilSimple, Trash, Check, X, Plus } from '@phosphor-icons/react';
import { useEntries } from '../hooks/useEntries';
import ExportButton from '../components/ExportButton';

const relativeDate = (entry) => {
  const d = new Date(entry.entryDate || entry.createdAt);
  if (isNaN(d)) return '—';
  const todayStr = new Date().toLocaleDateString('en-CA');
  const entryStr = d.toLocaleDateString('en-CA');
  const diffDays = Math.round((new Date(todayStr) - new Date(entryStr)) / 86400000);
  if (diffDays === 0) return 'Өнөөдөр';
  if (diffDays === 1) return 'Өчигдөр';
  if (diffDays === 2) return 'Уржигдар';
  return entryStr;
};

const formatDuration = (mins) => {
  if (!mins) return null;
  if (mins < 60) return `${mins}мин`;
  return `${(mins / 60).toFixed(1).replace(/\.0$/, '')}ц`;
};

export default function Entries() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [whatFilter, setWhatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const { entries, loading, meta, fetchEntries, updateEntry, deleteEntry } = useEntries();

  const load = useCallback(() => {
    const params = { page, limit: 20 };
    if (search.trim()) params.search = search.trim();
    if (date) params.date = date;
    fetchEntries(params);
  }, [fetchEntries, search, date, page]);

  useEffect(() => {
    load();
  }, [load]);

  const whatOptions = useMemo(() => {
    const set = new Set(entries.map((e) => e.what).filter(Boolean));
    return [...set].sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!whatFilter) return entries;
    return entries.filter((e) => (e.what || '') === whatFilter);
  }, [entries, whatFilter]);

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setEditForm({
      where: entry.where || '',
      what: entry.what || '',
      duration: entry.duration || '',
      text: entry.text || '',
    });
  };

  const handleUpdate = async (id) => {
    await updateEntry(id, editForm);
    setEditingId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Устгах уу?')) return;
    await deleteEntry(id);
    load();
  };

  const formatTime = (entry) => {
    const d = new Date(entry.entryDate || entry.createdAt);
    if (isNaN(d)) return '—';
    return d.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const pageNumbers = () => {
    const total = meta.pages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (page >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', page - 1, page, page + 1, '...', total];
  };

  const clearFilters = () => {
    setSearch('');
    setDate('');
    setWhatFilter('');
    setPage(1);
  };

  const hasFilters = search || date || whatFilter;

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary">Бүртгэлүүд</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Системийн нийт үйл ажиллагааны жагсаалт
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-secondary hover:bg-secondary-dark px-3 py-2 transition-colors"
        >
          <Plus size={13} />
          Шинэ нэмэх
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-outline-variant px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <MagnifyingGlass
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Хайх..."
            className="text-sm border border-outline-variant pl-8 pr-3 py-1.5 focus:outline-none focus:border-primary bg-white w-48 transition-colors"
          />
        </div>

        <select
          value={whatFilter}
          onChange={(e) => { setWhatFilter(e.target.value); setPage(1); }}
          className="text-sm border border-outline-variant px-3 py-1.5 focus:outline-none focus:border-primary bg-white transition-colors text-on-surface-variant"
        >
          <option value="">Ангилал</option>
          {whatOptions.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1); }}
          className="text-sm border border-outline-variant px-3 py-1.5 focus:outline-none focus:border-primary bg-white font-mono transition-colors"
        />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-error transition-colors"
          >
            <X size={12} /> Цэвэрлэх
          </button>
        )}

        <div className="ml-auto">
          <ExportButton params={date ? { from: date, to: date } : {}} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-outline-variant overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Огноо
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Цаг
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Хаана
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Юу
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant w-24">
                Үргэлжлэл
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant text-right w-20">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-on-surface-variant">
                  Ачааллаж байна...
                </td>
              </tr>
            ) : filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-on-surface-variant">
                  {hasFilters
                    ? 'Хайлтад тохирох бүртгэл олдсонгүй'
                    : 'Бүртгэл байхгүй байна'}
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, i) => {
                if (editingId === entry._id) {
                  return (
                    <tr key={entry._id} className="bg-primary-fixed/30">
                      <td className="px-4 py-2 text-xs font-mono text-on-surface-variant">
                        {relativeDate(entry)}
                      </td>
                      <td className="px-4 py-2 text-xs font-mono text-on-surface-variant">
                        {formatTime(entry)}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-full text-xs border border-outline-variant px-2 py-1 focus:outline-none focus:border-primary"
                          value={editForm.where}
                          onChange={(e) => setEditForm((p) => ({ ...p, where: e.target.value }))}
                          placeholder="Хаана"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-full text-xs border border-outline-variant px-2 py-1 focus:outline-none focus:border-primary"
                          value={editForm.what}
                          onChange={(e) => setEditForm((p) => ({ ...p, what: e.target.value }))}
                          placeholder="Юу"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-full text-xs border border-outline-variant px-2 py-1 font-mono focus:outline-none focus:border-primary"
                          value={editForm.duration}
                          onChange={(e) => setEditForm((p) => ({ ...p, duration: e.target.value }))}
                          placeholder="мин"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(entry._id)}
                            className="text-secondary hover:text-secondary-dark transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-on-surface-variant hover:text-error transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr
                    key={entry._id}
                    className={`group hover:bg-surface-container-low transition-colors ${
                      i % 2 === 1 ? 'bg-[#fafafa]' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 text-xs font-mono text-on-surface-variant whitespace-nowrap">
                      {relativeDate(entry)}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-on-surface-variant">
                      {formatTime(entry)}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-on-surface font-medium">
                      {entry.where || <span className="text-outline-variant">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-on-surface max-w-[240px] truncate">
                      {entry.what || entry.text || (
                        <span className="text-outline-variant">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {entry.duration ? (
                        <span className="text-xs font-mono font-semibold text-primary bg-primary-fixed px-2 py-0.5">
                          {formatDuration(entry.duration)}
                        </span>
                      ) : (
                        <span className="text-outline-variant text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(entry)}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <PencilSimple size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {meta.total > 0 && (
          <div className="px-4 py-3 border-t border-outline-variant flex items-center justify-between bg-surface-container-low">
            <span className="text-xs text-on-surface-variant">
              Нийт{' '}
              <span className="font-mono font-semibold text-primary">
                {meta.total.toLocaleString()}
              </span>{' '}
              бичлэгээс {(page - 1) * 20 + 1}–{Math.min(page * 20, meta.total)} харуулж байна
            </span>

            {meta.pages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2.5 py-1 text-xs border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
                >
                  ‹
                </button>
                {pageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-1 text-xs text-on-surface-variant">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 text-xs transition-colors ${
                        page === p
                          ? 'bg-primary text-white'
                          : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                  disabled={page === meta.pages}
                  className="px-2.5 py-1 text-xs border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
