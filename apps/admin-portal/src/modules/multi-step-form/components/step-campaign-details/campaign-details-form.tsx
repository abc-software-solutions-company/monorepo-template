import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '~react-web-ui-shadcn/components/ui/form';

import { FormFieldTranslationProps } from '@/interfaces/language.interface';

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

  const handleSelectFile = (field: FormFieldTranslationProps, lang: string, files: File[], filenames: string[]) => {
    setIsUploading(true);

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

    setIsUploading(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex space-x-10">
          <div className="w-full max-w-md space-y-4">
            <FormFieldInputMultiLanguage required form={form} fieldName="name" formLabel="Name" locales={locales} maxLength={50} />
            <FormFieldInputMultiLanguage required form={form} fieldName="description" formLabel="Description" locales={locales} maxLength={300} />
            <FormFieldDatePicker required form={form} fieldName="startDate" formLabel="Start Date" disableBefore={new Date(Date.now() + 86400000)} />
            <FormFieldDatePicker required form={form} fieldName="endDate" formLabel="End Date" disableBefore={form.watch('startDate')} />
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
