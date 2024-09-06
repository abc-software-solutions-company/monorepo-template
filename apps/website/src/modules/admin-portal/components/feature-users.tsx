import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import SwiperSlider from '@/components/swiper-slider';

import UsersAddNew from '@/assets/images/users-add-new.png';
import UsersEdit from '@/assets/images/users-edit.png';
import UsersList from '@/assets/images/users-list.png';

const images = [
  {
    image: UsersList,
  },
  {
    image: UsersAddNew,
  },
  {
    image: UsersEdit,
  },
];

const FeatureUsers: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames('grid gap-4', className)}>
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis hic sint nobis cupiditate assumenda incidunt voluptatibus. Quasi quisquam
          assumenda saepe alias enim architecto corporis ipsam ex quos delectus esse modi, explicabo fugit ullam non provident illo mollitia.
        </p>
        <SwiperSlider items={images} groupName="users" />
      </div>
    </div>
  );
};

export default FeatureUsers;
