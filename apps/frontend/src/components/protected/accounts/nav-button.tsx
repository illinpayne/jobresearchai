'use client';

import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  children: ReactNode;
  activeClassName?: string;
  exact?: boolean;
  icon: ReactNode;
  isSelected?: boolean;
}

export const NavButton: React.FC<Props> = ({ className, children, icon, isSelected, ...props }) => {
  return (
    <Link
      {...props}
      className={cn(
        className,
        'rounded relative transition-all hover:bg-neutral-200/60 py-1.5 px-2.5 text-[15px] flex gap-3 font-medium text-neutral-900',
        isSelected &&
          'bg-primary/10 text-blue-800 hover:text-blue-800 hover:bg-primary/10 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:rounded-xl before:h-3.5 before:bg-blue-600 before:transition-all ',
      )}>
      {icon}
      {children}
    </Link>
  );
};
