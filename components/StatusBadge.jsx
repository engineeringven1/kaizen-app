import { cn } from '@/lib/utils';

const toneMap = {
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  danger: 'badge badge-danger',
  info: 'badge badge-info',
  neutral: 'badge badge-neutral'
};

export default function StatusBadge({ status }) {
  return <span className={cn(toneMap[status.tone] || toneMap.neutral)}>{status.label}</span>;
}
