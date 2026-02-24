import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Sign up to elevate your job search',
};

export default function SignUpPage() {
  return <RegisterForm />;
}
