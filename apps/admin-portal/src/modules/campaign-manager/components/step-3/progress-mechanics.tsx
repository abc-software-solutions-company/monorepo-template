import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { PenIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '~react-web-ui-shadcn/components/ui/button';
import { Label } from '~react-web-ui-shadcn/components/ui/label';

import { DataTable } from '@/components/data-table/data-table';

import ModalProgressMechanics from './modal-progress-mechanics';

import { CampaignStep3FormValues, ProgressMechanicFormValues } from '../../interfaces/campaign.interface';

type ProgressMechanicsProps = {
  className?: string;
  form: UseFormReturn<CampaignStep3FormValues>;
};

const ProgressMechanics: React.FC<ProgressMechanicsProps> = ({ className, form }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'progressMechanics' });
  const progressMechanics = form.watch('progressMechanics');

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

  const handleSaveProgressMechanics = (data: ProgressMechanicFormValues, index?: number) => {
    if (index !== undefined) {
      form.setValue(`progressMechanics.${index}.ruleName`, data.ruleName);
      form.setValue(`progressMechanics.${index}.campaignRule`, data.campaignRule);
      form.setValue(`progressMechanics.${index}.trackerType`, data.trackerType);
      form.setValue(`progressMechanics.${index}.trackerValue`, data.trackerValue);
      form.setValue(`progressMechanics.${index}.triggers`, data.triggers);
    } else {
      append({
        ruleName: data.ruleName,
        campaignRule: data.campaignRule,
        trackerType: data.trackerType,
        trackerValue: data.trackerValue,
        triggers: data.triggers,
      });
    }
    setIsModalVisible(false);
  };

  const columns = useMemo<ColumnDef<ProgressMechanicFormValues>[]>(
    () => [
      {
        accessorKey: 'campaignRule',
        size: 200,
        header: () => <Label>Campaign Rule</Label>,
        cell: ({ row }) => {
          const index = parseInt(row.id);

          return <p className="flex items-center">{progressMechanics[index]?.campaignRule}</p>;
        },
      },
      {
        accessorKey: 'ruleName',
        size: 0,
        header: () => <Label>Rule Name</Label>,
        cell: ({ row }) => {
          const index = parseInt(row.id);

          return <p className="flex items-center">{progressMechanics[index]?.ruleName}</p>;
        },
      },
      {
        accessorKey: 'trackerValue',
        size: 0,
        header: () => <Label>Tracker Value</Label>,
        cell: ({ row }) => {
          const index = parseInt(row.id);

          return <p className="flex items-center">{progressMechanics[index]?.trackerValue}</p>;
        },
      },
      {
        id: 'actions',
        size: 120,
        header: () => <Label>Actions</Label>,
        cell: ({ row }) => {
          const index = parseInt(row.id);

          return (
            <div className="flex gap-3">
              <Button type="button" size="icon-sm" variant="secondary" onClick={() => handleEditProgressMechanic(index)}>
                <PenIcon size={20} className="text-green-500" />
              </Button>
              <Button type="button" size="icon-sm" variant="secondary" onClick={() => handleRemoveProgressMechanic(index)}>
                <Trash2Icon size={20} className="text-destructive" />
              </Button>
            </div>
          );
        },
      },
    ],
    [progressMechanics]
  );

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={classNames('rounded-lg border p-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <Label>Progress Mechanics</Label>
          <p className="mb-4">Set rules for campaign, a maximum of 3 rules can be created for each campaign.</p>
        </div>
        <Button type="button" disabled={fields.length >= 3} onClick={handleAddProgressMechanics}>
          <PlusIcon /> Add rule
        </Button>
      </div>
      <DataTable table={table} columns={columns} isFetching={false} />
      <ModalProgressMechanics
        form={form}
        visible={isModalVisible}
        editIndex={editIndex}
        onSave={handleSaveProgressMechanics}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default ProgressMechanics;
