import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import { PenIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { Form } from '@repo/react-web-ui-shadcn/components/ui/form';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';

import ModalRules from './modal-rules';

import { RuleFormValues, RulesFormValues } from '../../interfaces/campaign.interface';
import { rulesAtom } from '../../states/campaign.state';
import { rulesSchema } from '../../validators/campaign-step-3.validator';

type RulesProps = {
  className?: string;
};

const Rules: React.FC<RulesProps> = ({ className }) => {
  const [ruleItems, setRuleItems] = useAtom(rulesAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const form = useForm<RulesFormValues>({ resolver: zodResolver(rulesSchema), defaultValues: { rules: ruleItems } });
  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'rules' });

  const rules = form.watch('rules') ?? [];

  const handleAddRule = () => {
    setEditingIndex(-1);
    setIsModalVisible(true);
    form.reset({ rules: ruleItems });
  };

  const handleEditRule = (index: number) => {
    setEditingIndex(index);
    setIsModalVisible(true);
  };

  const handleRemoveRule = (index: number) => {
    setRuleItems(prev => {
      const newItems = [...prev];

      newItems.splice(index, 1);

      return newItems;
    });
    remove(index);
  };

  const handleSaveRule = (data: RuleFormValues, index: number) => {
    if (index !== -1) {
      form.setValue(`rules.${index}.ruleName`, data.ruleName);
      form.setValue(`rules.${index}.campaignRule`, data.campaignRule);
      form.setValue(`rules.${index}.trackerType`, data.trackerType);
      form.setValue(`rules.${index}.trackerValue`, data.trackerValue);
      form.setValue(`rules.${index}.triggers`, data.triggers);
      setRuleItems(prev => {
        const newItems = [...prev];

        newItems[index] = data;

        return newItems;
      });
    } else {
      append(data);
      setRuleItems(prev => [...prev, data]);
    }
    setIsModalVisible(false);
  };

  const columns = useMemo<ColumnDef<RuleFormValues>[]>(
    () => [
      {
        accessorKey: 'campaignRule',
        size: 200,
        header: () => <Label>Campaign Rule</Label>,
        cell: ({ row }) => {
          const index = parseInt(row.id);

          return <p className="flex items-center">{rules[index]?.campaignRule}</p>;
        },
      },
      {
        accessorKey: 'ruleName',
        size: 0,
        header: () => <Label>Rule Name</Label>,
        cell: ({ row }) => {
          const index = parseInt(row.id);

          return <p className="flex items-center">{rules[index]?.ruleName}</p>;
        },
      },
      {
        accessorKey: 'trackerValue',
        size: 0,
        header: () => <Label>Tracker Value</Label>,
        cell: ({ row }) => {
          const index = parseInt(row.id);

          return <p className="flex items-center">{rules[index]?.trackerValue}</p>;
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
              <Button type="button" size="icon-sm" variant="secondary" onClick={() => handleEditRule(index)}>
                <PenIcon size={20} className="text-green-500" />
              </Button>
              <Button type="button" size="icon-sm" variant="secondary" onClick={() => handleRemoveRule(index)}>
                <Trash2Icon size={20} className="text-destructive" />
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rules]
  );

  const table = useReactTable({
    data: rules,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    form.reset({ rules: ruleItems });
  }, [ruleItems, form]);

  return (
    <Form {...form}>
      <form>
        <div className={classNames('rounded-lg border p-4', className)}>
          <div className="flex items-start justify-between">
            <div>
              <Label>Progress Mechanics</Label>
              <p className="mb-4">Set rules for campaign, a maximum of 3 rules can be created for each campaign.</p>
            </div>
            <Button disabled={fields.length >= 3} onClick={handleAddRule}>
              <PlusIcon /> Add rule
            </Button>
          </div>
          <DataTable table={table} columns={columns} isFetching={false} />
          <ModalRules
            form={form}
            visible={isModalVisible}
            editIndex={editingIndex}
            onSave={handleSaveRule}
            onClose={() => setIsModalVisible(false)}
          />
        </div>
        <pre className="overflow-hidden rounded-md border-slate-200 p-2 text-xs">{JSON.stringify(form.watch(), null, 2)}</pre>
      </form>
    </Form>
  );
};

export default Rules;
