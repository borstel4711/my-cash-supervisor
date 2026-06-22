import styles from './DateRangeFilter.module.css';

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

function getQuickRanges(today: string) {
  const [y, m] = today.split('-').map(Number);
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    { label: 'Dieser Monat', range: { from: `${y}-${pad(m)}-01`, to: today } },
    {
      label: 'Letzter Monat',
      range: (() => {
        const pm = m === 1 ? 12 : m - 1;
        const py = m === 1 ? y - 1 : y;
        const last = new Date(py, pm, 0).getDate();
        return { from: `${py}-${pad(pm)}-01`, to: `${py}-${pad(pm)}-${pad(last)}` };
      })(),
    },
    {
      label: `Q${Math.ceil(m / 3)} ${y}`,
      range: (() => {
        const q = Math.ceil(m / 3);
        const qStart = (q - 1) * 3 + 1;
        return { from: `${y}-${pad(qStart)}-01`, to: today };
      })(),
    },
    { label: `${y}`, range: { from: `${y}-01-01`, to: `${y}-12-31` } },
    { label: `${y - 1}`, range: { from: `${y - 1}-01-01`, to: `${y - 1}-12-31` } },
  ];
}

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const today = new Date().toISOString().slice(0, 10);
  const quickRanges = getQuickRanges(today);

  return (
    <>
      <div className={styles.filterRow}>
        {quickRanges.map((qr) => (
          <button
            key={qr.label}
            type="button"
            className={`${styles.pill} ${
              value.from === qr.range.from && value.to === qr.range.to ? styles.pillActive : ''
            }`}
            onClick={() => onChange(qr.range)}
          >
            {qr.label}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.pill} ${!value.from && !value.to ? styles.pillActive : ''}`}
          onClick={() => onChange({ from: '', to: '' })}
        >
          Alle Daten
        </button>
      </div>

      <div className={styles.filterRow}>
        <input
          type="date"
          className="input inputSmall"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
        />
        <span className={styles.sep}>–</span>
        <input
          type="date"
          className="input inputSmall"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
        />
      </div>
    </>
  );
}
