import { FC, useState } from 'react';
import classNames from 'classnames';
import { CameraIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~react-web-ui-shadcn/components/ui/avatar';
import { getShortName } from '~shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import ModalCropImage from '@/components/modals/modal-crop-image';
import Uploader from '@/components/uploader';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

type ProfileAvatarProps = {
  user: UserEntity;
} & ComponentBaseProps;

const ProfileAvatar: FC<ProfileAvatarProps> = ({ className, user }) => {
  const [isVisibleCropper, setIsVisibleCropper] = useState(false);
  const shortName = getShortName(user?.name);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);

  return (
    <div className={classNames(className)}>
      <Avatar className="size-32 overflow-hidden rounded-full border-3 border-white">
        <AvatarImage src={`${import.meta.env.VITE_PUBLIC_API_URL}/${user.avatar}`} alt={shortName} />
        <AvatarFallback
          className={classNames(
            'rounded-full text-5xl font-bold text-white',
            'animate-gradient bg-[linear-gradient(-45deg,_#22c370,_#fdbb2d)] bg-[length:200%_200%]'
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
      <ModalCropImage visible={isVisibleCropper} image={imageSrc as string} onClose={() => setIsVisibleCropper(false)} />
    </div>
  );
};

export default ProfileAvatar;
