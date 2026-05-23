/** biome-ignore-all lint/complexity/noUselessFragments: <explanation> */
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useBillingPlans } from '@/api/hooks/useBillingPlans.hook';
import { useCurrentSubscription } from '@/api/hooks/useCurrentSubscription.hook';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

interface PricingTier {
  tier: number;
  label: string;
  name: string;
  price?: string;
  current?: boolean;
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-xl border border-border bg-white p-6', className)}>{children}</div>;
}

function TierCard({ label, name, price, current }: PricingTier) {
  return (
    <div
      className={cn(
        'flex-1 rounded-lg border p-4 transition-colors',
        current ? ' text-blue-500 border-blue-500' : 'bg-background text-foreground border-border hover:border-muted-foreground/40',
      )}>
      <p className={cn('text-xs mb-1', current ? 'text-blue-600' : 'text-muted-foreground')}>{label}</p>
      <p className='font-semibold text-base leading-tight'>{name}</p>
      <p className={cn('text-sm mt-0.5', current ? 'text-blue-500/80' : 'text-muted-foreground')}>{price}</p>
    </div>
  );
}

function CreditsSkeleton() {
  return (
    <Section>
      <div className='flex items-start justify-between mb-4 w-full'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-12 w-48' />
          <Skeleton className='h-4 w-56' />
        </div>
        <Skeleton className='h-8 w-24 rounded-md' />
      </div>
      <Skeleton className='h-2.5 w-full mt-2 rounded-full' />
      <div className='flex justify-between mt-1.5'>
        <Skeleton className='h-3 w-4' />
        <Skeleton className='h-3 w-16' />
        <Skeleton className='h-3 w-8' />
      </div>
    </Section>
  );
}

function PlanSkeleton() {
  return (
    <Section>
      <div className='flex items-center justify-between mb-5'>
        <div className='space-y-1.5'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-7 w-40' />
        </div>
        <Skeleton className='h-8 w-36 rounded-md' />
      </div>
      <div className='flex gap-3'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='flex-1 rounded-lg border border-border p-4 space-y-2'>
            <Skeleton className='h-3 w-12' />
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-4 w-14' />
          </div>
        ))}
      </div>
    </Section>
  );
}

interface ColoredProgressProps {
  value: number;
  className?: string;
}

export function ColoredProgress({ value, className }: ColoredProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const indicatorColor = clamped >= 90 ? 'bg-red-500' : clamped >= 80 ? 'bg-orange-500' : 'bg-primary';

  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-blue-500/20', className)}>
      <div
        className={cn('h-full rounded-full transition-all', indicatorColor)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default function UsageDataWrapper() {
  const [mounted, setMounted] = useState(false);
  const { data: sub, isLoading } = useCurrentSubscription();
  const { data: plans } = useBillingPlans();

  function getUsage(a: number, b: number): number {
    if (b === 0) {
      return 0;
    }

    const used = b - a;
    const usagePercentage = (used / b) * 100;

    return Number(Math.max(0, usagePercentage).toFixed(0));
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !sub) {
    return (
      <>
        <div className='mx-auto max-w-4xl space-y-6'>
          <CreditsSkeleton />
          <PlanSkeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <Section>
        <div className='flex items-start justify-between mb-4'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Credits remaining</p>
            <div className='flex items-baseline gap-1'>
              <span
                className={cn(
                  'text-5xl font-bold tabular-nums relative',
                  sub.credits > sub.plan.grantedCredits ? 'text-blue-600' : 'text-',
                )}>
                {sub.credits}
              </span>
              <span className='text-xl text-muted-foreground'>
                / {sub?.plan?.grantedCredits}
                ,00 <span className='text-xs'></span>
              </span>
            </div>
          </div>
          <Link
            href={ROUTES.PRICING}
            className={cn('mt-1', buttonVariants({ variant: 'default', size: 'sm' }))}>
            Buy credits
          </Link>
        </div>
        <ColoredProgress
          value={getUsage(sub.credits, sub.plan.grantedCredits)}
          className='h-2.5 mt-2'
        />
        <div className='flex justify-between mt-1.5 text-xs text-muted-foreground'>
          <span className='font-medium'>{getUsage(sub.credits, sub.plan.grantedCredits)}% used</span>
          <span>
            {sub?.plan.grantedCredits},00 / {sub.plan.name === 'Free' ? 'all' : 'month'}
          </span>
        </div>
      </Section>

      <Section>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <p className='text-xs text-muted-foreground uppercase tracking-wider mb-0.5'>Current plan</p>
            <p className='text-xl font-bold'>
              {sub.plan.name} — ${sub.plan.monthlyPrice},00/month
            </p>
          </div>
          {sub.plan.name.toLocaleLowerCase() !== 'ultimate' && (
            <Link
              href={ROUTES.PRICING}
              className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}>
              Get new tierd
            </Link>
          )}
        </div>
        <div className='flex gap-3'>
          <TierCard
            current={sub.plan.name === 'Free'}
            price={`$0 / mo`}
            tier={1}
            label={'Tier 1'}
            name={'Free'}
          />
          {plans?.plans.map((plan, i) => (
            <TierCard
              key={plan.id}
              current={plan.name === sub.plan.name}
              price={`${plan.monthlyPrice} / mo`}
              tier={i + 1}
              label={`Tier ${i + 2}`}
              name={plan.name}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
