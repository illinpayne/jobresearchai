import type { Metadata } from 'next';
import ChangeEmailForm from '@/components/protected/accounts/change-email-form';
import ChangePasswordForm from '@/components/protected/accounts/change-password-form';
import ChangePersonalForm from '@/components/protected/accounts/change-personal-form';
import SubscriptionBanner from '@/components/protected/accounts/subscription-banner';
import UpdateAvatarForm from '@/components/protected/accounts/update-avatar-form';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl'>Personal info</h1>
        <p className='text-gray-600 text-sm'>Change your personal information or upload a new avatar for the profile!</p>
      </div>
      <UpdateAvatarForm />
      <ChangePersonalForm />
      <div className='mt-10'>
        <h1 className='font-semibold text-2xl'>Password update form</h1>
        <p className='text-gray-600 text-sm'>Change your password with OTP verification, enter your email address</p>
      </div>
      <ChangePasswordForm />
      <br />
      <div className='mt-10'>
        <h1 className='font-semibold text-2xl'>Email update form</h1>
        <p className='text-gray-600 text-sm'>Change your email with OTP verification, enter your new email address</p>
      </div>
      <ChangeEmailForm />
      <br />
      <SubscriptionBanner />
    </>
  );
}
