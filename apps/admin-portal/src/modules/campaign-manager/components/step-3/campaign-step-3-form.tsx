import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import FormFieldRadioBlock from '@/components/form-fields-ahua/form-field-radio-block';
import ModalLoading from '@/components/modals/modal-loading';

import ProgressMechanics from './progress-mechanics';

import { CAMPAIGN_TYPE_LIST } from '../../constants/campaign.constant';
import { campaignStep3Dto } from '../../dtos/campaign-step-3.dto';
import { CampaignStep3FormValues } from '../../interfaces/campaign.interface';

type CampaignStep3FormProps = {
  form: UseFormReturn<CampaignStep3FormValues>;
  onSubmit: (data: CampaignStep3FormValues) => void;
};

const CampaignStep3Form: React.FC<CampaignStep3FormProps> = ({ form, onSubmit }) => {
  return (
    <>
      <Form {...form}>
        <form className="frm-campaign-mechanism" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-md space-y-4">
            <FormFieldRadioBlock form={form} formLabel="Campaign type" fieldName="campaignType" options={CAMPAIGN_TYPE_LIST} />
          </div>
          <ProgressMechanics form={form} />
          <div className="space-y-4">
            <div className="w-full space-y-4">
              <h2 className="text-lg font-semibold">Form data</h2>
              <pre className="overflow-hidden rounded-md border-slate-200 bg-slate-100 p-2">{JSON.stringify(form.watch(), null, 2)}</pre>
              <h2 className="text-lg font-semibold">Data send to API</h2>
              <pre className="overflow-hidden rounded-md border-green-200 bg-green-100 p-2">
                {JSON.stringify(campaignStep3Dto(form.watch()), null, 2)}
              </pre>
            </div>
          </div>
          <ModalLoading visible={form.formState.isSubmitting} />
        </form>
      </Form>
    </>
  );
};

export default CampaignStep3Form;
