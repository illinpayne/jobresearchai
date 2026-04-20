import { AvatarFallback as AF } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Props {
  initials: string;
  className?: string;
}

export function AvatarFallback({ initials, className }: Props) {
  return <AF className={cn('rounded-lg bg-blue-500 font-medium text-white', className)}>{initials}</AF>;
}
