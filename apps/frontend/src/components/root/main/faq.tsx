import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { jobSearchFaqs } from '@/constants/faq';

export default function FaqSection() {
  return (
    <section
      className='[clip-path:polygon(0_0,100%_5%,100%_100%,0_100%)] font-nunito-sans mx-auto bg-black text-white w-280 p-10 xs:w-auto lg:w-200 2xl:w-280'
      id='faq'>
      <h1 className='font-bold text-4xl'>Questions?</h1>
      <p className='text-neutral-200 font-medium'>
        We have answers. Read our full list of common questions and answers for specific Jira pricing and licensing.
      </p>
      <Accordion
        type='single'
        collapsible
        defaultValue='shipping'
        className='mt-10'>
        {jobSearchFaqs.map((f, i) => (
          <AccordionItem
            value={f.question}
            key={`acc_${f.question}`}>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
