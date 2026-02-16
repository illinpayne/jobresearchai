import { cn } from '@/lib/utils';

export interface WatermarkProps {
  name: string;
  className?: string;
}

export function Watermark({ name, className }: WatermarkProps) {
  return <h1 className={cn('text-[12px] text-gray-400 text-center', className)}>© 2026 {name}</h1>;
}
