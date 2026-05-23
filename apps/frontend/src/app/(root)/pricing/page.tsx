import type { Metadata } from 'next';
import BundleWrapper from './bundle-wrapper';
import PricingWrapper from './pricing-wrapper';

export const metadata: Metadata = {
  title: 'Pricing',
};

export default async function PricingPage() {
  return (
    <main className='bg-zinc-50'>
      <div className='w-full px-4 py-20'>
        <section className='mx-auto mb-5 max-w-xl text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-zinc-900'>Simple, transparent pricing</h1>
          <p className='mt-4 text-base text-zinc-500'>Pick a plan that fits your workflow. Select any model which you want.</p>
        </section>
        <PricingWrapper />
      </div>
      <div className='px-20'>
        <div className='w-full px-4 py-20 bg-blue-800 [clip-path:polygon(3%_2%,100%_0,98%_99%,0_100%)]'>
          <section className='mx-auto mb-5 max-w-xl text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-zinc-100'>Bundles & Extras</h1>
            <p className='mt-4 text-base text-blue-200'>Pick a bundle that fits for your intentions. Get extra credits almost for free.</p>
          </section>
          <BundleWrapper />
        </div>
      </div>
    </main>
  );
}
