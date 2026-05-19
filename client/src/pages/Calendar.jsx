import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, CaretRight, Plus } from '@phosphor-icons/react';
import { useEntries } from '../hooks/useEntries';

const WEEK_MN = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'];

const MN_MONTHS = [
  '1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар',
  '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар',
];

const MN_DAYS = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];

const ENTRY_BORDERS = ['border-secondary', 'border-primary', 'border-[#b45309]'];
function entryBorderColor(str) {
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) h += str.charCodeAt(i);
  return ENTRY_BORDERS[h % ENTRY_BORDERS.length];
}

export default function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(now);

  const { entries, fetchEntries } = useEntries();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries({ limit: 500 });
  }, [fetchEntries]);

  const entryDays = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const d = new Date(e.entryDate || e.createdAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate();
        map[key] = (map[key] || 0) + 1;
      }
    });
    return map;
  }, [entries, year, month]);

  const dayEntries = useMemo(() => {
    const selStr = selectedDate.toLocaleDateString('en-CA');
    return entries
      .filter((e) => {
        const d = new Date(e.entryDate || e.createdAt);
        return d.toLocaleDateString('en-CA') === selStr;
      })
      .sort((a, b) => new Date(a.entryDate || a.createdAt) - new Date(b.entryDate || b.createdAt));
  }, [entries, selectedDate]);

  const handlePrev = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else { setMonth((m) => m - 1); }
  };

  const handleNext = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else { setMonth((m) => m + 1); }
  };

  // Monday-first: shift Sunday (0) to position 6
  const firstDayRaw = new Date(year, month, 1).getDay();
  const startOffset = (firstDayRaw + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day) =>
    day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  const isSelected = (day) =>
    day === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear();

  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');
  const selectedLabel = `${selectedDate.getMonth() + 1}-р сарын ${selectedDate.getDate()}`;
  const selectedDayName = MN_DAYS[selectedDate.getDay()].toUpperCase() + ' ГАРАГ';

  return (
    <div className="flex min-h-[100dvh]">
      {/* Calendar grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-lg font-bold text-primary">Календар</h1>

          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
            >
              <CaretLeft size={14} />
            </button>
            <span className="text-sm font-semibold text-on-surface px-2 min-w-[140px] text-center">
              {year} оны {MN_MONTHS[month]}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
            >
              <CaretRight size={14} />
            </button>
          </div>

          <button
            onClick={() => {
              setYear(now.getFullYear());
              setMonth(now.getMonth());
              setSelectedDate(now);
            }}
            className="text-xs border border-outline-variant px-3 py-1.5 text-on-surface-variant hover:bg-surface-container hover:border-primary transition-colors"
          >
            Өнөөдөр
          </button>
        </div>

        <div className="bg-white border border-outline-variant">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-outline-variant">
            {WEEK_MN.map((d, i) => (
              <div
                key={d}
                className={`py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider ${
                  i >= 5 ? 'text-secondary' : 'text-on-surface-variant'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const colIdx = i % 7;
              const isWeekend = colIdx === 5 || colIdx === 6;

              if (!day) {
                return (
                  <div
                    key={`e-${i}`}
                    className={`h-[90px] ${isWeekend ? 'bg-surface-container' : 'bg-surface-container-low'} border-b border-r border-outline-variant last:border-r-0`}
                  />
                );
              }

              const count = entryDays[day] || 0;
              const dots = Math.min(count, 3);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`h-[90px] border-b border-r border-outline-variant last:border-r-0 relative flex flex-col items-start p-2 transition-colors hover:bg-primary-fixed/20 text-left ${
                    isSelected(day)
                      ? 'bg-primary-fixed/50'
                      : isWeekend
                      ? 'bg-surface-container-low/60'
                      : ''
                  }`}
                >
                  <span
                    className={`text-sm font-semibold w-7 h-7 flex items-center justify-center ${
                      isToday(day)
                        ? 'bg-secondary text-white rounded-full'
                        : isSelected(day)
                        ? 'text-primary font-bold'
                        : isWeekend
                        ? 'text-secondary/70'
                        : 'text-on-surface'
                    }`}
                  >
                    {day}
                  </span>
                  {count > 0 && (
                    <div className="flex gap-0.5 mt-auto">
                      {Array.from({ length: dots }).map((_, j) => (
                        <span key={j} className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      ))}
                      {count > 3 && (
                        <span className="text-[9px] text-secondary font-bold ml-0.5">
                          +{count - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day detail panel */}
      <div className="w-72 shrink-0 border-l border-outline-variant bg-white flex flex-col">
        <div className="px-5 py-4 border-b border-outline-variant">
          <p className="text-xl font-bold text-on-surface">{selectedLabel}</p>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5">
            {selectedDayName}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {dayEntries.length === 0 ? (
            <p className="text-xs text-on-surface-variant text-center py-8">
              Энэ өдөр бүртгэл байхгүй
            </p>
          ) : (
            dayEntries.map((entry) => {
              const t = new Date(entry.entryDate || entry.createdAt);
              const time = isNaN(t)
                ? ''
                : t.toLocaleTimeString('mn-MN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  });
              return (
                <div key={entry._id} className="flex gap-3">
                  <span className="text-xs font-mono text-on-surface-variant w-10 shrink-0 pt-0.5">
                    {time}
                  </span>
                  <div className={`flex-1 border-l-2 ${entryBorderColor(entry.what)} pl-3 py-0.5`}>
                    <p className="text-sm font-semibold text-on-surface leading-tight">
                      {entry.what || entry.text || '—'}
                    </p>
                    {entry.where && (
                      <p className="text-xs text-on-surface-variant mt-0.5">{entry.where}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={() => navigate(`/entries?date=${selectedDateStr}`)}
            className="w-full bg-secondary text-white text-sm font-semibold py-2.5 hover:bg-secondary-dark active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Нэмэх
          </button>
        </div>
      </div>
    </div>
  );
}
