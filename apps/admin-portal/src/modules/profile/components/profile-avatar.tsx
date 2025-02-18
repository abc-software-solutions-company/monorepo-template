import { FC, useState } from 'react';
import classNames from 'classnames';
import { CameraIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import ModalCropImage from '@repo/react-web-ui-shadcn/components/modals/modal-crop-image';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/react-web-ui-shadcn/components/ui/avatar';
import { getShortName } from '@repo/shared-universal/utils/string.util';
import { useMutation } from '@tanstack/react-query';

import { IMAGE_AVATAR_URL } from '@/constants/file.constant';

import Uploader from '@/components/uploader';

import { useAuthState } from '@/modules/auth/states/auth.state';
import UserApi from '@/modules/users/api/users.api';

type ProfileAvatarProps = {
  className?: string;
};

const ProfileAvatar: FC<ProfileAvatarProps> = ({ className }) => {
  const { user, setUser } = useAuthState();
  const t = useTranslations();

  const [isVisibleCropper, setIsVisibleCropper] = useState(false);
  const shortName = getShortName(user?.name);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);

  const mutation = useMutation({
    mutationFn: async (blob: Blob) => await UserApi.changeAvatar(blob),
    onSuccess: resp => {
      if (!user) return;
      setUser({ ...user, avatar: resp.data.data.avatar + '?v=' + new Date().getTime() });
      toast(t('profile_change_avatar'), {
        description: t('profile_change_avatar_success'),
      });
    },
    onError: error => {
      toast(t('profile_change_avatar'), {
        description: t('profile_change_avatar_failure') + `<br />${error.message}`,
      });
    },
  });

  return (
    <div className={classNames(className)}>
      <Avatar className="size-32 overflow-hidden rounded-full border-3 border-white">
        <AvatarImage src={IMAGE_AVATAR_URL + user?.avatar} alt={shortName} />
        <AvatarFallback
          className={classNames(
            'rounded-full text-5xl font-bold text-white',
            'animate-gradient bg-[linear-gradient(-45deg,_#1255E5,_#1255E5)] bg-[length:400%_400%]'
          )}
        >
          {shortName}
        </AvatarFallback>
        <Uploader
          className="absolute bottom-0 left-0 w-full"
          accept="image/*"
          maxFileSize={1024 * 1024 * 0.5}
          triggerClassName="w-full flex items-center justify-center h-full p-1.5 bg-white/40"
          triggerContent={<CameraIcon color={'#fff'} size={20} />}
          onChange={file => {
            const reader = new FileReader();

            reader.onload = () => setImageSrc(reader.result);
            reader.readAsDataURL(file[0]);

            setIsVisibleCropper(true);
          }}
        />
      </Avatar>
      <ModalCropImage
        visible={isVisibleCropper}
        image={imageSrc as string}
        onClose={() => setIsVisibleCropper(false)}
        onCropComplete={blob => mutation.mutate(blob)}
      />
    </div>
  );
};

export default ProfileAvatar;
