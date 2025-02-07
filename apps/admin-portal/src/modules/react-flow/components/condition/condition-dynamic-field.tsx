import { Path, UseFormReturn } from 'react-hook-form';
import FormFieldInput from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input';
import FormFieldInputNumber from '@repo/react-web-ui-shadcn/components/form-fields/form-field-input-number';
import FormFieldSelect from '@repo/react-web-ui-shadcn/components/form-fields/form-field-select';

import { TRANSACTION_TYPE_OPTIONS, VOLUME_METRIC_OPTIONS } from '../../constants/condition.constant';
import { ConditionFormValues } from '../../interfaces/condition.interface';

type PropertyValueFieldProps = {
  property: string;
  path: Path<ConditionFormValues>;
  form: UseFormReturn<ConditionFormValues>;
  isView: boolean;
};

const PROPERTY_OPTIONS = {
  transaction_event: (props: PropertyValueFieldProps) => (
    <FormFieldInput
      required
      showErrorMessage
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      disabled={props.isView}
    />
  ),

  transaction_type: (props: PropertyValueFieldProps) => (
    <FormFieldSelect
      required
      showSearch
      showErrorMessage
      form={props.form}
      fieldName={props.path}
      options={TRANSACTION_TYPE_OPTIONS}
      size="sm"
      formLabel="Transaction type"
      placeholder="Select"
      className="w-full"
      disabled={props.isView}
    />
  ),

  shop_type: () => null, // Placeholder for ShopTypeSelect

  campaign_key: (props: PropertyValueFieldProps) => (
    <FormFieldInput
      required
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      showErrorMessage={false}
      disabled={props.isView}
    />
  ),

  sku: () => null, // Placeholder for ProductFamily and ProductVariant selects

  lineitem_amount: (props: PropertyValueFieldProps) => (
    <FormFieldInputNumber
      required
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      showErrorMessage={false}
      min={1}
      max={99999}
      disabled={props.isView}
    />
  ),

  transaction_amount: (props: PropertyValueFieldProps) => (
    <FormFieldInputNumber
      required
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      showErrorMessage={false}
      min={1}
      max={99999}
      disabled={props.isView}
    />
  ),

  lineitem_volume: (props: PropertyValueFieldProps) => (
    <>
      <FormFieldSelect
        required
        form={props.form}
        fieldName={`${props.path}.metric` as Path<ConditionFormValues>}
        options={VOLUME_METRIC_OPTIONS}
        size="sm"
        formLabel="Select metric"
        placeholder="Select"
        className="w-full"
        showSearch={false}
        showErrorMessage={false}
        disabled={props.isView}
      />
      <FormFieldInputNumber
        required
        form={props.form}
        fieldName={`${props.path}.amount` as Path<ConditionFormValues>}
        size="sm"
        formLabel="Enter value"
        placeholder="Enter value"
        className="w-full"
        showErrorMessage={false}
        min={1}
        max={99999}
        disabled={props.isView}
      />
    </>
  ),

  transaction_volume: (props: PropertyValueFieldProps) => (
    <>
      <FormFieldSelect
        required
        form={props.form}
        fieldName={`${props.path}.metric` as Path<ConditionFormValues>}
        options={VOLUME_METRIC_OPTIONS}
        size="sm"
        formLabel="Select metric"
        placeholder="Select"
        className="w-full"
        showSearch={false}
        showErrorMessage={false}
        disabled={props.isView}
      />
      <FormFieldInputNumber
        required
        form={props.form}
        fieldName={`${props.path}.amount` as Path<ConditionFormValues>}
        size="sm"
        formLabel="Enter value"
        placeholder="Enter value"
        className="w-full"
        showErrorMessage={false}
        min={1}
        max={99999}
        disabled={props.isView}
      />
    </>
  ),

  lineitem_quantity: (props: PropertyValueFieldProps) => (
    <FormFieldInputNumber
      required
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      showErrorMessage={false}
      min={1}
      max={99999}
      disabled={props.isView}
    />
  ),

  transaction_quantity: (props: PropertyValueFieldProps) => (
    <FormFieldInputNumber
      required
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      showErrorMessage={false}
      min={1}
      max={99999}
      disabled={props.isView}
    />
  ),

  scan_count: (props: PropertyValueFieldProps) => (
    <FormFieldInputNumber
      required
      showErrorMessage
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      min={1}
      max={99999}
      disabled={props.isView}
    />
  ),

  qr_code: (props: PropertyValueFieldProps) => (
    <FormFieldInput
      required
      showErrorMessage
      form={props.form}
      fieldName={props.path}
      size="sm"
      formLabel="Enter value"
      placeholder="Enter value"
      className="w-full"
      disabled={props.isView}
    />
  ),

  custom: (props: PropertyValueFieldProps) => (
    <>
      <FormFieldInput
        required
        showErrorMessage
        form={props.form}
        fieldName={`${props.path}.custom_property` as Path<ConditionFormValues>}
        size="sm"
        formLabel="Enter property name"
        placeholder="Enter property name"
        className="w-full"
        disabled={props.isView}
      />
      <FormFieldInput
        required
        showErrorMessage
        form={props.form}
        fieldName={`${props.path}.value` as Path<ConditionFormValues>}
        size="sm"
        formLabel="Enter value"
        placeholder="Enter value"
        className="w-full"
        disabled={props.isView}
      />
    </>
  ),
};

export const PropertyValueField = ({ property, path, form, isView }: PropertyValueFieldProps) => {
  const PropertyComponent = PROPERTY_OPTIONS[property as keyof typeof PROPERTY_OPTIONS];

  if (!PropertyComponent) return null;

  return PropertyComponent({ property, path, form, isView });
};

export default PropertyValueField;
