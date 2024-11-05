import React, { useState } from 'react';
import classNames from 'classnames';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button } from '~react-web-ui-shadcn/components/ui/button';

import ModalProgressMechanics from './modal-progress-mechanics';

type ProgressMechanicsProps = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
};

const ProgressMechanics: React.FC<ProgressMechanicsProps> = ({ className, form }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'progressMechanics' });

  const handleAddProgressMechanics = () => {
    setEditIndex(undefined);
    setIsModalVisible(true);
  };

  const handleEditProgressMechanic = (index: number) => {
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const handleRemoveProgressMechanic = (index: number) => {
    remove(index);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveProgressMechanics = (data: any, index?: number) => {
    if (index !== undefined) {
      form.setValue(`progressMechanics.${index}.ruleName`, data.ruleName);
      form.setValue(`progressMechanics.${index}.campaignRule`, data.campaignRule);
    } else {
      append({ ruleName: data.ruleName, campaignRule: data.campaignRule });
    }

    setIsModalVisible(false);
  };

  return (
    <div className={classNames('border bg-gray-50 p-4', className)}>
      <strong>Progress Mechanics</strong>
      <p className="mb-4">Set rules for campaign, a maximum of 3 rules can be created for each campaign.</p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Campaign Rule</th>
            <th className="border p-2 text-left">Rule name</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id} className="border-b">
              <td className="border p-2">{form.getValues(`progressMechanics.${index}.campaignRule`)}</td>
              <td className="border p-2">{form.getValues(`progressMechanics.${index}.ruleName`)}</td>
              <td className="border p-2">
                <Button type="button" onClick={() => handleRemoveProgressMechanic(index)}>
                  Remove
                </Button>
                <Button type="button" onClick={() => handleEditProgressMechanic(index)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button type="button" disabled={fields.length >= 3} className="mt-4" onClick={handleAddProgressMechanics}>
        Add Progress Mechanic
      </Button>
      <ModalProgressMechanics
        form={form}
        visible={isModalVisible}
        editIndex={editIndex}
        onSave={(data, index) => {
          handleSaveProgressMechanics(data, index);
          setIsModalVisible(false);
        }}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default ProgressMechanics;
