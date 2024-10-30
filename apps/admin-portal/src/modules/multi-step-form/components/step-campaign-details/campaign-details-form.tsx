import React, { useEffect, useState } from 'react';
import { ControllerRenderProps, Path, UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import FormFieldDatePicker from '@/components/form-fields-ahua/form-field-date-picker';
import FormFieldEditorMultiLanguage from '@/components/form-fields-ahua/form-field-editor-multi-language';
import FormFieldInput from '@/components/form-fields-ahua/form-field-input';
import FormFieldInputMultiLanguage from '@/components/form-fields-ahua/form-field-input-multi-language';
import FormFieldSelect from '@/components/form-fields-ahua/form-field-select';
import FormFieldSelectTag from '@/components/form-fields-ahua/form-field-select-tag';
import FormFieldUploaderMultiLanguage, { FilePreview } from '@/components/form-fields-ahua/form-field-uploader-multi-language';

import { countries, locales } from '../../constants/campaign.constant';
import { createCampaignDto } from '../../dtos/create-campaign.dto';
import { CampaignDetailsFormValues } from '../../interfaces/campaign.interface';

type CampaignDetailsFormProps = {
  form: UseFormReturn<CampaignDetailsFormValues>;
  onSubmit: (data: CampaignDetailsFormValues) => void;
};

type FormFieldType = ControllerRenderProps<CampaignDetailsFormValues, Path<CampaignDetailsFormValues>>;

const NEXT_DAY = new Date(Date.now() + 86400000);

const CampaignDetailsForm: React.FC<CampaignDetailsFormProps> = ({ form, onSubmit }) => {
  const [previews, setPreviews] = useState<Record<string, FilePreview[]>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(files => {
        files.forEach(file => {
          if (file.url) URL.revokeObjectURL(file.url);
        });
      });
    };
  }, [previews]);

  const handleSelectFile = (field: FormFieldType, locale: string, files: File[], filenames: string[]) => {
    setIsUploading(true);

    const values = Array.isArray(field.value) ? [...field.value] : [];
    const index = values.findIndex(v => v.lang === locale);

    const fileInfos: FilePreview[] = filenames.map((filename, idx) => ({
      name: filename,
      size: files[idx].size,
      type: files[idx].type,
      url: URL.createObjectURL(files[idx]),
    }));

    setPreviews(prev => ({ ...prev, [locale]: fileInfos }));

    const value = JSON.stringify(fileInfos.map(({ ...rest }) => rest));

    if (index >= 0) {
      values[index] = { ...values[index], value };
    } else {
      values.push({ lang: locale, value });
    }

    field.onChange(values);

    setIsUploading(false);
  };

  const handleRemoveFile = (field: FormFieldType, locale: string) => {
    setPreviews(prev => {
      const langPreviews = prev[locale];

      if (langPreviews) {
        langPreviews.forEach(file => {
          if (file.url) URL.revokeObjectURL(file.url);
        });
      }
      const newPreviews = { ...prev };

      delete newPreviews[locale];

      return newPreviews;
    });

    const values = Array.isArray(field.value) ? [...field.value] : [];
    const valueIndex = values.findIndex(v => v.lang === locale);

    if (valueIndex >= 0) {
      values.splice(valueIndex, 1);
      field.onChange(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex space-x-10">
          <div className="w-full max-w-md space-y-4">
            <FormFieldInputMultiLanguage required form={form} fieldName="name" formLabel="Name" locales={locales} maxLength={50} />
            <FormFieldInputMultiLanguage required form={form} fieldName="description" formLabel="Description" locales={locales} maxLength={300} />
            <FormFieldDatePicker required form={form} fieldName="startDate" formLabel="Start Date" disableBefore={NEXT_DAY} />
            <FormFieldDatePicker required form={form} fieldName="endDate" formLabel="End Date" disableBefore={form.watch('startDate') ?? NEXT_DAY} />
            <FormFieldSelect form={form} fieldName="country" formLabel="Country" placeholder="Select country" options={countries} />
            <FormFieldSelectTag form={form} fieldName="country" formLabel="Country" placeholder="Select country" options={countries} />
            <FormFieldInput form={form} fieldName="keyword" formLabel="Keyword" placeholder="Keyword" />
            <FormFieldEditorMultiLanguage form={form} fieldName="tnc" formLabel="Terms and conditions" locales={locales} maxLength={300} />
          </div>
          <div className="w-full max-w-md space-y-4">
            <FormFieldUploaderMultiLanguage
              required
              form={form}
              fieldName="imageUrl"
              formLabel="Campaign image"
              locales={locales}
              previews={previews}
              isUploading={isUploading}
              maxSize={5242880}
              onSelectFile={handleSelectFile}
              onRemoveFile={handleRemoveFile}
            />
          </div>
          <div className="w-full space-y-4">
            <h2 className="text-lg font-semibold">Form data</h2>
            <pre className="overflow-hidden rounded-md border-slate-200 bg-slate-100 p-2">{JSON.stringify(form.watch(), null, 2)}</pre>
            <h2 className="text-lg font-semibold">Data send to API</h2>
            <pre className="overflow-hidden rounded-md border-green-200 bg-green-100 p-2">
              {JSON.stringify(createCampaignDto(form.watch()), null, 2)}
            </pre>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CampaignDetailsForm;
