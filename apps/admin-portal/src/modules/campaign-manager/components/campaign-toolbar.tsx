import React from 'react';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';

import { CAMPAIGN_STEP } from '../constants/campaign.constant';

type CampaignToolbarProps = {
  currentStep: CAMPAIGN_STEP;
  isFormValid: boolean;
  onSaveDraft: () => void;
  onCancel: () => void;
  onNext: () => void;
};

const CampaignToolbar: React.FC<CampaignToolbarProps> = ({ currentStep, isFormValid, onSaveDraft, onCancel, onNext }) => {
  const renderNextButton = () => {
    const isConfirmationStep = currentStep === CAMPAIGN_STEP.STEP_4;

    return (
      <Button type="button" disabled={isConfirmationStep && !isFormValid} onClick={onNext}>
        {isConfirmationStep ? 'Publish' : 'Next'}
      </Button>
    );
  };

  return (
    <div className="flex gap-x-2">
      <Button className="ml-auto" type="button" onClick={onSaveDraft}>
        Save as draft
      </Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
      {renderNextButton()}
    </div>
  );
};

export default CampaignToolbar;
