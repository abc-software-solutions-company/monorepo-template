import { Fact, RuleSet } from '../interfaces/condition.interface';

type ConditionType = 'and' | 'or';

type Metric = {
  metric: string;
  amount: string;
};

type CustomProperty = {
  custom_property: string;
  value: string;
};

type ProductInfo = {
  id: string;
  name: string;
};

type SkuValue = {
  product_family: ProductInfo[];
  product_variant: ProductInfo[];
};

type InputCondition = {
  sets: RuleSet[];
};

type Metadata = {
  for?: string;
  metric?: {
    id: string;
    label: string;
  };
};

type LineItemCondition = {
  key: string;
  operator: string;
  value: string | number | string[];
  metadata?: Metadata;
};

type FactCondition = {
  fact: string;
  operator: string;
  value: boolean | number | string | LineItemCondition[];
  metadata?: Metadata;
};

type ExecuteRule = {
  fact: string;
  operator: string;
  value: boolean;
};

type ConditionGroup = {
  all?: FactCondition[];
  any?: FactCondition[];
};

type SubsetGroup = {
  all?: ConditionGroup[];
  any?: ConditionGroup[];
};

type SetGroup = {
  all?: SubsetGroup[];
  any?: SubsetGroup[];
};

type PayloadCondition = {
  all: [ExecuteRule, SetGroup];
};

const NUMERIC_PROPERTIES = [
  'lineitem_volume',
  'lineitem_quantity',
  'lineitem_amount',
  'transaction_amount',
  'transaction_quantity',
  'transaction_volume',
];

const getMetricLabel = (metric: string): string => {
  const labels: { [key: string]: string } = {
    kg: 'KG',
    metric_ton: 'Metric ton',
    liters: 'Liters',
  };

  return labels[metric] || metric.toUpperCase();
};

const isNumericProperty = (property: string): boolean => {
  return NUMERIC_PROPERTIES.includes(property);
};

const handleCustomFact = (condition: FactCondition, conditionType: ConditionType): Fact => {
  return {
    property: 'custom',
    condition: condition.operator,
    value: {
      custom_property: condition.fact,
      value: condition.value.toString(),
    },
    conditionType,
  };
};

const handleMetricFact = (condition: FactCondition, conditionType: ConditionType): Fact => {
  return {
    property: condition.fact,
    condition: condition.operator,
    value: {
      metric: condition.metadata?.metric?.id as string,
      amount: condition.value.toString(),
    },
    conditionType,
  };
};

const handleSkuFact = (productFamily: string[], productVariant: string[], operator: string, conditionType: ConditionType): Fact => {
  return {
    property: 'sku',
    condition: operator,
    value: {
      product_family: productFamily.map(id => ({ id, name: '' })),
      product_variant: productVariant.map(id => ({ id, name: '' })),
    },
    conditionType,
  };
};

const handleLineItemFact = (item: LineItemCondition, conditionType: ConditionType): Fact => {
  const value = item.metadata?.metric
    ? {
        metric: item.metadata.metric.id,
        amount: item.value.toString(),
      }
    : isNumericProperty(item.key)
      ? Number(item.value)
      : item.value.toString();

  return {
    property: item.key,
    condition: item.operator,
    value,
    conditionType,
  };
};

export const convertPayloadToCondition = (payload: PayloadCondition) => {
  const mainCondition = payload.all[1] as SetGroup;
  const setConditionType = mainCondition.all ? 'all' : 'any';
  const setGroups = mainCondition.all || mainCondition.any || [];

  const convertFactConditions = (factConditions: FactCondition[], firstCondition: 'all' | 'any'): Fact[] => {
    const conditionType = firstCondition === 'all' ? 'and' : 'or';
    const facts: Fact[] = [];

    factConditions.forEach(condition => {
      // Handle lineitems
      if (condition.fact === 'lineitems' && Array.isArray(condition.value)) {
        const lineItemValues = condition.value as LineItemCondition[];
        const lineItemsByKey = lineItemValues.reduce((acc: Record<string, LineItemCondition>, item) => {
          acc[item.key] = item;

          return acc;
        }, {});

        // Handle SKU
        const productFamilyCondition = lineItemsByKey['product_family_id'];
        const variantCondition = lineItemsByKey['internal_variant_id'];

        if (productFamilyCondition && variantCondition) {
          facts.push(handleSkuFact(productFamilyCondition.value as string[], variantCondition.value as string[], condition.operator, conditionType));
        }

        // Handle other line items
        lineItemValues.forEach(item => {
          if (!['product_family_id', 'internal_variant_id'].includes(item.key)) {
            facts.push(handleLineItemFact(item, conditionType));
          }
        });

        return;
      }

      // Handle custom facts
      if (condition.metadata?.for === 'custom') {
        facts.push(handleCustomFact(condition, conditionType));

        return;
      }

      // Handle metric facts
      if (condition.metadata?.metric) {
        facts.push(handleMetricFact(condition, conditionType));

        return;
      }

      // Handle regular facts with value type checking
      facts.push({
        property: condition.fact,
        condition: condition.operator,
        value: isNumericProperty(condition.fact) ? Number(condition.value) : condition.value.toString(),
        conditionType,
      });
    });

    return facts;
  };

  return {
    sets: setGroups.map(setGroup => ({
      conditionType: setConditionType === 'all' ? 'and' : 'or',
      subsets: (setGroup.all || setGroup.any || []).map(subsetGroup => ({
        conditionType: setGroup.all ? 'and' : 'or',
        facts: convertFactConditions(subsetGroup.all || subsetGroup.any || [], subsetGroup.all ? 'all' : 'any'),
      })),
    })),
  };
};

