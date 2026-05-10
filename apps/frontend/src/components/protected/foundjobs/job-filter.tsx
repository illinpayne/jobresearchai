'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import type { JobFilterDto } from '@/api/dtos/job-filter.dto';
import type { JobFilterDtoResponse } from '@/api/generated';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import ExpectedSalarySlider from './expected-salary-slider';

export const positions = ['IT', 'Media Buyer', 'Agronomic', 'Air Forces', 'Software Development'];
export const locations = ['Remote', 'Kyiv', 'Rivne', 'Lviv'];
export const services = ['Work ua', 'Robota ua', 'Djinni', 'Upwork'];

export const schema = z.object({
  positions: z.array(z.string()),
  locations: z.array(z.string()),
  services: z.array(z.string()),
  expectedSalary: z.object({
    from: z.number().min(0),
    to: z.number().min(0),
  }),
});

export type Values = z.infer<typeof schema>;

interface Props {
  filter: JobFilterDto;
  defaultFilters: JobFilterDtoResponse;
}

export default function JobFilter({ filter, defaultFilters }: Props) {
  const [expand, setExpand] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleSubmit, control, formState, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      positions: filter.positions ?? [],
      locations: filter.locations ?? [],
      services: filter.services ?? [],
      expectedSalary: { from: filter.salaryFrom ?? defaultFilters.salaryFrom, to: filter.salaryTo ?? defaultFilters.salaryTo },
    },
  });

  const onSubmit = (data: Values) => {
    const params = new URLSearchParams();

    if (data.positions.length) params.set('positions', data.positions.join(','));
    if (data.locations.length) params.set('locations', data.locations.join(','));
    if (data.services.length) params.set('services', data.services.join(','));

    if (data.expectedSalary.from > 0 && data.expectedSalary.from !== defaultFilters.salaryFrom)
      params.set('salaryFrom', data.expectedSalary.from.toString());
    if (data.expectedSalary.to > 0 && data.expectedSalary.to !== defaultFilters.salaryTo)
      params.set('salaryTo', data.expectedSalary.to.toString());

    params.set('page', '1');
    params.set('limit', searchParams.get('limit') || '10');

    reset({
      positions: data.positions,
      locations: data.locations,
      services: data.services,
      expectedSalary: data.expectedSalary,
    });

    console.log('push');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Button
        variant={'outline'}
        className='fixed z-50 bottom-3 right-3 w-min ml-auto bg-white/80 backdrop-blur-xs xl:hidden'
        onClick={() => {
          setExpand(!expand);
        }}>
        {expand ? <ChevronUp className='size-5' /> : <ChevronDown className='size-5' />}
      </Button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('overflow-hidden sticky top-10', expand ? 'h-fit mb-10' : 'max-xl:h-0 max-xl:mb-0')}>
        <div className='border rounded-lg  flex flex-col max-h-[70vh] bg-white/90 backdrop-blur-xs overflow-y-auto overflow-x-hidden xl:top-10 max-xl:max-h-[50vh] max-xl:top-5'>
          <h1 className='text-lg font-medium sticky top-0 bg-white/80 backdrop-blur-xs px-5 py-2 z-10'>Position</h1>
          <div className='grid *:flex *:items-center *:gap-2 px-5 pb-4 pt-2 border-b'>
            {defaultFilters.positions.map((pos, i) => (
              <div key={i}>
                <Controller
                  control={control}
                  name='positions'
                  render={({ field }) => (
                    <Checkbox
                      id={pos}
                      className='size-5'
                      checked={field.value && field.value.includes(pos)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked ? [...field.value, pos] : field.value.filter((val) => val !== pos);
                        field.onChange(updatedValue);
                      }}
                    />
                  )}
                />
                <label htmlFor='position'>{pos}</label>
              </div>
            ))}
          </div>
          <h1 className='text-lg font-medium sticky top-0 bg-white/80 backdrop-blur-xs px-5 py-2 z-10'>Expected salary</h1>
          <div className='grid gap-2 px-5 pb-4 pt-2 border-b'>
            <Controller
              control={control}
              name='expectedSalary'
              render={({ field }) => (
                <ExpectedSalarySlider
                  from={defaultFilters.salaryFrom}
                  to={defaultFilters.salaryTo}
                  value={[field.value.from, field.value.to]}
                  onValueChange={([from, to]) => field.onChange({ from, to })}
                />
              )}
            />
          </div>
          <h1 className='text-lg font-medium sticky top-0 bg-white/80 backdrop-blur-xs px-5 py-2 z-10'>Location</h1>
          <div className='grid *:flex *:items-center *:gap-2 px-5 pb-4 pt-2 border-b'>
            {defaultFilters.locations.map((loc, i) => (
              <div key={i}>
                <Controller
                  control={control}
                  name='locations'
                  render={({ field }) => (
                    <Checkbox
                      id={loc}
                      className='size-5'
                      checked={field.value?.includes(loc)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked ? [...field.value, loc] : field.value.filter((val) => val !== loc);
                        field.onChange(updatedValue);
                      }}
                    />
                  )}
                />
                <label htmlFor='locations'>{loc}</label>
              </div>
            ))}
          </div>
          <h1 className='text-lg font-medium sticky top-0 bg-white/80 backdrop-blur-xs px-5 py-2 z-10'>Service</h1>
          <div className='grid *:flex *:items-center *:gap-2 px-5 pb-4 pt-2'>
            {defaultFilters.services.map((serv, i) => (
              <div key={i}>
                <Controller
                  control={control}
                  name='services'
                  render={({ field }) => (
                    <Checkbox
                      id={serv}
                      className='size-5'
                      checked={field.value.includes(serv)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked ? [...field.value, serv] : field.value.filter((val) => val !== serv);
                        field.onChange(updatedValue);
                      }}
                    />
                  )}
                />
                <label htmlFor='services capitalize'>{serv}</label>
              </div>
            ))}
          </div>
          {formState.isDirty && (
            <div
              className={cn('px-4 flex justify-end gap-3 py-2 border-t sticky bottom-0 bg-white/80 backdrop-blur-xs transition-all z-50')}>
              <Button
                type='button'
                variant={'outline'}
                onClick={() => reset()}>
                Reset
              </Button>
              <Button
                type='submit'
                className='active:bg-blue-700'>
                Apply
              </Button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
