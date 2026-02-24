'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface IHeaderButtonProps {
  children: React.ReactNode;
  title: string;
  href: string;
  isSelected?: boolean;
}

export const HeaderButton: React.FC<IHeaderButtonProps> = ({ isSelected, ...props }) => {
  return (
    <li className='text-gray-700 flex flex-col items-center'>
      <Link href={props.href}>
        <button
          className={cn(
            'rounded hover:bg-gray-200 p-2 px-2.5 transition-all cursor-pointer',
            isSelected && 'text-blue-700 bg-blue-700/10',
          )}>
          {props.children}
        </button>
      </Link>
      <p className='text-2sm font-medium text-center text-gray-800 mt-1 whitespace-break-spaces line-clamp-2 '>{props.title}</p>
    </li>
  );
};
