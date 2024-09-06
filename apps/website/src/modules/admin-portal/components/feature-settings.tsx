import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import SwiperSlider from '@/components/swiper-slider';

import SettingsAccount from '@/assets/images/settings-account.png';
import SettingsAppearance from '@/assets/images/settings-appearance.png';
import SettingsNotifications from '@/assets/images/settings-notifications.png';

const images = [
  {
    image: SettingsAccount,
  },
  {
    image: SettingsAppearance,
  },
  {
    image: SettingsNotifications,
  },
];

const FeatureSettings: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames('grid gap-4', className)}>
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis hic sint nobis cupiditate assumenda incidunt voluptatibus. Quasi quisquam
          assumenda saepe alias enim architecto corporis ipsam ex quos delectus esse modi, explicabo fugit ullam non provident illo mollitia.
        </p>
        <SwiperSlider items={images} groupName="settings" />
      </div>
    </div>
  );
};

export default FeatureSettings;
