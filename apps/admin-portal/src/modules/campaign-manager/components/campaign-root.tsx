import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

import { CampaignStep1FormValues, CampaignStep2FormValues, CampaignStep3FormValues } from '../interfaces/campaign.interface';

import { CAMPAIGN_STEP } from '../constants/campaign.constant';

import CampaignStep1Form from './step-1/campaign-step-1-form';
import CampaignStep2Form from './step-2/campaign-step-2-form';
import CampaignStep3Form from './step-3/campaign-step-3-form';
import CampaignConfirmation from './step-4/campaign-confirmation';
import CampaignNavigation from './campaign-navigation';
import CampaignToolbar from './campaign-toolbar';

import { campaignStep1LocalizeSchema } from '../validators/campaign-step-1.validator';
import { campaignStep2Schema } from '../validators/campaign-step-2.validator';
import { campaignStep3Schema } from '../validators/campaign-step-3.validator';

type CampaignFormData = {
  step1: CampaignStep1FormValues;
  step2: CampaignStep2FormValues;
  step3: CampaignStep3FormValues;
};

const CampaignRoot: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CAMPAIGN_STEP>(CAMPAIGN_STEP.STEP_2);
  const [stepCompleted, setStepCompleted] = useState({
    [CAMPAIGN_STEP.STEP_1]: false,
    [CAMPAIGN_STEP.STEP_2]: false,
    [CAMPAIGN_STEP.STEP_3]: false,
    [CAMPAIGN_STEP.STEP_4]: false,
  });
  const [formData, setFormData] = useState<CampaignFormData>({
    step1: {
      name: [], // [{ lang: 'en-us', value: 'Title' }],
      description: [], // [{ lang: 'en-us', value: 'Desc' }],
      tnc: [],
      imageUrl: [{ lang: 'en-us', value: 'https://www.w3schools.com/html/pic_trulli.jpg' }],
      startDate: undefined, // new Date('2024-11-28T17:00:00.000Z'),
      endDate: undefined, // new Date('2024-11-30T16:59:59.999Z'),
    },
    step2: {
      nation: 'vi-vn',
      country: [{ id: 'vi-vn' }],
      district: [],
      keyword: '',
      dateRange: {
        from: new Date('2024-11-28T17:00:00.000Z'),
        to: new Date('2024-11-30T16:59:59.999Z'),
      },
    },
    step3: {
      campaignType: 'milestone',
    },
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const step1Form = useForm<CampaignStep1FormValues>({
    resolver: zodResolver(campaignStep1LocalizeSchema(LANGUAGES)),
    defaultValues: formData.step1,
  });

  const step2Form = useForm<CampaignStep2FormValues>({
    resolver: zodResolver(campaignStep2Schema),
    defaultValues: formData.step2,
  });

  const step3Form = useForm<CampaignStep3FormValues>({
    resolver: zodResolver(campaignStep3Schema),
    defaultValues: formData.step3,
  });

  const handleStep1Submit = (data: CampaignStep1FormValues) => {
    setFormData(prev => ({ ...prev, campaignStep1: data }));
    setCurrentStep(CAMPAIGN_STEP.STEP_2);
    setStepCompleted(prev => ({ ...prev, [CAMPAIGN_STEP.STEP_1]: true }));
  };

  const handleStep2Submit = (data: CampaignStep2FormValues) => {
    setFormData(prev => ({ ...prev, eligibilityCriteria: data }));
    setCurrentStep(CAMPAIGN_STEP.STEP_3);
    setStepCompleted(prev => ({ ...prev, [CAMPAIGN_STEP.STEP_2]: true }));
  };

  const handleStep3Submit = (data: CampaignStep3FormValues) => {
    setFormData(prev => ({ ...prev, campaignMechanism: data }));
    setCurrentStep(CAMPAIGN_STEP.STEP_4);
    setStepCompleted(prev => ({ ...prev, [CAMPAIGN_STEP.STEP_3]: true }));
  };

  const saveDraft = () => {
    alert(JSON.stringify(step1Form.watch(), null, 2));
  };

  const handleCancel = () => {
    alert('Canceled');
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case CAMPAIGN_STEP.STEP_1:
        step1Form.handleSubmit(handleStep1Submit)();
        break;
      case CAMPAIGN_STEP.STEP_2:
        step2Form.handleSubmit(handleStep2Submit)();
        break;
      case CAMPAIGN_STEP.STEP_3:
        step3Form.handleSubmit(handleStep3Submit)();
        break;
      case CAMPAIGN_STEP.STEP_4:
        handleSubmit();
        break;
    }
  };

  const handleSubmit = () => {
    if (isFormValid) {
      alert(JSON.stringify(formData, null, 2));
    } else {
      alert('Form is not valid. Please check all fields.');
    }
  };

  const handleStepChange = (step: CAMPAIGN_STEP) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case CAMPAIGN_STEP.STEP_1:
        return <CampaignStep1Form form={step1Form} onSubmit={handleStep1Submit} />;
      case CAMPAIGN_STEP.STEP_2:
        return <CampaignStep2Form form={step2Form} onSubmit={handleStep2Submit} />;
      case CAMPAIGN_STEP.STEP_3:
        return <CampaignStep3Form form={step3Form} onSubmit={handleStep3Submit} />;
      case CAMPAIGN_STEP.STEP_4:
        return <CampaignConfirmation />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const isStep1Valid = step1Form.formState.isValid;
    const isStep2Valid = step2Form.formState.isValid;
    const isStep3Valid = step3Form.formState.isValid;

    setIsFormValid(isStep1Valid && isStep2Valid && isStep3Valid);

    setStepCompleted(prev => ({
      ...prev,
      [CAMPAIGN_STEP.STEP_1]: isStep1Valid,
      [CAMPAIGN_STEP.STEP_2]: isStep2Valid,
      [CAMPAIGN_STEP.STEP_3]: isStep3Valid,
    }));
  }, [step1Form.formState.isValid, step2Form.formState.isValid, step3Form.formState.isValid]);

  return (
    <div>
      <CampaignToolbar currentStep={currentStep} isFormValid={isFormValid} onSaveDraft={saveDraft} onCancel={handleCancel} onNext={handleNextStep} />
      <CampaignNavigation currentStep={currentStep} stepCompleted={stepCompleted} onStepChange={handleStepChange} />
      <Separator className="my-6" />
      {renderStep()}
    </div>
  );
};

export default CampaignRoot;
