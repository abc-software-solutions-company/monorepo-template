import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import FileUpload from '@/components/file-upload';

import { locales } from '../../constants/campaign.constant';
import { CampaignDetailsFormValues } from '../../interfaces/campaign.interface';
import FormFieldEditorMultiLanguage from '../form-fields/form-field-editor-multi-language';
import FormFieldInput from '../form-fields/form-field-input';
import FormFieldInputMultiLanguage from '../form-fields/form-field-input-multi-language';

type CampaignDetailsFormProps = {
  form: UseFormReturn<CampaignDetailsFormValues>;
  onSubmit: (data: CampaignDetailsFormValues) => void;
};

const CampaignDetailsForm: React.FC<CampaignDetailsFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form className="frm-campaign-details" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2">
          <div className="grid max-w-lg gap-3">
            <FormFieldInput required form={form} fieldName="text" formLabel="Text" placeholder="Type something..." />
            <FormFieldInputMultiLanguage required form={form} fieldName="name" formLabel="Campaign name" locales={locales} maxLength={50} />
            <FormFieldInputMultiLanguage
              required
              form={form}
              fieldName="description"
              formLabel="Campaign description"
              locales={locales}
              maxLength={300}
            />
            <FormFieldEditorMultiLanguage form={form} fieldName="tnc" formLabel="Terms and conditions" locales={locales} maxLength={300} />
          </div>
          <div>
            <FileUpload />
            <pre className="mt-3 bg-slate-50 p-2">{JSON.stringify(form.watch(), null, 2)}</pre>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CampaignDetailsForm;
