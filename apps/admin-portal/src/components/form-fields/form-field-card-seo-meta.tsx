import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import FormFieldInputMultiLanguage from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-multi-language';
import { Card, CardContent, CardDescription, CardHeader } from '@repo/react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { InputTag } from '@repo/react-web-ui-shadcn/components/ui/input-tag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/react-web-ui-shadcn/components/ui/tabs';
import { LANGUAGES } from '@repo/shared-universal/constants/language.constant';

type FormFieldCardSeoMetaProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fieldName?: Path<T>;
};

export default function FormFieldCardSeoMeta<T extends FieldValues>({ form, fieldName = 'seoMeta' as Path<T> }: FormFieldCardSeoMetaProps<T>) {
  const t = useTranslations();

  return (
    <div className="grid gap-4">
      <Tabs defaultValue="tab-seo">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tab-seo" className="max-w-40">
            SEO Meta
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-seo">
          <Card>
            <CardHeader>
              <CardDescription>{t('seo_explain')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormFieldInputMultiLanguage
                form={form}
                fieldName={`${fieldName}.titleLocalized` as Path<T>}
                formLabel={t('seo_title')}
                minLength={1}
                maxLength={60}
                locales={LANGUAGES}
              />
              <FormFieldInputMultiLanguage
                multiline
                form={form}
                fieldName={`${fieldName}.descriptionLocalized` as Path<T>}
                formLabel={t('seo_description')}
                minLength={1}
                maxLength={150}
                locales={LANGUAGES}
              />
              <FormField
                control={form.control}
                name={`${fieldName}.keywords` as Path<T>}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>{t('seo_keywords')}</FormLabel>
                    <FormControl>
                      <InputTag {...field} placeholder="Keywords" />
                    </FormControl>
                    {error?.message && <FormMessage message={t(error.message, { min: 1, max: 150 })} />}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
