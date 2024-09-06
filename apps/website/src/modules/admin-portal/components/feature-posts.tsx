import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import SwiperSlider from '@/components/swiper-slider';

import PostsAddNew from '@/assets/images/posts-add-new.png';
import PostsEdit from '@/assets/images/posts-edit.png';
import PostsList from '@/assets/images/posts-list.png';

const images = [
  {
    image: PostsList,
  },
  {
    image: PostsAddNew,
  },
  {
    image: PostsEdit,
  },
];

const FeaturePosts: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames('grid gap-4', className)}>
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Posts</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis hic sint nobis cupiditate assumenda incidunt voluptatibus. Quasi quisquam
          assumenda saepe alias enim architecto corporis ipsam ex quos delectus esse modi, explicabo fugit ullam non provident illo mollitia.
        </p>
        <SwiperSlider items={images} groupName="posts" />
      </div>
    </div>
  );
};

export default FeaturePosts;
