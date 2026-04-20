'use client';

import { Check } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface AiModel {
  name: string;
  description: string;
  shouldUpgrade?: boolean;
  isSelected?: boolean;
}

interface Props {
  model: AiModel;
  onSelectModel: (model: AiModel) => void;
  onUpgradeAction: () => void;
}

export default function AiModelRow({ model, onSelectModel, onUpgradeAction, ...props }: Props) {
  return (
    <DropdownMenuItem
      className={cn('flex items-center justify-between gap-4 relative, cursor-pointer')}
      onClick={() => {
        if (!model.shouldUpgrade) {
          onSelectModel(model);
        } else {
          onUpgradeAction();
        }
      }}>
      {model.shouldUpgrade && (
        <span className='rounded border border-blue-400 px-2 bg-blue-400/10 text-xs absolute top-2 right-2'>Upgrade</span>
      )}
      <div className='flex flex-col items-start gap-0.5'>
        <div className='flex justify-between gap-2 w-full'>
          <p className='font-medium'>{model.name}</p>
        </div>
        <p className='text-xs max-w-40 line-clamp-2'>{model.description}</p>
      </div>
      {model.isSelected && <Check className='size-4 text-blue-500' />}
    </DropdownMenuItem>
  );
}
