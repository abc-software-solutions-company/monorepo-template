import React from 'react';

import { CAMPAIGN_STEP, CAMPAIGN_STEP_LABELS } from '../constants/campaign.constant';

type CampaignNavigationProps = {
  currentStep: CAMPAIGN_STEP;
  stepCompleted: Record<CAMPAIGN_STEP, boolean>;
  onStepChange?: (step: CAMPAIGN_STEP) => void;
};

const STEPS = Object.values(CAMPAIGN_STEP);

const CampaignNavigation: React.FC<CampaignNavigationProps> = ({ currentStep, stepCompleted, onStepChange }) => {
  const getStepClassName = (step: CAMPAIGN_STEP) => {
    if (stepCompleted[step]) {
      return 'border-2 border-green-500 bg-green-500 text-white';
    } else if (currentStep === step) {
      return 'border-2 border-green-500 text-green-500';
    } else {
      return 'border-2 border-gray-500 text-gray-700';
    }
  };

  const getStepTextClassName = (step: CAMPAIGN_STEP) => {
    if (stepCompleted[step]) {
      return 'text-gray-600';
    } else if (currentStep === step) {
      return '!text-green-600';
    } else {
      return 'text-gray-600';
    }
  };

  const getLineClassName = (step: CAMPAIGN_STEP) => {
    return stepCompleted[step] ? 'bg-green-500' : 'bg-gray-300';
  };

  return (
    <div className="mx-auto max-w-[700px]">
      <div className="grid grid-cols-4">
        {STEPS.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <button
              type="button"
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${getStepClassName(step)}`}
              onClick={() => onStepChange?.(step)}
            >
              <strong>{index + 1}</strong>
              {index < STEPS.length - 1 && (
                <div className={`absolute left-full top-1/2 z-0 ml-[2px] h-[1px] w-[144px] -translate-y-1/2 ${getLineClassName(step)}`} />
              )}
            </button>
            <span className={`mt-2 text-sm ${getStepTextClassName(step)}`}>{CAMPAIGN_STEP_LABELS[step]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignNavigation;
