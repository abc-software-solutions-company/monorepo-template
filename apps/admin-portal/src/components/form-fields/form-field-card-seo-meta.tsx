import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Card, CardContent, CardDescription, CardHeader } from '@repo/react-web-ui-shadcn/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Input } from '@repo/react-web-ui-shadcn/components/ui/input';
import { InputTag } from '@repo/react-web-ui-shadcn/components/ui/input-tag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/react-web-ui-shadcn/components/ui/tabs';
import { Textarea } from '@repo/react-web-ui-shadcn/components/ui/textarea';

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
              <FormField
                control={form.control}
                name={`${fieldName}.title` as Path<T>}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>{t('seo_title')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" />
                    </FormControl>
                    {error?.message && <FormMessage message={t(error.message, { min: 1, max: 60 })} />}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${fieldName}.description` as Path<T>}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>{t('seo_description')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description" />
                    </FormControl>
                    {error?.message && <FormMessage message={t(error.message, { min: 1, max: 150 })} />}
                  </FormItem>
                )}
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