export const convertConditionToPayload = (ruleId: string, condition: InputCondition) => {
  const lineItemProperties = ['sku', 'lineitem_volume', 'lineitem_quantity', 'lineitem_amount'];

  const convertFacts = (facts: Fact[]): FactCondition[] => {
    const lineItemConditions: LineItemCondition[] = [];
    const otherConditions: FactCondition[] = [];
    let skuCondition: string | undefined;

    facts.forEach(fact => {
      if (lineItemProperties.includes(fact.property)) {
        if (fact.property === 'sku' && fact.value && typeof fact.value === 'object' && 'product_family' in fact.value) {
          skuCondition = fact.condition;
          const skuValue = fact.value as SkuValue;

          lineItemConditions.push(
            {
              key: 'product_family_id',
              operator: 'in',
              value: skuValue.product_family.map(pf => pf.id),
            },
            {
              key: 'internal_variant_id',
              operator: 'in',
              value: skuValue.product_variant.map(pv => pv.id),
            }
          );
        } else if (fact.value && typeof fact.value === 'object' && 'metric' in fact.value && 'amount' in fact.value) {
          const metricValue = fact.value as Metric;

          lineItemConditions.push({
            key: fact.property,
            operator: fact.condition,
            value: isNumericProperty(fact.property) ? Number(metricValue.amount) : metricValue.amount,
            ...(metricValue.metric && {
              metadata: {
                metric: {
                  id: metricValue.metric,
                  label: getMetricLabel(metricValue.metric),
                },
              },
            }),
          });
        } else if (typeof fact.value === 'string' || typeof fact.value === 'number') {
          lineItemConditions.push({
            key: fact.property,
            operator: fact.condition,
            value: isNumericProperty(fact.property) ? Number(fact.value) : fact.value.toString(),
          });
        }
      } else if (fact.property === 'custom') {
        const customValue = fact.value as CustomProperty;

        otherConditions.push({
          fact: customValue.custom_property,
          operator: fact.condition,
          value: customValue.value,
          metadata: {
            for: 'custom',
          },
        });
      } else {
        if (fact.value && typeof fact.value === 'object' && 'metric' in fact.value && 'amount' in fact.value) {
          const metricValue = fact.value as Metric;

          otherConditions.push({
            fact: fact.property,
            operator: fact.condition,
            value: isNumericProperty(fact.property) ? Number(metricValue.amount) : metricValue.amount,
            ...(metricValue.metric && {
              metadata: {
                metric: {
                  id: metricValue.metric,
                  label: getMetricLabel(metricValue.metric),
                },
              },
            }),
          });
        } else {
          otherConditions.push({
            fact: fact.property,
            operator: fact.condition,
            value: isNumericProperty(fact.property) ? Number(fact.value) : fact.value.toString(),
          });
        }
      }
    });

    const conditions: FactCondition[] = [];

    if (lineItemConditions.length > 0) {
      conditions.push({
        fact: 'lineitems',
        operator: skuCondition || 'containsAll',
        value: lineItemConditions,
      });
    }

    return [...conditions, ...otherConditions];
  };

  return {
    all: [
      {
        fact: `EXECUTE_RULE_${ruleId}`,
        value: true,
        operator: 'equal',
      },
      {
        [condition?.sets[0].conditionType === 'and' ? 'all' : 'any']: condition?.sets.map(set => ({
          [set.subsets[0].conditionType === 'and' ? 'all' : 'any']: set.subsets.map(subset => ({
            [subset.facts[0].conditionType === 'and' ? 'all' : 'any']: convertFacts(subset.facts),
          })),
        })),
      },
    ],
  };
};
