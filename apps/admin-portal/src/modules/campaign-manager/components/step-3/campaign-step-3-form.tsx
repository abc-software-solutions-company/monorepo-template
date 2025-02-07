import { UseFormReturn } from 'react-hook-form';
import FormFieldRadioBlock from '@repo/react-web-ui-shadcn/components/form-fields/form-field-radio-block';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';

import Milestones from './milestones';
import Rules from './rules';

import { CAMPAIGN_TYPE_LIST } from '../../constants/campaign.constant';
import { CampaignStep3FormValues } from '../../interfaces/campaign.interface';

type CampaignStep3FormProps = {
  form: UseFormReturn<CampaignStep3FormValues>;
  onSubmit: (data: CampaignStep3FormValues) => void;
};

const CampaignStep3Form: React.FC<CampaignStep3FormProps> = ({ form, onSubmit }) => {
  return (
    <>
      <Form {...form}>
        <form className="max-w-md space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormFieldRadioBlock form={form} formLabel="Campaign type" fieldName="campaignType" options={CAMPAIGN_TYPE_LIST} />
        </form>
      </Form>
      <Rules className="mt-4" />
      <Milestones className="mt-4" />
      <ModalLoading visible={form.formState.isValid && form.formState.isSubmitting} />
    </>
  );
};

export default CampaignStep3Form;
