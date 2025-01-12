import { FC, useEffect, useRef, useState } from 'react';
import Chart, { ChartDataset } from 'chart.js/auto';
import classNames from 'classnames';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { getCssVar } from '@/utils/css.util';

type ChartAudienceProps = {
  data: ChartDataset[];
  labels: string[];
} & ComponentBaseProps;

const ChartAudience: FC<ChartAudienceProps> = ({ className, data, labels }) => {
  const t = useTranslations();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (chartInstance.current) {
      const datasets = chartInstance.current.data.datasets;

      const activeDatasetIndex = datasets.findIndex(dataset => !dataset.hidden);
      const activeDataset = datasets[activeDatasetIndex];
      let backupDataset = datasets.find(dataset => dataset.order === 1000);

      if (!backupDataset) {
        backupDataset = { ...activeDataset, order: 1000, hidden: true };
        datasets.push(backupDataset);
      }

      const sourceDataset = datasets[activeIndex] === activeDataset ? backupDataset : datasets[activeIndex];

      datasets[0] = Object.assign(activeDataset, { ...sourceDataset, hidden: undefined, order: undefined });

      chartInstance.current.update();
    }
  }, [activeIndex]);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const primaryColor = getCssVar('--primary').replaceAll(' ', ',');
      const foregroundColor = getCssVar('--foreground').replaceAll(' ', ',');
      const borderColor = getCssVar('--border').replaceAll(' ', ',');

      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{ ...data[0], borderColor: `hsl(${primaryColor})` }],
        },
        options: {
          scales: {
            x: {
              ticks: {
                color: `hsl(${foregroundColor})`,
              },
            },
            yAxisOne: {
              display: 'auto',
              ticks: {
                color: `hsl(${foregroundColor})`,
                callback: function (value) {
                  return value + 'k';
                },
              },
              grid: {
                color: `hsl(${borderColor})`,
              },
            },
            yAxisTwo: {
              display: 'auto',
              ticks: {
                color: `hsl(${foregroundColor})`,
                callback: function (value) {
                  return value + '%';
                },
              },
              grid: {
                color: `hsl(${borderColor})`,
              },
            },
          },
        },
      });
    }
  }, [data, labels]);

  return (
    <Card className={classNames('chart-audience relative', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('statistic_audience')}</CardTitle>
          <div className="hidden items-center space-x-6">
            <Button
              variant={'transparent'}
              className={classNames(
                'relative h-12 px-0 py-0',
                activeIndex === 0 && 'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-[""]'
              )}
              onClick={() => setActiveIndex(0)}
            >
              Customers
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="relative h-72 pt-4">
        <canvas ref={chartRef} />
      </CardContent>
    </Card>
  );
};

export default ChartAudience;
