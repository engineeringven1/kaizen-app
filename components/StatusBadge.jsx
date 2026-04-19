import { cn } from '@/lib/utils';

const toneMap = {
  success:  'badge badge-success',
  warning:  'badge badge-warning',
  warning2: 'badge badge-warning2',
  danger:   'badge badge-danger',
  info:     'badge badge-info',
  neutral:  'badge badge-neutral'
};

export default function StatusBadge({ status }) {
  const safeStatus = status || { label: 'Sin estado', tone: 'neutral' };
  return <span className={cn(toneMap[safeStatus.tone] || toneMap.neutral)}>{safeStatus.label}</span>;
}