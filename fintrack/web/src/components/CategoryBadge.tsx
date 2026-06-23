import type { Category } from '../types';
import MdiIcon from './MdiIcon';
import styles from './CategoryBadge.module.css';

interface CategoryBadgeProps {
  category: Category | null | undefined;
  fallback?: string;
}

export default function CategoryBadge({ category, fallback = '–' }: CategoryBadgeProps) {
  if (!category) {
    return <span className={styles.placeholder}>{fallback}</span>;
  }
  return (
    <span className={styles.badge}>
      <MdiIcon name={category.icon} color={category.color} size={14} />
      <span className={styles.dot} style={{ background: category.color ?? undefined }} />
      {category.name}
    </span>
  );
}
