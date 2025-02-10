import { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

type ProfileCoverProps = {
  user: UserEntity;
} & ComponentBaseProps;

const ProfileCover: FC<ProfileCoverProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        'relative h-32 grow rounded-t-lg bg-[url("@/assets/images/cover-bg.jpg")] bg-[length:100%] bg-center',
        'animate-gradient bg-[linear-gradient(-45deg,_#1255E5,_#1255E5)] bg-[length:400%_400%]',
        className
      )}
    ></div>
  );
};

export default ProfileCover;
