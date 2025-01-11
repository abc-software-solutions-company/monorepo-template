import React, { FC } from 'react';
import classNames from 'classnames';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/react-web-ui-shadcn/components/ui/avatar';
import { getShortName } from '@repo/shared-universal/utils/string.util';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { UserEntity } from '@/modules/users/interfaces/users.interface';

type ProfileAvatarProps = {
  user: UserEntity;
} & ComponentBaseProps;

const ProfileAvatar: FC<ProfileAvatarProps> = ({ className, user }) => {
  const shortName = getShortName(user?.name);

  return (
    <div className={classNames(className)}>
      <Avatar className="size-24">
        <AvatarImage src={user.avatar} alt={shortName} />
        <AvatarFallback className="animate-gradient bg-[linear-gradient(-45deg,_#ee7752,_#e73c7e,_#23a6d5,_#23d5ab)] bg-[length:200%_200%] text-4xl font-bold text-white">
          {shortName}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
