import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AiDataWrapper from './data-wrapper';

export const metadata: Metadata = {
  title: 'Exlore AI models',
};

export default async function AiPage() {
  return (
    <div className='pb-30 relative'>
      <div className='bg-linear-to-b from-orange-400/15 via-white to-white h-[50vh] absolute top-0 w-full -z-10'></div>
      <section className='grid w-[90%] mx-auto xs:w-auto lg:w-[90%] xl:w-[90%] 2xl:w-[80%] z-10 max-2xl:px-5'>
        <div className='py-40'>
          <h1 className='text-4xl font-nunito-sans font-bold'>Explore AI models, find jobs in minutes</h1>
          <p className='text-xl text-neutral-600 mt-3'>Bridging the gap between talent and opportunity by using AI-driven insights</p>
          <p className='text-xl text-neutral-600'>to find more related roles and secure offers faster than traditional searching.</p>
        </div>
        <AiDataWrapper />
      </section>
    </div>
  );
}
