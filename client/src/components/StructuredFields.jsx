export default function StructuredFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wide">
          Where
        </label>
        <input
          type="text"
          value={values.where}
          onChange={(e) => onChange('where', e.target.value)}
          placeholder="Office, Home, Cafe..."
          className="w-full text-sm border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 bg-white transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wide">
          What
        </label>
        <input
          type="text"
          value={values.what}
          onChange={(e) => onChange('what', e.target.value)}
          placeholder="Meeting, Coding, Review..."
          className="w-full text-sm border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 bg-white transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wide">
          Date
        </label>
        <input
          type="date"
          value={values.entryDate}
          onChange={(e) => onChange('entryDate', e.target.value)}
          className="w-full text-sm border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 bg-white font-mono transition-colors"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wide">
          Duration (min)
        </label>
        <input
          type="number"
          value={values.duration}
          onChange={(e) => onChange('duration', Number(e.target.value))}
          placeholder="60"
          min="0"
          className="w-full text-sm border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 bg-white font-mono transition-colors"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wide">
          Notes
        </label>
        <textarea
          value={values.text}
          onChange={(e) => onChange('text', e.target.value)}
          placeholder="Notes or voice transcript..."
          rows={2}
          className="w-full text-sm border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 bg-white resize-none transition-colors"
        />
      </div>
    </div>
  );
}
