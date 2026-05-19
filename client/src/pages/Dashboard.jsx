import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Microphone, MicrophoneSlash, TrendUp, CaretRight, Plus } from '@phosphor-icons/react';
import { useEntries } from '../hooks/useEntries';
import { useVoice } from '../hooks/useVoice';
import api from '../services/api';

const todayISO = () => new Date().toISOString().split('T')[0];
const nowTime = () => new Date().toTimeString().slice(0, 5);

const emptyForm = () => ({
  where: '',
  what: '',
  entryDate: todayISO(),
  entryTime: nowTime(),
  duration: '',
  text: '',
});

const BADGE_COLORS = [
  'bg-primary-fixed text-on-primary-fixed-variant',
  'bg-secondary-fixed text-on-secondary-fixed-variant',
  'bg-tertiary-fixed text-on-tertiary-fixed-variant',
];
function badgeColor(str) {
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) h += str.charCodeAt(i);
  return BADGE_COLORS[h % BADGE_COLORS.length];
}

function formatDuration(mins) {
  if (!mins) return null;
  if (mins < 60) return `${mins}мин`;
  return `${(mins / 60).toFixed(1).replace(/\.0$/, '')}ц`;
}

export default function Dashboard() {
  const { entries, loading, fetchEntries, createEntry, deleteEntry } = useEntries();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => fetchEntries({ date: todayISO() }), [fetchEntries]);

  useEffect(() => {
    load();
    api
      .get('/entries', { params: { limit: 1 } })
      .then(({ data }) => setTotalCount(data.total ?? null))
      .catch(() => {});
  }, [load]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleVoice = useCallback((transcript) => {
    setForm((prev) => ({ ...prev, text: transcript }));
  }, []);

  const { isListening, startListening, stopListening, supported: voiceSupported } =
    useVoice(handleVoice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.what.trim() && !form.text.trim()) {
      setError('"Юу" эсвэл тайлбар оруулна уу.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const entryDate = form.entryTime
        ? `${form.entryDate}T${form.entryTime}`
        : form.entryDate;
      await createEntry({
        where: form.where,
        what: form.what,
        entryDate,
        duration: form.duration ? Number(form.duration) : 0,
        text: form.text,
      });
      setForm(emptyForm());
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Хадгалахад алдаа гарлаа.');
    } finally {
      setSubmitting(false);
    }
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

  const hourBars = useMemo(() => {
    const counts = {};
    entries.forEach((e) => {
      const h = new Date(e.entryDate || e.createdAt).getHours();
      counts[h] = (counts[h] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts), 1);
    return Array.from({ length: 12 }, (_, i) => {
      const h = i + 8;
      const c = counts[h] || 0;
      return { h, label: `${h}`, pct: Math.max((c / max) * 100, c > 0 ? 8 : 0) };
    });
  }, [entries]);

  const goalPct = Math.min(Math.round((entries.length / 10) * 100), 100);

  const stats = [
    { label: 'ӨНӨӨДӨР', value: loading ? '—' : String(entries.length), sub: null, err: false },
    { label: 'ЭНЭ 7 ХОНОГ', value: '—', sub: null, err: false },
    { label: 'НИЙТ', value: totalCount !== null ? totalCount.toLocaleString() : '—', sub: null, err: false },
    { label: 'ДУУСААГҮЙ', value: '—', sub: 'Яаралтай', err: true },
  ];

  const fields = [
    { label: 'Хаана', field: 'where', placeholder: 'Байршил', type: 'text' },
    { label: 'Юу', field: 'what', placeholder: 'Төрөл', type: 'text' },
    { label: 'Хэзээ', field: 'entryDate', placeholder: '', type: 'date' },
    { label: 'Хэдэн цагт', field: 'entryTime', placeholder: '', type: 'time' },
  ];

  const WEEK_SHORT = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5 max-w-[1400px] mx-auto w-full">

      {/* Mobile greeting */}
      <div className="md:hidden">
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
          Өнөөдрийн тойм
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-outline-variant p-3 md:p-4 h-20 md:h-24 flex flex-col justify-between"
          >
            <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {s.label}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl md:text-3xl font-bold leading-none font-mono ${
                  s.err ? 'text-error' : 'text-primary'
                }`}
              >
                {s.value}
              </span>
              {s.sub && (
                <span className="text-xs text-on-surface-variant">{s.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick entry + Recent entries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">

        {/* Quick entry — always visible on desktop, toggle on mobile */}
        <section className={`lg:col-span-5 bg-white border border-outline-variant p-4 md:p-6 space-y-4 md:space-y-5 ${showForm ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary">Шуурхай бүртгэл</h3>
            <div className="flex items-center gap-2">
              {voiceSupported && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  title={isListening ? 'Зогсоох' : 'Дуу хоолой'}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isListening
                      ? 'bg-error text-white'
                      : 'bg-primary-fixed-dim text-primary hover:bg-primary-fixed'
                  }`}
                >
                  {isListening ? (
                    <MicrophoneSlash size={16} weight="fill" />
                  ) : (
                    <Microphone size={16} weight="fill" />
                  )}
                </button>
              )}
              <button
                onClick={() => setShowForm(false)}
                className="md:hidden text-xs text-on-surface-variant px-2 py-1 hover:text-error transition-colors"
              >
                Хаах
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={form.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Дуу хоолой эсвэл текстээр мэдээллээ оруулна уу..."
              className="w-full h-28 md:h-32 px-3 py-2.5 text-sm border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all"
            />
            <div className="grid grid-cols-2 gap-3">
              {fields.map(({ label, field, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-10 px-3 text-sm border border-outline-variant bg-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>
            {error && <p className="text-xs text-error">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-secondary text-white text-base md:text-lg font-semibold hover:bg-secondary-container hover:text-on-secondary-container active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {submitting ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
          </form>
        </section>

        {/* Recent entries */}
        <section className="lg:col-span-7 bg-white border border-outline-variant overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary">Сүүлийн бүртгэлүүд</h3>
            <Link to="/entries" className="text-[11px] font-semibold text-secondary hover:underline">
              Бүгдийг харах
            </Link>
          </div>

          {/* Mobile: card list */}
          <div className="md:hidden divide-y divide-outline-variant">
            {loading ? (
              <p className="py-8 text-center text-xs text-on-surface-variant">Ачааллаж байна...</p>
            ) : entries.length === 0 ? (
              <p className="py-10 text-center text-sm text-on-surface-variant">
                Өнөөдөр бүртгэл байхгүй байна
              </p>
            ) : (
              entries.slice(0, 6).map((entry) => (
                <div key={entry._id} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {entry.what && (
                        <span className={`inline-block px-1.5 py-0.5 text-[9px] uppercase font-bold ${badgeColor(entry.what)}`}>
                          {entry.what}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-on-surface truncate leading-tight">
                      {entry.text || entry.where || '—'}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {entry.where && entry.text ? `${entry.where} • ` : ''}{formatTime(entry)}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {entry.duration ? (
                      <span className="text-xs font-mono font-semibold text-primary">
                        {formatDuration(entry.duration)}
                      </span>
                    ) : null}
                    <CaretRight size={14} className="text-outline-variant" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop: table */}
          <table className="hidden md:table w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant w-12">
                  Цаг
                </th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant w-28">
                  Төрөл
                </th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Тайлбар
                </th>
                <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant text-right w-16">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-xs text-on-surface-variant">
                    Ачааллаж байна...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <p className="text-sm text-on-surface-variant">Өнөөдөр бүртгэл байхгүй байна</p>
                  </td>
                </tr>
              ) : (
                entries.slice(0, 8).map((entry, i) => (
                  <tr
                    key={entry._id}
                    className={`group hover:bg-surface-container-low transition-colors ${
                      i % 2 === 1 ? 'bg-surface-container-lowest' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-xs font-mono text-on-surface whitespace-nowrap">
                      {formatTime(entry)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.what ? (
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold ${badgeColor(entry.what)}`}>
                          {entry.what}
                        </span>
                      ) : (
                        <span className="text-outline-variant text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant max-w-[200px] truncate">
                      {entry.text || entry.where || (
                        <span className="text-outline-variant">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="opacity-0 group-hover:opacity-100 flex justify-end transition-opacity">
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-[11px] text-error hover:underline"
                        >
                          Устгах
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* Activity chart + Daily goal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Activity bar chart */}
        <div className="md:col-span-2 bg-white border border-outline-variant p-4 md:p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-primary">Долоо хоногийн идэвх</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Сүүлийн 24 цагийн идэвх</p>
            </div>
            <TrendUp size={20} className="text-secondary" />
          </div>
          <div className="flex items-end gap-1 h-24 md:h-32">
            {hourBars.map(({ h, pct }) => (
              <div
                key={h}
                title={`${h}:00`}
                style={{ height: `${pct || 4}%` }}
                className={`flex-1 transition-colors cursor-help ${
                  pct > 0 ? 'bg-primary/30 hover:bg-primary' : 'bg-surface-container-high'
                }`}
              />
            ))}
          </div>
          {/* Mobile: weekday labels; Desktop: hour labels */}
          <div className="flex justify-between mt-2">
            {WEEK_SHORT.map((d) => (
              <span key={d} className="md:hidden flex-1 text-center text-[10px] text-on-surface-variant font-medium">
                {d}
              </span>
            ))}
            <span className="hidden md:block text-[10px] text-on-surface-variant">08:00</span>
            <span className="hidden md:block text-[10px] text-on-surface-variant">19:00</span>
          </div>
        </div>

        {/* Daily goal */}
        <div
          className="p-5 flex flex-col items-center justify-center text-center gap-3 text-white"
          style={{ backgroundColor: '#1f4e79' }}
        >
          <h4 className="text-sm font-bold">Өдрийн Зорилт</h4>
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-secondary-fixed flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold font-mono">{goalPct}%</span>
          </div>
          <p className="text-xs text-white/70">
            {entries.length < 10
              ? `Зорилтоо биелүүлэхэд ${10 - entries.length} ажил дутуу байна`
              : 'Өнөөдрийн зорилт биелсэн!'}
          </p>
        </div>
      </div>

      {/* FAB — mobile only, opens entry form */}
      <button
        onClick={() => setShowForm(true)}
        className="md:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label="Шинэ бүртгэл нэмэх"
      >
        <Plus size={26} weight="bold" />
      </button>
    </div>
  );
}
