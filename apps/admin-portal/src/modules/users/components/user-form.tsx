import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldInputPassword from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-password';
import ModalLoading from '@repo/react-web-ui-shadcn/components/modals/modal-loading';
import { Card, CardContent } from '@repo/react-web-ui-shadcn/components/ui/card';
import { Checkbox } from '@repo/react-web-ui-shadcn/components/ui/checkbox';
import { Form, FormLabel } from '@repo/react-web-ui-shadcn/components/ui/form';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

import { UserFormData } from '../interfaces/users.interface';

import { USER_ROLE, USER_STATUS, USER_STATUSES } from '../constants/users.constant';

import useUsers from '../hooks/use-users';

import FormFieldCardSelectStatus from '@/components/form-fields/form-field-card-select-status';
import FormFieldSelectUserRole from '@/components/form-fields/form-field-select-user-role';
import FormToolbar from '@/components/form-toolbar';
import TooltipInfo from '@/components/tooltip-info';

import { useUsersState } from '../states/users.state';
import { userFormValidator } from '../validators/user-form.validator';

type UserFormProps = {
  isEdit: boolean;
};

const UserForm: FC<UserFormProps> = ({ isEdit }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const locale = useLocale();
  const usersState = useUsersState();
  const [isAllowChangePassword, setIsAllowChangePassword] = useState(!isEdit);
  const { user, isFetching } = useUsers({ isEdit, userId: params.id as string });

  const shouldShowCheckbox = isEdit;
  const shouldShowPasswordFields = !isEdit || isAllowChangePassword;
  const defaultValues: UserFormData = {
    status: user?.status ?? USER_STATUS.INACTIVE,
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: user?.password ?? '',
    confirmPassword: user?.password ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    role: user?.role ?? USER_ROLE.ADMIN,
  };

  const form = useForm<UserFormData>({ resolver: zodResolver(userFormValidator(isEdit)), defaultValues });

  const onSubmit: SubmitHandler<UserFormData> = async formData => {
    delete formData.confirmPassword;

    if (isEdit) {
      usersState.updateRequest({ id: params.id as string, data: formData });
    } else {
      usersState.createRequest(formData);
    }
  };

  const onBackClick = () => {
    navigate({
      pathname: `/${locale}/users`,
      search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
    });
  };

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, user]);

  return (
    <div data-testid="frm-user">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormToolbar title={t('user_details')} className="mb-4" submitDisabled={isFetching} onBackClick={onBackClick} />
          <div className="flex gap-4">
            <Card className="grow">
              <CardContent className="grid gap-4 pt-4">
                <FormFieldInput
                  form={form}
                  fieldName="name"
                  formLabel={t('form_field_name')}
                  pattern={{ regex: /^[a-zA-Z0-9s]+$/ }}
                  labelDisplay="outside"
                  size="sm"
                  translator={t}
                />
                <FormFieldInput
                  form={form}
                  fieldName="email"
                  formLabel={t('form_field_email')}
                  labelDisplay="outside"
                  size="sm"
                  minLength={3}
                  maxLength={320}
                  translator={t}
                />
                <FormFieldInput
                  form={form}
                  fieldName="phoneNumber"
                  formLabel={t('form_field_phone_number')}
                  labelDisplay="outside"
                  size="sm"
                  translator={t}
                />
                <FormFieldSelectUserRole form={form} />
                {shouldShowCheckbox && (
                  <div className={classNames('flex items-center space-x-2')}>
                    <Checkbox id="chk-change-password" checked={isAllowChangePassword} onCheckedChange={value => setIsAllowChangePassword(!!value)} />
                    <FormLabel htmlFor="chk-change-password">{t('user_change_password')}</FormLabel>
                    <TooltipInfo text={t('user_change_password_tooltip')} />
                  </div>
                )}
                {shouldShowPasswordFields && (
                  <div className={classNames('grid grid-cols-2 gap-4')}>
                    <FormFieldInputPassword
                      form={form}
                      disabled={!isAllowChangePassword}
                      formLabel={t('form_field_password')}
                      labelDisplay="outside"
                      size="sm"
                      fieldName="password"
                      translator={t}
                    />
                    <FormFieldInputPassword
                      form={form}
                      disabled={!isAllowChangePassword}
                      formLabel={t('form_field_confirm_password')}
                      labelDisplay="outside"
                      size="sm"
                      fieldName="confirmPassword"
                      translator={t}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="w-72 shrink-0">
              <div className="grid gap-4">
                <FormFieldCardSelectStatus form={form} statuses={USER_STATUSES} />
              </div>
            </div>
          </div>
        </form>
      </Form>
      <ModalLoading visible={isFetching} />
    </div>
  );
};

export default UserForm;
