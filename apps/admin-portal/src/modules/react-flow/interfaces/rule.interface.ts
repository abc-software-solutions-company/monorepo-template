import { z } from 'zod';
import { type Node } from '@xyflow/react';

import { ruleSchema, ruleSetSchema } from '../validators/rule.validator';

export type SelectOption = { id: string; name: string };

export type RuleSetFormValues = z.infer<typeof ruleSetSchema>;
export type RuleFormValues = z.infer<typeof ruleSchema>;

export type RuleSetNode = Node<RuleSetFormValues>;
export type RuleNode = Node<RuleFormValues>;

export type FlowNode = RuleSetNode | RuleNode;
