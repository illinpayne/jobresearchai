import type { Metadata } from 'next';
import NewForm from '@/components/protected/uploads/forms/new-form';

export const metadata: Metadata = {
  title: 'New resume',
};

export default function UploadResumePage() {
  return <NewForm />;
}
