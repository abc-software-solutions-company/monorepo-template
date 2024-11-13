import React, { FC } from 'react';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import ChartAudience from './chart-audience';
import ChartConversions from './chart-conversions';
import ChartTraffic from './chart-traffic';
import Statistics from './statistics';

const DashboardRoot: FC<ComponentBaseProps> = ({ className }) => {
  const t = useTranslations();

  return (
    <div className={classNames('dashboard overflow-hidden', className)}>
      <Statistics />
      <ChartAudience
        className="mt-4"
        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        data={[{ label: 'Customers', data: [0, 10, 5, 15, 10, 20, 15, 25, 20, 30, 25, 40], yAxisID: 'yAxisOne' }]}
      />
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-9">
          <ChartConversions
            labels={['Feb 1', 'Feb 2', 'Feb 3', 'Feb 4', 'Feb 5', 'Feb 6', 'Feb 7', 'Feb 8', 'Feb 9', 'Feb 10']}
            data={[
              { label: '2024', data: [12, 15, 8, 11, 12, 16, 13, 11, 14, 19], categoryPercentage: 0.5, barPercentage: 0.35 },
              { label: '2023', data: [8, 7, 8, 3, 4, 7, 3, 7, 5, 7], categoryPercentage: 0.5, barPercentage: 0.35, hidden: true },
            ]}
          />
        </div>
        <div className="col-span-12 xl:col-span-3">
          <ChartTraffic className="" labels={[t('statistic_traffic_direct'), t('statistic_traffic_referral')]} data={[60, 10]} />
        </div>
      </div>
    </div>
  );
};

export default DashboardRoot;
