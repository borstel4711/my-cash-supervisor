import { useTheme } from '../ThemeContext';

const VARIANT_COLORS = {
  dark: { accent: '#3b82f6', danger: '#ef4444', muted: '#94a3b8' },
  light: { accent: '#2563eb', danger: '#dc2626', muted: '#6b7280' },
};

type IconVariant = keyof typeof VARIANT_COLORS.dark;

interface MdiIconProps {
  name: string | null | undefined;
  color?: string | null;
  variant?: IconVariant;
  size?: number;
  className?: string;
}

export default function MdiIcon({ name, color, variant, size = 18, className }: MdiIconProps) {
  const { theme } = useTheme();
  if (!name) return null;
  const iconName = name.trim().replace(/^mdi:/, '');
  if (!iconName) return null;
  const resolvedColor = color ?? (variant ? VARIANT_COLORS[theme][variant] : null);
  const params = resolvedColor ? `?color=${encodeURIComponent(resolvedColor)}` : '';
  const src = `https://api.iconify.design/mdi:${iconName}.svg${params}`;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}
