/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import NextImage from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useChangeAvatar } from '@/api/hooks/useChangeAvatar.hook';
import { useMe } from '@/api/hooks/useMe.hook';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryKeys } from '@/constants';
import { InvalidateAccountCache } from '@/lib/cache';
import { cn, getCroppedImg, getImage } from '@/lib/utils';
import { AvatarFallback } from '../overview-sidebar/avatar-fallback';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const AvatarSchema = z.object({
  avatar: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
});

export type AvatarValues = z.infer<typeof AvatarSchema>;

export default function UpdateAvatarForm() {
  const queryClient = useQueryClient();

  const { data: user } = useMe();
  const { mutateAsync } = useChangeAvatar({
    onSuccess(data) {
      queryClient.setQueryData([QueryKeys.MyAccount], data);
      InvalidateAccountCache(data);
    },
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: AvatarValues) => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc!, croppedAreaPixels);

      const formData = new FormData();
      formData.append('avatar', croppedBlob, 'avatar.webp');

      await mutateAsync(formData);
      const { toast } = await import('sonner');
      toast.info('Avatar has been updated, wait some time for update to take effect.');
    } catch (error: any) {
      const { toast } = await import('sonner');
      toast.error(error.response?.data?.message ?? 'Upload failed, try again later.');
    }
    setImageSrc(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validation = AvatarSchema.shape.avatar.safeParse(file);

      if (!validation.success) {
        const { toast } = await import('sonner');
        toast.error('Image size must be less than 5MB.');
        return;
      }
      setValue('avatar', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const src = reader.result as string;
        setImageSrc(src);
      };
    }
  };

  const onCropComplete = useCallback((_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AvatarValues>({
    resolver: zodResolver(AvatarSchema),
  });

  if (!user || !mounted) {
    return (
      <div className='max-w-md mx-auto py-4'>
        <Skeleton className='size-50 rounded-full' />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='py-4 w-full'>
      {!imageSrc ? (
        <div className='flex justify-center'>
          <label
            htmlFor='avatar-upload'
            className={cn(
              'flex flex-col size-50 rounded-full overflow-hidden relative bg-neutral-200 hover:bg-neutral-300 transition-all cursor-pointer',
              errors.avatar?.message && 'outline-4 outline-red-500/50',
            )}>
            {user.avatar ? (
              <Avatar className='size-full absolute'>
                <AvatarImage
                  src={getImage(user.avatar)}
                  alt={user?.firstName}
                />
                <AvatarFallback
                  initials={`${user.firstName[0]}${user.secondName[0]}`}
                  className='text-5xl hover:bg-blue-600'
                />
              </Avatar>
            ) : (
              <div className='bg-primary size-full flex items-center justify-center text-white text-8xl font-bold'>{user.firstName[0]}</div>
            )}
          </label>
          <input
            type='file'
            accept='image/*'
            hidden
            id='avatar-upload'
            onChange={onFileChange}
            className='file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          />
        </div>
      ) : (
        <div className='space-y-4 w-full'>
          <div className='relative w-full h-80 bg-black rounded-lg overflow-hidden'>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape='round'
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='submit'>Apply</Button>
          </div>
        </div>
      )}
    </form>
  );
}
