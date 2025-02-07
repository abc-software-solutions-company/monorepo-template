import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@repo/react-web-ui-shadcn/components/ui/dialog';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, 'This field is mandatory'),
});

type FormValues = z.infer<typeof formSchema>;

interface IRuleRenameModalProps {
  isOpen: boolean;
  title: string;
  defaultValues?: Partial<FormValues>;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function RuleRenameModal({
  isOpen,
  title,
  defaultValues = {
    name: '',
  },
  onClose,
  onSubmit,
}: IRuleRenameModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values.name);
    onClose();
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-lg p-0">
        <DialogHeader className="p-0 !text-center">
          <DialogTitle className="border-b p-4">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-10">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="p-3">
                <FormFieldInput form={form} fieldName="name" formLabel="Name" placeholder="Enter name" />
              </div>
              <DialogFooter className="!justify-center px-4 pb-8 pt-0">
                <Button type="button" variant="outline-destructive" className="min-w-28" onClick={onClose}>
                  Close
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
