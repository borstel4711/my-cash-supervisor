import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api';
import type { Category } from '../types';
import MdiIcon from '../components/MdiIcon';
import styles from './Categories.module.css';

const MODES: Category['mode'][] = ['recurring', 'one_time'];
const MODE_LABELS: Record<Category['mode'], string> = {
  recurring: 'Wiederkehrend',
  one_time: 'Einmalig',
};

const emptyForm = {
  name: '',
  color: '#2563eb',
  icon: '',
  mode: 'recurring' as Category['mode'],
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => api.get<Category[]>('/categories').then(setCategories).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form, icon: form.icon || null };
    if (editingId !== null) {
      await api.patch(`/categories/${editingId}`, payload);
    } else {
      await api.post('/categories', payload);
    }
    cancelEdit();
    load();
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, color: c.color ?? '#2563eb', icon: c.icon ?? '', mode: c.mode });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const remove = async (id: number) => {
    await api.delete(`/categories/${id}`);
    if (editingId === id) cancelEdit();
    load();
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Kategorien</h2>
      <form onSubmit={submit} className={`card ${styles.form}`}>
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value as Category['mode'] })}
        >
          {MODES.map((m) => (
            <option key={m} value={m}>
              {MODE_LABELS[m]}
            </option>
          ))}
        </select>
        <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        <span className={styles.iconInputGroup}>
          <input
            className="input"
            placeholder="mdi-icon-name"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
          <MdiIcon name={form.icon} color={form.color} />
        </span>
        <button type="submit" className="button buttonPrimary">
          <MdiIcon name={editingId !== null ? 'content-save-outline' : 'plus'} color="#ffffff" size={16} />
          {editingId !== null ? 'Speichern' : 'Hinzufügen'}
        </button>
        {editingId !== null && (
          <button type="button" className="button buttonSecondary" onClick={cancelEdit}>
            Abbrechen
          </button>
        )}
      </form>

      <ul className={`cardFlush ${styles.list}`}>
        {categories.map((c) => (
          <li key={c.id} className={styles.listItem}>
            <span className={styles.nameRow}>
              <span className={styles.colorDot} style={{ background: c.color ?? undefined }} />
              <MdiIcon name={c.icon} color={c.color} />
              {c.name} <span className={styles.meta}>({MODE_LABELS[c.mode]})</span>
            </span>
            <span className={styles.actions}>
              <button className="iconButton" title="Bearbeiten" aria-label="Bearbeiten" onClick={() => startEdit(c)}>
                <MdiIcon name="pencil-outline" variant="accent" />
              </button>
              <button className="iconButton" title="Löschen" aria-label="Löschen" onClick={() => remove(c.id)}>
                <MdiIcon name="delete-outline" variant="danger" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
