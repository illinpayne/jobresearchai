import FaqSection from '@/components/root/main/faq';
import PricingSection from '@/components/root/main/pricing';
import QuickStartSection from '@/components/root/main/quickstart';
import WelcomeSection from '@/components/root/main/welcome';
import WhyweSection from '@/components/root/main/whywe';

export default function Home() {
  return (
    <div className='grid'>
      <WelcomeSection />
      <QuickStartSection />
      <WhyweSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
}
