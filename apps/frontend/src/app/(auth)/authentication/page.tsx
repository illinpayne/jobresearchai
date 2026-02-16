import type { Metadata } from 'next';
import Link from 'next/link';
import AuthenticationLoader from '@/app/components/auth/authentication-loader';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Redirecting to the dashboard',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AuthenticationPage(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const token = params.token as string;

  if (!token) {
    return (
      <div className='h-screen flex justify-center items-center bg-white-200'>
        <div className='mx-auto flex flex-col items-start gap-4'>
          <h2 className='text-2xl font-semibold'>We cannot authenticate you!</h2>
          <p className='text-neutral-800 *:block'>
            <span>It seems that the provided token is not found or valid</span>
            <span>Try to sign into your account again, OR</span>
            <span>Sign up with the new account using standart methods or OAuth</span>
          </p>
          <br />
          <Link
            href={'/signin'}
            className={cn(buttonVariants())}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return <AuthenticationLoader token={token} />;
}
