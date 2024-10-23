import React, { useState } from 'react';
import classNames from 'classnames';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button } from '~react-web-ui-shadcn/components/ui/button';

import ModalProgressMechanics from './modal-progress-mechanics';

import { CampaignMechanismFormValues, ConfigureProgressMechanicsFormValues } from '../../interfaces/campaign.interface';

type ProgressMechanicsProps = {
  className?: string;
  form: UseFormReturn<CampaignMechanismFormValues>;
};

const ProgressMechanics: React.FC<ProgressMechanicsProps> = ({ className, form }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'progressMechanics' });

  const handleAddProgressMechanics = () => {
    setEditIndex(undefined);
    setModalMode('add');
    setIsModalVisible(true);
  };

  const handleEditProgressMechanic = (index: number) => {
    setEditIndex(index);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleRemoveProgressMechanic = (index: number) => {
    remove(index);
  };

  const handleSaveProgressMechanics = (data: ConfigureProgressMechanicsFormValues, index?: number) => {
    if (index !== undefined) {
      form.setValue(`progressMechanics.${index}.name`, data.name);
      form.setValue(`progressMechanics.${index}.campaignRule`, data.campaignRule);
    } else {
      append({
        name: data.name,
        campaignRule: data.campaignRule,
        triggers: data.triggers,
      });
    }

    setIsModalVisible(false);
  };

  return (
    <div className={classNames('border bg-gray-50 p-4', className)}>
      <label className="mb-2 block font-bold">Progress Mechanics</label>
      <p className="mb-4">Set rules for campaign, a maximum of 3 rules can be created for each campaign.</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Campaign Rule</th>
            <th className="border p-2 text-left">Rule name</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id} className="border-b">
              <td className="border p-2">{form.getValues(`progressMechanics.${index}.campaignRule`)}</td>
              <td className="border p-2">{form.getValues(`progressMechanics.${index}.name`)}</td>
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
        title={'Configure progress mechanics'}
        mode={modalMode}
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
