import classNames from 'classnames';
import { ShieldIcon } from 'lucide-react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/react-web-ui-shadcn/components/ui/select';

import { OptionType } from '@/interfaces/status.interface';

const roleOptions: OptionType[] = [
  {
    value: 'user',
    label: 'user_role_user',
    textClassName: '',
    bgClassName: '',
    borderClassName: '',
    activeClassName: '',
    iconClassName: '',
    icon: ShieldIcon,
  },
  {
    value: 'admin',
    label: 'user_role_admin',
    textClassName: '',
    bgClassName: '',
    borderClassName: '',
    activeClassName: '',
    iconClassName: '',
    icon: ShieldIcon,
  },
  {
    value: 'super_admin',
    label: 'user_role_super_admin',
    textClassName: '',
    bgClassName: '',
    borderClassName: '',
    activeClassName: '',
    iconClassName: '',
    icon: ShieldIcon,
  },
];

type FormFieldSelectUserRoleProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formLabel?: string;
  fieldName?: Path<T>;
};

export default function FormFieldSelectUserRole<T extends FieldValues>({
  form,
  formLabel,
  fieldName = 'role' as Path<T>,
}: FormFieldSelectUserRoleProps<T>) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{formLabel ?? t('form_field_user_role')}</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions?.map(option => {
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        {option.icon && <option.icon className={classNames('mr-2 h-4 w-4', option.iconClassName)} />}
                        <span>{t(option.label)}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormControl>
          {error?.message && <FormMessage message={t(error.message)} />}
        </FormItem>
      )}
    />
  );
}
