import { FC, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { adjustHSLColor } from '@/utils/color.util';
import { getCssVar } from '@/utils/css.util';

type ChartTrafficProps = {
  data: number[];
  labels: string[];
} & ComponentBaseProps;

const ChartTraffic: FC<ChartTrafficProps> = ({ className, data, labels }) => {
  const t = useTranslations();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'doughnut'> | null>(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const primaryColor = getCssVar('--primary').replaceAll(' ', ',');

      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [`hsl(${primaryColor})`, adjustHSLColor(`hsl(${primaryColor})`, 0, -10, 15)],
            },
          ],
        },
      });
    }
  }, [data, labels]);

  return (
    <Card className={classNames('chart-traffic', className)}>
      <CardHeader>
        <CardTitle>{t('statistic_traffic_sources')}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="relative h-72">
        <canvas ref={chartRef} />
      </CardContent>
    </Card>
  );
};

export default ChartTraffic;
