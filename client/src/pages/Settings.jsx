import { useState, useEffect } from 'react';
import { Plus, Trash, DotsSixVertical } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const DEFAULT_FIELDS = ['Хаана', 'Юу', 'Хэзээ', 'Хэдэн цагт'];

export default function Settings() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newField, setNewField] = useState('');
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [emailNotif, setEmailNotif] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/templates');
      setTemplates(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addTemplate = async () => {
    if (!newField.trim()) return;
    setSaving(true);
    setFieldError('');
    try {
      await api.post('/templates', { name: newField.trim(), fields: [] });
      setNewField('');
      load();
    } catch (err) {
      setFieldError(err.response?.data?.message || 'Хадгалахад алдаа гарлаа.');
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Устгах уу?')) return;
    await api.delete(`/templates/${id}`);
    load();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto w-full space-y-5">
      <h1 className="text-lg font-bold text-primary">Тохиргоо</h1>

      {/* Template fields */}
      <div className="bg-white border border-outline-variant">
        <div className="px-5 py-4 border-b border-outline-variant flex items-start justify-between">
          <div>
            <h2 className="text-sm font-bold text-primary">Загварын талбарууд</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Та өөрийн бүртгэлийн талбаруудыг эндээс удирдах боломжтой.
            </p>
          </div>
        </div>

        <div className="divide-y divide-outline-variant">
          {DEFAULT_FIELDS.map((f) => (
            <div key={f} className="px-5 py-3 flex items-center gap-3">
              <DotsSixVertical size={16} className="text-outline shrink-0" />
              <span className="text-sm text-on-surface">{f}</span>
            </div>
          ))}
          {!loading &&
            templates.map((t) => (
              <div key={t._id} className="px-5 py-3 flex items-center gap-3 group">
                <DotsSixVertical size={16} className="text-outline shrink-0" />
                <span className="text-sm text-on-surface flex-1">{t.name}</span>
                <button
                  onClick={() => deleteTemplate(t._id)}
                  className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-all"
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
        </div>

        <div className="px-5 py-4 border-t border-outline-variant flex items-center gap-3">
          <input
            type="text"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTemplate()}
            placeholder="Шинэ талбар нэмэх..."
            className="flex-1 text-sm border border-outline-variant px-3 py-2 focus:outline-none focus:border-primary bg-surface-container-low transition-colors"
          />
          <button
            onClick={addTemplate}
            disabled={saving || !newField.trim()}
            className="flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 hover:bg-primary-container active:scale-[0.99] transition-all disabled:opacity-60"
          >
            <Plus size={13} /> Нэмэх
          </button>
        </div>
        {fieldError && <p className="px-5 pb-3 text-xs text-error">{fieldError}</p>}
      </div>

      {/* Profile */}
      <div className="bg-white border border-outline-variant">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-sm font-bold text-primary">Профайл</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Хувийн мэдээллээ шинэчлэх.</p>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              И-мэйл хаяг
            </label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              disabled
              className="w-full text-sm border border-outline-variant px-3 py-2 bg-surface-container text-on-surface-variant focus:outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Нууц үг солих
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full text-sm border border-outline-variant px-3 py-2 bg-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="px-5 pb-4 flex justify-end">
          <button className="bg-primary text-white text-sm font-semibold px-5 py-2 hover:bg-primary-container active:scale-[0.99] transition-all">
            Хадгалах
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-outline-variant">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-sm font-bold text-primary">Мэдэгдэл</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Системийн мэдэгдлүүдийг тохируулах.
          </p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface">И-мэйл мэдэгдэл</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Долоо хоногийн тайлан и-мэйлээр авах
            </p>
          </div>
          <button
            onClick={() => setEmailNotif((v) => !v)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              emailNotif ? 'bg-secondary' : 'bg-outline-variant'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${
                emailNotif ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
