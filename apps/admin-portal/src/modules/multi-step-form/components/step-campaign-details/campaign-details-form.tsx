import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import FormFieldDatePicker from '@/components/form-fields-ahua/form-field-date-picker';
import FormFieldEditorMultiLanguage from '@/components/form-fields-ahua/form-field-editor-multi-language';
import FormFieldInput from '@/components/form-fields-ahua/form-field-input';
import FormFieldInputMultiLanguage from '@/components/form-fields-ahua/form-field-input-multi-language';
import FormFieldSelect from '@/components/form-fields-ahua/form-field-select';
import FormFieldSelectTag from '@/components/form-fields-ahua/form-field-select-tag';
import FormFieldUploaderMultiLanguage, { FilePreview } from '@/components/form-fields-ahua/form-field-uploader-multi-language';

import { locales } from '../../constants/campaign.constant';
import { CampaignDetailsFormValues, FormFieldTranslationProps } from '../../interfaces/campaign.interface';

type CampaignDetailsFormProps = {
  form: UseFormReturn<CampaignDetailsFormValues>;
  onSubmit: (data: CampaignDetailsFormValues) => void;
};

const countries = [
  { id: 'vi-vn', name: 'Vietnam' },
  { id: 'th-th', name: 'Thailand' },
];

const CampaignDetailsForm: React.FC<CampaignDetailsFormProps> = ({ form, onSubmit }) => {
  const [previews, setPreviews] = useState<Record<string, FilePreview[]>>({});

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(files => {
        files.forEach(file => {
          if (file.url) URL.revokeObjectURL(file.url);
        });
      });
    };
  }, [previews]);

  const handleSelectFile = (field: FormFieldTranslationProps, lang: string, files: File[], filenames: string[]) => {
    const values = [...(field.value || [])];
    const index = values.findIndex(v => v.lang === lang);

    const fileInfos: FilePreview[] = filenames.map((filename, idx) => ({
      name: filename,
      size: files[idx].size,
      type: files[idx].type,
      url: URL.createObjectURL(files[idx]),
    }));

    setPreviews(prev => ({ ...prev, [lang]: fileInfos }));

    const value = JSON.stringify(fileInfos.map(({ ...rest }) => rest));

    if (index >= 0) {
      values[index] = { ...values[index], value };
    } else {
      values.push({ lang, value });
    }

    field.onChange(values);
  };

  const handleRemoveFile = (field: FormFieldTranslationProps, lang: string, fileIndex: number) => {
    setPreviews(prev => {
      const langPreviews = prev[lang];

      if (!langPreviews) return prev;

      if (langPreviews[fileIndex]?.url) {
        URL.revokeObjectURL(langPreviews[fileIndex].url);
      }

      const newPreviews = {
        ...prev,
        [lang]: langPreviews.filter((_, idx) => idx !== fileIndex),
      };

      if (newPreviews[lang].length === 0) {
        delete newPreviews[lang];
      }

      return newPreviews;
    });

    const values = [...(field.value || [])];
    const valueIndex = values.findIndex(v => v.lang === lang);

    if (valueIndex >= 0) {
      const currentFiles = JSON.parse(values[valueIndex].value) as FilePreview[];
      const newFiles = currentFiles.filter((_, idx) => idx !== fileIndex);

      if (newFiles.length === 0) {
        values.splice(valueIndex, 1);
      } else {
        values[valueIndex] = { ...values[valueIndex], value: JSON.stringify(newFiles) };
      }

      field.onChange(values);
    }
  };

  return (
    <Form {...form}>
      <form className="frm-campaign-details" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="max-w-lg space-y-4">
            <FormFieldInputMultiLanguage required form={form} fieldName="name" formLabel="Campaign name" locales={locales} maxLength={50} />
            <FormFieldInputMultiLanguage
              required
              form={form}
              fieldName="description"
              formLabel="Campaign description"
              locales={locales}
              maxLength={300}
            />
            <FormFieldDatePicker required form={form} fieldName="startDate" formLabel="Start Date" disableBefore={new Date()} />
            <FormFieldDatePicker required form={form} fieldName="endDate" formLabel="End Date" disableBefore={form.watch('startDate')} />
            <FormFieldSelect form={form} fieldName="country" formLabel="Country" placeholder="Select country" options={countries} />
            <FormFieldSelectTag form={form} fieldName="country" formLabel="Country" placeholder="Select country" options={countries} />
            <FormFieldInput size="sm" form={form} fieldName="keyword" formLabel="Keyword" placeholder="Keyword" />
            <FormFieldEditorMultiLanguage form={form} fieldName="tnc" formLabel="Terms and conditions" locales={locales} maxLength={300} />
          </div>
          <div className="max-w-md space-y-4">
            <FormFieldUploaderMultiLanguage
              required
              form={form}
              fieldName="image_url"
              formLabel="Campaign image"
              locales={locales}
              previews={previews}
              onSelectFile={handleSelectFile}
              onRemoveFile={handleRemoveFile}
            />
            <pre className="mt-3 overflow-hidden bg-slate-50 p-2">{JSON.stringify(form.watch(), null, 2)}</pre>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CampaignDetailsForm;
