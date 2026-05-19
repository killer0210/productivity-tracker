import { useMemo } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarGrid({ year, month, entries, onDayClick, onPrev, onNext }) {
  const today = new Date();

  const entryDays = useMemo(() => {
    const set = new Set();
    entries.forEach((e) => {
      const d = new Date(e.entryDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        set.add(d.getDate());
      }
    });
    return set;
  }, [entries, year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white border border-zinc-100 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
        <button
          onClick={onPrev}
          className="p-1.5 hover:bg-zinc-50 rounded-md transition-colors text-zinc-500 hover:text-zinc-800"
        >
          <CaretLeft size={13} />
        </button>
        <span className="text-sm font-semibold text-zinc-800">{monthLabel}</span>
        <button
          onClick={onNext}
          className="p-1.5 hover:bg-zinc-50 rounded-md transition-colors text-zinc-500 hover:text-zinc-800"
        >
          <CaretRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[11px] font-medium text-zinc-400 border-b border-zinc-50"
          >
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="py-3" />;

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasEntries = entryDays.has(day);

          return (
            <button
              key={day}
              onClick={() => onDayClick(new Date(year, month, day))}
              className={`py-3 text-sm text-center relative hover:bg-blue-50/60 transition-colors duration-100 ${
                isToday ? 'font-semibold text-blue-600' : 'text-zinc-700'
              }`}
            >
              {day}
              {hasEntries && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
