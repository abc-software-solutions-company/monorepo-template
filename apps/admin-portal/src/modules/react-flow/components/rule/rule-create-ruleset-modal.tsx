import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldSelect from '@repo/react-web-ui-shadcn/components/form-fields/form-field-select';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'This field is mandatory')
    .max(30, 'This field must be less than 30 characters')
    .regex(/^[^@#$%&^]+$/, 'Special characters are not allowed'),
  platform_type: z.string().min(1, 'Platform type is mandatory'),
});

export type CreateRuleSetFormValues = z.infer<typeof formSchema>;

interface ICreateRuleSetModalProps {
  isOpen: boolean;
  title: string;
  defaultValues?: Partial<CreateRuleSetFormValues>;
  onClose: () => void;
  onSubmit: (data: CreateRuleSetFormValues) => void;
}

export function RuleCreateRuleSetModal({
  isOpen,
  title,
  defaultValues = {
    name: '',
    platform_type: 'YC',
  },
  onClose,
  onSubmit,
}: ICreateRuleSetModalProps) {
  const form = useForm<CreateRuleSetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: CreateRuleSetFormValues) => {
    onSubmit(values);
    onClose();
  };

  const handleDoItLater = () => {
    onSubmit({
      ...defaultValues,
      name: defaultValues.name || 'Untitled group',
    } as CreateRuleSetFormValues);
    onClose();
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  return (
    <Dialog open={isOpen} modal={true} onOpenChange={handleDoItLater}>
      <DialogContent showCloseButton={false} className="max-w-lg p-0">
        <DialogHeader className="p-0 !text-center">
          <DialogTitle className="border-b p-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-10">
          <Form {...form}>
            <form className="grid gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-3">
                <FormFieldInput required showCharacterCount={true} form={form} fieldName="name" formLabel="Enter name" maxLength={150} />
                <FormFieldSelect
                  required
                  form={form}
                  fieldName="platform_type"
                  formLabel="Select platform type"
                  options={[
                    { id: 'YC', name: 'YaraConnect' },
                    { id: 'YFC', name: 'FarmCare' },
                  ]}
                  placeholder="Select platform type"
                  showSearch={false}
                  showErrorMessage={false}
                />
              </div>
              <DialogFooter className="!justify-center px-4 pb-8 pt-0">
                <Button type="button" variant="outline-destructive" className="min-w-28" onClick={handleDoItLater}>
                  I&apos;ll do it later
                </Button>
                <Button type="submit" className="min-w-28">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
