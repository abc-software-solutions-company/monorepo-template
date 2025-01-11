import React, { FC } from 'react';
import classNames from 'classnames';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

import { ComponentBaseProps } from '@/interfaces/component.interface';

const ProfilePhotos: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames(className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Photos</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-4"></CardContent>
      </Card>
    </div>
  );
};

export default ProfilePhotos;
