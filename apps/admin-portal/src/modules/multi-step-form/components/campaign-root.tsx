import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Separator } from '~react-web-ui-shadcn/components/ui/separator';

import { CAMPAIGN_STEP } from '../constants/campaign.constant';

import CampaignDetailForm, { CampaignDetailsFormValues } from './step-campaign-details/campaign-details-form';
import CampaignMechanismForm, { CampaignMechanismFormValues } from './step-campaign-mechanism/campaign-mechanism-form';
import CampaignConfirmation from './step-confirmation/campaign-confirmation';
import EligibilityCriteriaForm, { EligibilityCriteriaFormValues } from './step-eligibility-criteria/eligibility-criteria-form';
import CampaignNavigation from './campaign-navigation';

import { campaignDetailsSchema } from '../validators/campaign-details.validator';
import { campaignMechanismSchema } from '../validators/campaign-mechanism.validator';
import { eligibilityCriteriaSchema } from '../validators/eligibility-criteria.validator';

type CampaignFormData = {
  campaignDetail: CampaignDetailsFormValues;
  eligibilityCriteria: EligibilityCriteriaFormValues;
  campaignMechanism: CampaignMechanismFormValues;
};

const CampaignRoot: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CAMPAIGN_STEP>(CAMPAIGN_STEP.CAMPAIGN_MECHANISM);
  const [stepCompleted, setStepCompleted] = useState({
    [CAMPAIGN_STEP.CAMPAIGN_DETAILS]: false,
    [CAMPAIGN_STEP.ELIGIBILITY_CRITERIA]: false,
    [CAMPAIGN_STEP.CAMPAIGN_MECHANISM]: false,
    [CAMPAIGN_STEP.CONFIRMATION]: false,
  });
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignDetail: {
      name: '',
      description: '',
    },
    eligibilityCriteria: {
      campaignTargetPlatform: '',
      shopType: '',
      userLocationLevel1: '',
      userLocationLevel2: '',
    },
    campaignMechanism: {
      campaignType: '',
      progressMechanics: [],
    },
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const campaignDetailsForm = useForm<CampaignDetailsFormValues>({
    resolver: zodResolver(campaignDetailsSchema),
    defaultValues: formData.campaignDetail,
  });

  const eligibilityCriteriaForm = useForm<EligibilityCriteriaFormValues>({
    resolver: zodResolver(eligibilityCriteriaSchema),
    defaultValues: formData.eligibilityCriteria,
  });

  const campaignMechanismForm = useForm<CampaignMechanismFormValues>({
    resolver: zodResolver(campaignMechanismSchema),
    defaultValues: formData.campaignMechanism,
  });

  useEffect(() => {
    const isCampaignDetailsValid = campaignDetailsForm.formState.isValid;
    const isEligibilityCriteriaValid = eligibilityCriteriaForm.formState.isValid;
    const isCampaignMechanismValid = campaignMechanismForm.formState.isValid;

    setIsFormValid(isCampaignDetailsValid && isEligibilityCriteriaValid && isCampaignMechanismValid);

    setStepCompleted(prev => ({
      ...prev,
      [CAMPAIGN_STEP.CAMPAIGN_DETAILS]: campaignDetailsForm.formState.isValid,
      [CAMPAIGN_STEP.ELIGIBILITY_CRITERIA]: eligibilityCriteriaForm.formState.isValid,
      [CAMPAIGN_STEP.CAMPAIGN_MECHANISM]: campaignMechanismForm.formState.isValid,
    }));
  }, [campaignDetailsForm.formState.isValid, eligibilityCriteriaForm.formState.isValid, campaignMechanismForm.formState.isValid]);

  const handleCampaignDetailsSubmit = (data: CampaignDetailsFormValues) => {
    setFormData(prev => ({ ...prev, campaignDetail: data }));
    setCurrentStep(CAMPAIGN_STEP.ELIGIBILITY_CRITERIA);
    setStepCompleted(prev => ({ ...prev, [CAMPAIGN_STEP.CAMPAIGN_DETAILS]: true }));
  };

  const handleEligibilityCriteriaSubmit = (data: EligibilityCriteriaFormValues) => {
    setFormData(prev => ({ ...prev, eligibilityCriteria: data }));
    setCurrentStep(CAMPAIGN_STEP.CAMPAIGN_MECHANISM);
    setStepCompleted(prev => ({ ...prev, [CAMPAIGN_STEP.ELIGIBILITY_CRITERIA]: true }));
  };

  const handleCampaignMechanismSubmit = (data: CampaignMechanismFormValues) => {
    setFormData(prev => ({ ...prev, campaignMechanism: data }));
    setCurrentStep(CAMPAIGN_STEP.CONFIRMATION);
    setStepCompleted(prev => ({ ...prev, [CAMPAIGN_STEP.CAMPAIGN_MECHANISM]: true }));
  };

  const saveDraft = () => {
    localStorage.setItem('formDraft', JSON.stringify(formData));
    alert(JSON.stringify(formData, null, 2));
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('formDraft');

    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft) as CampaignFormData;

      setFormData(parsedDraft);

      campaignDetailsForm.reset(parsedDraft.campaignDetail);
      eligibilityCriteriaForm.reset(parsedDraft.eligibilityCriteria);
      campaignMechanismForm.reset(parsedDraft.campaignMechanism);
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
    if (isFormValid) setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case CAMPAIGN_STEP.CAMPAIGN_DETAILS:
        return <CampaignDetailForm form={campaignDetailsForm} onSubmit={handleCampaignDetailsSubmit} />;
      case CAMPAIGN_STEP.ELIGIBILITY_CRITERIA:
        return <EligibilityCriteriaForm form={eligibilityCriteriaForm} onSubmit={handleEligibilityCriteriaSubmit} />;
      case CAMPAIGN_STEP.CAMPAIGN_MECHANISM:
        return <CampaignMechanismForm form={campaignMechanismForm} onSubmit={handleCampaignMechanismSubmit} />;
      case CAMPAIGN_STEP.CONFIRMATION:
        return <CampaignConfirmation />;
      default:
        return null;
    }
  };

  const renderNextButton = () => {
    switch (currentStep) {
      case CAMPAIGN_STEP.CAMPAIGN_DETAILS:
        return (
          <Button
            type="button"
            disabled={!campaignDetailsForm.formState.isValid}
            onClick={campaignDetailsForm.handleSubmit(handleCampaignDetailsSubmit)}
          >
            Next
          </Button>
        );
      case CAMPAIGN_STEP.ELIGIBILITY_CRITERIA:
        return (
          <Button
            type="button"
            disabled={!eligibilityCriteriaForm.formState.isValid}
            onClick={eligibilityCriteriaForm.handleSubmit(handleEligibilityCriteriaSubmit)}
          >
            Next
          </Button>
        );

      case CAMPAIGN_STEP.CAMPAIGN_MECHANISM:
        return (
          <Button
            type="button"
            disabled={!campaignMechanismForm.formState.isValid}
            onClick={campaignMechanismForm.handleSubmit(handleCampaignMechanismSubmit)}
          >
            Next
          </Button>
        );

      case CAMPAIGN_STEP.CONFIRMATION:
        return (
          <Button type="button" disabled={!isFormValid || currentStep !== CAMPAIGN_STEP.CONFIRMATION} onClick={handleSubmit}>
            Publish
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex gap-x-2">
        <Button className="ml-auto" type="button" onClick={saveDraft}>
          Save as draft
        </Button>
        <Button type="button" onClick={loadDraft}>
          Load draft
        </Button>
        <Button type="button" onClick={() => alert('Canceled')}>
          Cancel
        </Button>
        {renderNextButton()}
      </div>
      <CampaignNavigation currentStep={currentStep} stepCompleted={stepCompleted} onStepChange={handleStepChange} />
      <Separator className="my-6" />
      {renderStep()}
    </div>
  );
};

export default CampaignRoot;
