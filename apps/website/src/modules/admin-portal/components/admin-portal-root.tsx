'use client';

import React, { FC } from 'react';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import FeatureAuditLogs from './feature-audit-logs';
import FeatureCategories from './feature-categories';
import FeatureContacts from './feature-contacts';
import FeatureContents from './feature-contents';
import FeatureDashboard from './feature-dashboard';
import FeatureFaqs from './feature-faqs';
import FeatureFiles from './feature-files';
import FeaturePosts from './feature-posts';
import FeatureProducts from './feature-products';
import FeatureSettings from './feature-settings';
import FeatureUsers from './feature-users';

const AdminPortalRoot: FC<ComponentBaseProps> = () => {
  return (
    <div className="container">
      <div className="grid gap-6 overflow-hidden">
        {/* <div className="glow-effect top-50 z-0 h-96 w-96"></div> */}
        <FeatureDashboard />
        <FeatureCategories />
        <FeatureContents />
        <FeatureFiles />
        <FeatureUsers />
        <FeaturePosts />
        <FeatureProducts />
        <FeatureAuditLogs />
        <FeatureContacts />
        <FeatureFaqs />
        <FeatureSettings />
      </div>
    </div>
  );
};

export default AdminPortalRoot;
