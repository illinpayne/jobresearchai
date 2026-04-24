'use client';

import { useEffect, useState } from 'react';
import { useMe } from '@/api/hooks/useMe.hook';

export function DynamicGreeting() {
  const { data: user } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <h1 className='font-borel text-5xl font-medium min-h-15 opacity-0'>Loading...</h1>;
  }

  const hour = new Date().getHours();
  const identifier = user ? user.firstName : 'who?';

  let text = `Good evening, ${identifier}`;
  if (hour >= 0 && hour < 5) text = `Tonight's the night, ${identifier}`;
  else if (hour < 12) text = `Good morning, ${identifier}`;
  else if (hour < 17) text = `Afternoon, ${identifier}`;

  return (
    <h1 className='font-borel text-5xl font-medium text-transparent bg-clip-text bg-linear-to-r leading-20 from-blue-700 to-emerald-800 min-h-15 transition-opacity duration-500'>
      {text}
    </h1>
  );
}
