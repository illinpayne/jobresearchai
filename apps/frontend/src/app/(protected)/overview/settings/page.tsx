import ChangeEmailForm from '@/components/protected/accounts/change-email-form';
import ChangePasswordForm from '@/components/protected/accounts/change-password-form';
import ChangePersonalForm from '@/components/protected/accounts/change-personal-form';
import SubscriptionBanner from '@/components/protected/accounts/subscription-banner';

export default function SettingsPage() {
  return (
    <>
      <div>
        <h1 className='font-semibold text-2xl text-blue-900'>Personal info</h1>
        <p className='text-gray-600 text-sm'>Change your personal information or upload a new avatar for the profile!</p>
      </div>
      <div className='flex items-center justify-center w-full mt-10'>
        <div className='size-48 bg-red-500/10 rounded-full'></div>
      </div>
      <ChangePersonalForm />
      <div className='mt-10'>
        <h1 className='font-semibold text-2xl text-blue-900'>Password update form</h1>
        <p className='text-gray-600 text-sm'>Change your password with OTP verification, enter your email address</p>
      </div>
      <ChangePasswordForm />
      <br />
      <div className='mt-10'>
        <h1 className='font-semibold text-2xl text-blue-900'>Email update form</h1>
        <p className='text-gray-600 text-sm'>Change your email with OTP verification, enter your new email address</p>
      </div>
      <ChangeEmailForm />
      <br />
      <SubscriptionBanner />
    </>
  );
}
