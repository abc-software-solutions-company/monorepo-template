import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import FormFieldInput from '@/components/form-fields-ahua/form-field-input';
import FormFieldSelect from '@/components/form-fields-ahua/form-field-select';
import FormFieldSelectGroup from '@/components/form-fields-ahua/form-field-select-group';
import FormFieldSelectTag from '@/components/form-fields-ahua/form-field-select-tag';
import ModalLoading from '@/components/modals/modal-loading';

import { countries } from '../../constants/campaign.constant';
import { campaignStep2Dto } from '../../dtos/campaign-step-2.dto';
import { CampaignStep2FormValues } from '../../interfaces/campaign.interface';

type CampaignStep2FormProps = {
  form: UseFormReturn<CampaignStep2FormValues>;
  onSubmit: (data: CampaignStep2FormValues) => void;
};

const CampaignStep2Form: React.FC<CampaignStep2FormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex space-x-10">
          <div className="w-full max-w-md space-y-4">
            <FormFieldSelect required form={form} fieldName="nation" formLabel="Nation" options={countries} />
            <FormFieldSelect multiple form={form} fieldName="country" formLabel="Country" placeholder="Select country" options={countries} />
            <FormFieldSelectTag form={form} fieldName="country" formLabel="Country" placeholder="Select country" options={countries} />
            <FormFieldSelectGroup
              form={form}
              fieldName="district"
              formLabel="District"
              placeholder="Select district"
              options={[
                {
                  id: 'region-a',
                  name: 'Region A',
                  children: [
                    { id: 'd-a-1', name: 'District A1' },
                    { id: 'd-a-2', name: 'District A2' },
                    { id: 'd-a-3', name: 'District A3' },
                    { id: 'd-a-4', name: 'District A4' },
                  ],
                },
                {
                  id: 'region-b',
                  name: 'Region B',
                  children: [
                    { id: 'd-b-1', name: 'District B1' },
                    { id: 'd-b-2', name: 'District B2' },
                    { id: 'd-b-3', name: 'District B3' },
                    { id: 'd-b-4', name: 'District B4' },
                  ],
                },
              ]}
            />
            <FormFieldInput form={form} fieldName="keyword" formLabel="Keyword" placeholder="Keyword" />
          </div>
          <div className="w-full max-w-md space-y-4">
            <div className="w-full space-y-4">
              <h2 className="text-lg font-semibold">Form data</h2>
              <pre className="overflow-hidden rounded-md border-slate-200 bg-slate-100 p-2">{JSON.stringify(form.watch(), null, 2)}</pre>
              <h2 className="text-lg font-semibold">Data send to API</h2>
              <pre className="overflow-hidden rounded-md border-green-200 bg-green-100 p-2">
                {JSON.stringify(campaignStep2Dto(form.watch()), null, 2)}
              </pre>
            </div>
          </div>
        </div>
        <ModalLoading visible={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};

export default CampaignStep2Form;
