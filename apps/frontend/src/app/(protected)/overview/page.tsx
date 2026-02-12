'use client';

import { useMe } from '@/api/hooks/useMe.hook';

export default function Dashboard() {
  const data = useMe();
  return <div>Dashboard: {data.data?.email}</div>;
}
