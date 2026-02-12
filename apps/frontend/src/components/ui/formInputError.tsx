'use client';

import type { ReactNode } from 'react';

export function FormInputError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className='text-sm w-full text-red-500'>{children}</p>;
}
