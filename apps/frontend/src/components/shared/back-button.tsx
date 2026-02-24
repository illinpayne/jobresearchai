'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      size='lg'
      onClick={() => {
        router.back();
      }}>
      Go back
    </Button>
  );
}
