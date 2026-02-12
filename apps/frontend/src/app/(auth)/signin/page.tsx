import type { Metadata } from 'next';
import { LoginForm } from '@/app/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign into your account',
};

export default function SigninPage() {
  return <LoginForm />;
}
