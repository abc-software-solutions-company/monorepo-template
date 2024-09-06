import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import SwiperSlider from '@/components/swiper-slider';

import ContentsAddNew from '@/assets/images/contents-add-new.png';
import ContentsEdit from '@/assets/images/contents-edit.png';
import ContentsList from '@/assets/images/contents-list.png';

const images = [
  {
    image: ContentsList,
  },
  {
    image: ContentsAddNew,
  },
  {
    image: ContentsEdit,
  },
];

const FeatureContents: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames('grid gap-4', className)}>
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Contents</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis hic sint nobis cupiditate assumenda incidunt voluptatibus. Quasi quisquam
          assumenda saepe alias enim architecto corporis ipsam ex quos delectus esse modi, explicabo fugit ullam non provident illo mollitia.
        </p>
        <SwiperSlider items={images} groupName="contents" />
      </div>
    </div>
  );
};

export default FeatureContents;
