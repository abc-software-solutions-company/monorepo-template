import React, { useEffect, useState } from 'react';
import { ControllerRenderProps, Path, UseFormReturn } from 'react-hook-form';
import Debugger from '@repo/react-web-ui-shadcn/components/debugger';
import FormFieldInputDatePicker from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-date-picker';
import FormFieldInputMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-multi-language';
import FormFieldQuillMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields/form-field-quill-multi-language';
import FormFieldUploaderMultiLanguage, { FilePreview } from '@repo/react-web-ui-shadcn/components/form-fields/form-field-uploader-multi-language';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';
import { Translation } from '@repo/shared-universal/interfaces/language.interface';

import { campaignStep1Dto } from '../../dtos/campaign-step-1.dto';
import { CampaignStep1FormValues } from '../../interfaces/campaign.interface';

type CampaignStep1FormProps = {
  form: UseFormReturn<CampaignStep1FormValues>;
  onSubmit: (data: CampaignStep1FormValues) => void;
};

const NEXT_DAY = new Date(Date.now() + 86400000);

const CampaignStep1Form: React.FC<CampaignStep1FormProps> = ({ form, onSubmit }) => {
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

  const handleSelectFile = <T extends Path<CampaignStep1FormValues>>(
    field: ControllerRenderProps<CampaignStep1FormValues, T>,
    locale: string,
    files: File[],
    filenames: string[]
  ) => {
    setIsUploading(true);

    const values: Translation[] = Array.isArray(field.value) ? [...field.value] : [];
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

  const handleRemoveFile = <T extends Path<CampaignStep1FormValues>>(field: ControllerRenderProps<CampaignStep1FormValues, T>, locale: string) => {
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

    const values: Translation[] = Array.isArray(field.value) ? [...field.value] : [];
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
            <FormFieldInputMultiLanguage required form={form} fieldName="name" formLabel="Name" locales={LANGUAGES} maxLength={50} />
            <FormFieldInputMultiLanguage required form={form} fieldName="description" formLabel="Description" locales={LANGUAGES} maxLength={300} />
            <FormFieldInputDatePicker required form={form} fieldName="startDate" formLabel="Start Date" disableBefore={NEXT_DAY} />
            <FormFieldInputDatePicker
              required
              form={form}
              fieldName="startDate"
              formLabel="Start Date"
              size="sm"
              labelDisplay="outside"
              disableBefore={NEXT_DAY}
            />
            <FormFieldInputDatePicker
              required
              form={form}
              fieldName="endDate"
              formLabel="End Date"
              disableBefore={form.watch('startDate') ?? NEXT_DAY}
            />
            <FormFieldInputDatePicker
              required
              form={form}
              fieldName="endDate"
              formLabel="End Date"
              size="sm"
              labelDisplay="outside"
              disableBefore={form.watch('startDate') ?? NEXT_DAY}
            />
            <FormFieldQuillMultiLanguage form={form} fieldName="tnc" formLabel="Terms and conditions" locales={LANGUAGES} maxLength={300} />
          </div>
          <div className="w-full max-w-md space-y-4">
            <FormFieldUploaderMultiLanguage
              required
              form={form}
              fieldName="imageUrl"
              formLabel="Campaign image"
              locales={LANGUAGES}
              previews={previews}
              isUploading={isUploading}
              maxSize={5242880}
              onSelectFile={handleSelectFile}
              onRemoveFile={handleRemoveFile}
            />
          </div>
          <div className="w-full space-y-4">
            <h2 className="text-lg font-semibold">Form data</h2>
            <pre className="overflow-hidden rounded-md border-slate-200 p-2 text-xs">{JSON.stringify(form.watch(), null, 2)}</pre>
            <h2 className="text-lg font-semibold">Data send to API</h2>
            <pre className="overflow-hidden rounded-md border-slate-200 p-2 text-xs">{JSON.stringify(campaignStep1Dto(form.watch()), null, 2)}</pre>
          </div>
        </div>
        <ModalLoading visible={form.formState.isValid && form.formState.isSubmitting} />
        <Debugger text={JSON.stringify(form.formState.errors, null, 2)} />
        <Debugger text={JSON.stringify(form.watch(), null, 2)} />
      </form>
    </Form>
  );
};

export default CampaignStep1Form;
