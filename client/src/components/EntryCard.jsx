import { useState } from 'react';
import { PencilSimple, Trash, Check, X } from '@phosphor-icons/react';

export default function EntryCard({ entry, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    where: entry.where || '',
    what: entry.what || '',
    duration: entry.duration || '',
    text: entry.text || '',
  });

  const dateStr = new Date(entry.entryDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(entry._id, form);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this entry?')) return;
    await onDelete(entry._id);
  };

  if (editing) {
    return (
      <div className="py-2 px-4 flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/80">
        <span className="font-mono text-[11px] text-zinc-400 w-14 shrink-0">{dateStr}</span>
        <input
          className="text-xs border border-zinc-200 rounded px-2 py-1 w-24 focus:outline-none focus:border-blue-400 bg-white"
          value={form.where}
          onChange={(e) => setForm((p) => ({ ...p, where: e.target.value }))}
          placeholder="Where"
        />
        <input
          className="text-xs border border-zinc-200 rounded px-2 py-1 flex-1 focus:outline-none focus:border-blue-400 bg-white"
          value={form.what}
          onChange={(e) => setForm((p) => ({ ...p, what: e.target.value }))}
          placeholder="What"
        />
        <input
          type="number"
          className="text-xs border border-zinc-200 rounded px-2 py-1 w-14 font-mono focus:outline-none focus:border-blue-400 bg-white"
          value={form.duration}
          onChange={(e) => setForm((p) => ({ ...p, duration: Number(e.target.value) }))}
          placeholder="min"
          min="0"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
        >
          <Check size={14} />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="py-2.5 px-4 flex items-center gap-3 border-b border-zinc-100 hover:bg-zinc-50/60 transition-colors duration-100 group">
      <span className="font-mono text-[11px] text-zinc-400 w-14 shrink-0">{dateStr}</span>
      <span className="text-xs text-zinc-500 w-24 shrink-0 truncate">
        {entry.where || <span className="text-zinc-300">—</span>}
      </span>
      <span className="text-sm text-zinc-800 flex-1 truncate">
        {entry.what || entry.text || <span className="text-zinc-300">—</span>}
      </span>
      <span className="font-mono text-[11px] text-zinc-400 w-10 text-right shrink-0">
        {entry.duration ? `${entry.duration}m` : '—'}
      </span>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded transition-colors"
        >
          <PencilSimple size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 text-zinc-400 hover:text-red-500 rounded transition-colors"
        >
          <Trash size={12} />
        </button>
      </div>
    </div>
  );
}
