import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import FormFieldDatePicker from '@/components/form-fields-yara/form-field-date-picker';
import FormFieldEditorMultiLanguage from '@/components/form-fields-yara/form-field-editor-multi-language';
import FormFieldInputMultiLanguage from '@/components/form-fields-yara/form-field-input-multi-language';
import FormFieldUploaderMultiLanguage from '@/components/form-fields-yara/form-field-uploader-multi-language';

import { locales } from '../../constants/campaign.constant';
import { CampaignDetailsFormValues } from '../../interfaces/campaign.interface';

type CampaignDetailsFormProps = {
  form: UseFormReturn<CampaignDetailsFormValues>;
  onSubmit: (data: CampaignDetailsFormValues) => void;
};

const CampaignDetailsForm: React.FC<CampaignDetailsFormProps> = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form className="frm-campaign-details" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid max-w-lg gap-3">
            <FormFieldInputMultiLanguage required form={form} fieldName="name" formLabel="Campaign name" locales={locales} maxLength={50} />
            <FormFieldInputMultiLanguage
              required
              form={form}
              fieldName="description"
              formLabel="Campaign description"
              locales={locales}
              maxLength={300}
            />
            <FormFieldDatePicker required form={form} fieldName="startDate" formLabel="Start Date" />
            <FormFieldDatePicker required size="sm" form={form} fieldName="endDate" formLabel="End Date" />
            <FormFieldEditorMultiLanguage form={form} fieldName="tnc" formLabel="Terms and conditions" locales={locales} maxLength={300} />
          </div>
          <div className="grid max-w-md gap-3">
            <FormFieldUploaderMultiLanguage form={form} fieldName="image_url" formLabel="Campaign image" locales={locales} />
            <pre className="mt-3 overflow-hidden bg-slate-50 p-2">{JSON.stringify(form.watch(), null, 2)}</pre>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CampaignDetailsForm;
