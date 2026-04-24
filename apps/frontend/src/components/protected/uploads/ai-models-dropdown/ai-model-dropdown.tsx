import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { AiModelResponse } from '@/api/snapshots/ai/ai.dto';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import AiModelRow, { type AiModel } from './ai-model-row';

interface Props {
  currentSelectedModel?: AiModelResponse;
  models: AiModelResponse[];
  onSelectModel: (model: AiModel) => void;
  onUpgradeAction: () => void;
  isError?: boolean;
}

export function AiModels({ ...props }: Props) {
  function renderModels(models?: AiModelResponse[], selectedModel?: AiModelResponse) {
    if (models) {
      return props.models.map((model, i) => (
        <AiModelRow
          key={`${i}`}
          model={{ ...model, isSelected: model.name === props.currentSelectedModel?.name, shouldUpgrade: false }}
          onSelectModel={props.onSelectModel}
          onUpgradeAction={props.onUpgradeAction}
        />
      ));
    }
    return (
      <div className='grid gap-2 *:w-full *:h-12 *:min-w-40'>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  function renderSelectedModel(selectedModel?: AiModelResponse) {
    if (selectedModel) {
      return (
        <>
          <DropdownMenuGroup>
            <AiModelRow
              model={{ ...selectedModel, isSelected: true, shouldUpgrade: false }}
              onSelectModel={props.onSelectModel}
              onUpgradeAction={props.onUpgradeAction}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </>
      );
    }
    return (
      <div className='flex flex-col items-start gap-0.5 px-3 py-2 border rounded-sm bg-linear-to-bl from-rose-400/20 via-white to-white'>
        <div className='flex justify-between gap-2 w-full'>
          <p className='font-medium text-sm'>Model is not selected</p>
        </div>
        <p className='text-xs max-w-40 line-clamp-2'>Select a model to continue</p>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center gap-1 cursor-pointer outline-0! data-open:[&_svg]:rotate-180',
          props.isError && '*:text-red-600!',
        )}>
        <p className='select-none'>{props.currentSelectedModel?.name ?? 'Select a model'}</p>
        <ChevronDown className='size-4 text-neutral-500 transition-all' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        side='bottom'>
        {renderSelectedModel(props.currentSelectedModel)}
        {renderModels(props.models, props.currentSelectedModel)}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={ROUTES.OVERVIEW.AI}>
            <DropdownMenuItem>
              More models
              <ChevronRight className='ml-auto' />
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
