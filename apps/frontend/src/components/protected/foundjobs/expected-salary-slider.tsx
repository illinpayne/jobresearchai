'use client';
import { Slider } from '@/components/ui/slider';

interface Props {
  from: number;
  to: number;
  value?: number[] | undefined;
  onValueChange?(value: number[]): void;
}

export default function ExpectedSalarySlider({ ...props }: Props) {
  return (
    <>
      {props.value && (
        <div className='flex justify-between items-center w-full'>
          <p>{props.value[0].toLocaleString('uk-UA')} грн</p>
          <p>{props.value[1].toLocaleString('uk-UA')} грн</p>
        </div>
      )}
      <Slider
        defaultValue={[props.from, props.to]}
        min={props.from}
        max={props.to}
        step={5000}
        value={props.value}
        onValueChange={props.onValueChange}
        className='mx-auto w-full'
      />
    </>
  );
}
