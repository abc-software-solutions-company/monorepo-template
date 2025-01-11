import { FC } from 'react';
import classNames from 'classnames';
import { GiftIcon, MapIcon, MedalIcon, PlaneIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';

import { ComponentBaseProps } from '@/interfaces/component.interface';

interface IFeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: IFeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: 'Accessibility',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
  {
    icon: <MapIcon />,
    title: 'Community',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
  {
    icon: <PlaneIcon />,
    title: 'Scalability',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
  {
    icon: <GiftIcon />,
    title: 'Gamification',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum quas provident cum',
  },
];

const HowItWorks: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <section id="how-it-works" className={classNames('py-14 text-center sm:py-16', className)}>
      <div className="container">
        <h2 className="text-3xl font-bold md:text-4xl">
          How It <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">Works </span>
          Step-by-Step Guide
        </h2>
        <p className="mx-auto mb-8 mt-4 text-xl text-muted-foreground md:w-3/4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis dolor pariatur sit!
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon, title, description }: IFeatureProps) => (
            <Card key={title} className="bg-muted/50">
              <CardHeader>
                <CardTitle className="grid place-items-center gap-4">
                  {icon}
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>{description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
