import { Frown } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import BackButton from '../components/shared/back-button';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'Seems like we lost this page.',
};

export default function NotFoundPage() {
  return (
    <div className='flex items-center justify-center flex-col h-screen'>
      <div className='flex -translate-y-20'>
        <span className='text-[15rem] font-bold tracking-tight text-gray-300 -rotate-12 translate-x-4'>4</span>
        <Frown className='size-60 text-primary/60' />
        <span className='text-[15rem] font-bold tracking-tight text-gray-300 rotate-12 -translate-x-4'>4</span>
      </div>
      <div className='-translate-y-20 flex flex-col items-center'>
        <h2 className='text-4xl font-semibold mb-5'>Oops... Wrong page!</h2>
        <p>You were aiming for a page, but unleashed ancient chaos</p>
        <p>instead. Typical Pandora move.</p>
        <br />
        <BackButton />
        {/* <Link
          href={'/'}
          className={cn(buttonVariants({ size: 'lg' }), 'text-md')}>
          Go back!
        </Link> */}
      </div>
    </div>
  );
}
