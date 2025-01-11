/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Add typesafe
import { getDateWithoutTimeZone, setUTCEndOfDay, setUTCStartOfDay } from '@repo/shared-universal/utils/date.util';
import { type Edge, type Node } from '@xyflow/react';

import { FLOW_NODE_WIDTH } from '../constants/rule.constant';

import { convertConditionToPayload, convertPayloadToCondition } from './expression.dto';

export function convertResponseToNodes(response: any) {
  const nodes: Node<any>[] = [];

  response?.rulesets.forEach((ruleset: any) => {
    // Create set node
    const setNode = {
      id: ruleset.id,
      type: 'set',
      dragHandle: '.node-header',
      position: ruleset.metadata.position,
      data: {
        width: FLOW_NODE_WIDTH,
        label: ruleset.ruleset_name,
        date_type: ruleset.start_date ? 'specific_date' : 'no_limit',
        date_range:
          ruleset.start_date && ruleset.end_date
            ? {
                from: getDateWithoutTimeZone(ruleset.start_date),
                to: getDateWithoutTimeZone(ruleset.end_date),
              }
            : undefined,
        tracker_type: ruleset.tracker_type,
        tracker_entity: ruleset.tracker_entity ?? undefined,
        max_points_overall: ruleset.max_points_overall?.toString() ?? undefined,
        max_points_per_user: ruleset.max_points_per_user?.toString() ?? undefined,
        action_ids: Array.from(new Map(ruleset.action_mappers.map((mapper: any) => [mapper.action_id, { id: mapper.action_id, name: '' }])).values()),
      },
    };

    nodes.push(setNode);

    // Create rule nodes
    ruleset.rules.forEach((rule: any) => {
      const ruleNode: any = {
        id: rule.id,
        type: 'rule',
        dragHandle: '.node-header',
        position: rule.metadata.position,
        data: {
          width: FLOW_NODE_WIDTH,
          label: rule.rule_name,
          metadata: {
            ruleset_id: ruleset.id,
            parent_node_id: rule.metadata?.parent_node_id,
            level: rule.metadata?.level,
          },
          conditions: convertPayloadToCondition(rule.expression.conditions),
        },
      };

      // Add rule outcomes if they exist
      const pointOutcome = rule.outcomes?.find((o: any) => o.action_type === 'AWARD_POINTS');

      if (pointOutcome) {
        ruleNode.data.rule_outcomes = {
          id: pointOutcome.id,
          points_strategy_id: pointOutcome.action_params.points_strategy_id,
          expiry_strategy_id: pointOutcome.action_params.expiry_strategy_id,
        };
      }

      nodes.push(ruleNode);
    });
  });

  return nodes;
}

export function convertNodesToPayload(
  ruleName: string,
  platformType: string,
  nodes: Node<any>[],
  edges: Edge[],
  coreRuleId?: string,
  campaignId?: string
) {
  const output: any = {
    id: coreRuleId,
    campaign_type: 'CoreLoyalty',
    platform_type: platformType,
    loyalty_campaign_meta: {
      id: campaignId,
      name: ruleName,
      metadata: {
        edges,
      },
    },
    action_ids: [],
    rulesets: [],
  };

  // First, process set nodes to create rulesets
  const setNodes = nodes.filter(node => node.type === 'set');

  setNodes.forEach(setNode => {
    const ruleset: any = {
      id: setNode.id,
      ruleset_for: 'CoreLoyalty',
      ruleset_name: setNode.data.label,
      start_date: setNode.data.date_range?.from ? setUTCStartOfDay(setNode.data.date_range?.from) : undefined,
      end_date: setNode.data.date_range?.to ? setUTCEndOfDay(setNode.data.date_range?.to) : undefined,
      max_points_per_user: setNode.data.max_points_per_user ? parseInt(setNode.data.max_points_per_user) : undefined,
      max_points_overall: setNode.data.max_points_overall ? parseInt(setNode.data.max_points_overall) : undefined,
      tracker_type: setNode.data.tracker_type,
      tracker_entity: setNode.data.tracker_type === 'FIXED' ? undefined : setNode.data.tracker_entity,
      action_ids: setNode.data.action_ids?.map((action: any) => action.id) || [],
      rule_id_to_execute_after_initial_expression_rule_id: '',
      metadata: {
        position: setNode.position,
      },
      rules: [],
    };

    // Find all rules associated with this ruleset
    const relatedRules = nodes.filter(node => node.type === 'rule' && node.data.metadata?.ruleset_id === setNode.id);

    // Find the primary rule (one with level equal to 1)
    const primaryRule = relatedRules.find(rule => rule.data.metadata.level === 1);

    if (primaryRule) {
      ruleset.rule_id_to_execute_after_initial_expression_rule_id = primaryRule.id;
    }

    // Process rules
    relatedRules.forEach(ruleNode => {
      const rule: any = {
        id: ruleNode.id,
        rule_name: ruleNode.data.label,
        expression: {
          conditions: convertConditionToPayload(ruleNode.id, ruleNode.data.conditions) || {},
        },
        rule_outcomes: [],
        metadata: {
          position: ruleNode.position,
          ruleset_id: setNode.id,
          parent_node_id: ruleNode.data.metadata?.parent_node_id,
          level: ruleNode.data.metadata?.level,
        },
      };

      // Add forwarding outcomes for child rules
      const childRules = relatedRules.filter(r => r.data.metadata?.parent_node_id === ruleNode.id);

      childRules.forEach(childRule => {
        rule.rule_outcomes.push({
          id: crypto.randomUUID(),
          action_type: 'FORWARD_TO_RULE',
          action_value: {
            id: childRule.id,
          },
        });
      });

      // Add rule outcomes
      if (ruleNode.data.rule_outcomes) {
        rule.rule_outcomes.push({
          id: ruleNode.data.rule_outcomes.id,
          action_type: 'AWARD_POINTS',
          action_value: {
            awarded_for: 'RULE_SATISFIED',
            points_strategy_id: ruleNode.data.rule_outcomes.points_strategy_id,
            expiry_strategy_id: ruleNode.data.rule_outcomes.expiry_strategy_id,
            tracking_entity: setNode.data.tracker_entity,
          },
        });
      }

      ruleset.rules.push(rule);
    });

    output.rulesets.push(ruleset);
  });

  // Set all collected action IDs
  const actionIds = [...new Set(setNodes.flatMap(item => item.data.action_ids?.map((action: any) => action.id)))];

  output.action_ids = actionIds;

  return output;
}
