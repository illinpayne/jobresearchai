import { ForgotPasswordForm } from '@/app/components/auth/forgot-password-form'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset password to regain access to your account',
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordForm />;
}