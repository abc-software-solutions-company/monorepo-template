import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import SwiperSlider from '@/components/swiper-slider';

import CategoriesAddNew from '@/assets/images/categories-add-new.png';
import CategoriesEdit from '@/assets/images/categories-edit.png';
import CategoriesList from '@/assets/images/categories-list.png';

const images = [
  {
    image: CategoriesList,
  },
  {
    image: CategoriesAddNew,
  },
  {
    image: CategoriesEdit,
  },
];

const FeatureCategories: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames('grid gap-4', className)}>
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis hic sint nobis cupiditate assumenda incidunt voluptatibus. Quasi quisquam
          assumenda saepe alias enim architecto corporis ipsam ex quos delectus esse modi, explicabo fugit ullam non provident illo mollitia.
        </p>
        <SwiperSlider items={images} groupName="categories" />
      </div>
    </div>
  );
};

export default FeatureCategories;
