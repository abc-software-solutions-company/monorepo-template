import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ReactFlowProvider } from '@xyflow/react';

import PageWrapper from '@/components/pages/page-wrapper';

import RuleBuilder, { RuleBuilderRef } from '@/modules/react-flow/components/rule/rule-builder';
import { RuleBuilderHeader } from '@/modules/react-flow/components/rule/rule-builder-header';
import { RuleBuilderToolbar } from '@/modules/react-flow/components/rule/rule-builder-toolbar';
import { CreateRuleSetFormValues, RuleCreateRuleSetModal } from '@/modules/react-flow/components/rule/rule-create-ruleset-modal';
import { RuleProvider } from '@/modules/react-flow/contexts/node-form.context';
import { convertNodesToPayload, convertResponseToNodes } from '@/modules/react-flow/dtos/rule.dto';

const data = {
  id: crypto.randomUUID(),
  name: 'Untitled group',
  platform_type: 'YC',
  loyalty_campaign_meta: {
    id: '123',
    name: 'Untitled group',
    metadata: {
      edges: [],
    },
  },
};
const PageRuleEdit = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payload, setPayload] = useState<unknown>();
  const ruleBuilderRef = useRef<RuleBuilderRef>(null);
  const [ruleName, setRuleName] = useState('');
  const [platformType, setPlatformType] = useState('YC');
  const [isRuleSetModalOpen, setIsRuleSetModalOpen] = useState(false);

  const formData = useMemo(() => {
    return convertResponseToNodes(data);
  }, []);

  const handleClose = () => {
    navigate('/rule');
  };

  const handleSave = async () => {
    if (!ruleBuilderRef.current) return;

    try {
      setIsSaving(true);

      const { isValid } = await ruleBuilderRef.current.validateAllForms();

      if (!isValid) {
        return;
      }

      const ruleConfig = convertNodesToPayload(
        ruleName,
        platformType,
        ruleBuilderRef.current.getNodes(),
        ruleBuilderRef.current.getEdges(),
        data?.id,
        data?.loyalty_campaign_meta.id
      );

      setPayload(ruleConfig);

      toast.success('Create Ruleset', { description: 'Create ruleset successfully' });

      // handleClose();
    } catch (error) {
      toast.error('Create Ruleset', { description: 'Cannot create ruleset' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRename = () => {
    setIsRuleSetModalOpen(true);
  };

  const handleRuleSetSubmit = (formValues: CreateRuleSetFormValues) => {
    setRuleName(formValues.name);
    setPlatformType(formValues.platform_type);
    setIsRuleSetModalOpen(false);
  };

  useEffect(() => {
    setRuleName(data?.loyalty_campaign_meta.name);
    setPlatformType(data?.platform_type);
  }, []);

  return (
    <PageWrapper>
      <ReactFlowProvider>
        <RuleProvider>
          <div className="flex items-center justify-between">
            {/* <pre className="bg-slate-50 text-xs">{JSON.stringify(payload, null, 2)}</pre> */}
            <RuleBuilderHeader mode="edit" ruleName={ruleName} onBack={handleClose} onRename={handleRename} />
            <RuleBuilderToolbar mode="edit" isLoading={isSaving} onClose={handleClose} onSave={handleSave} />
          </div>
          <RuleBuilder
            ref={ruleBuilderRef}
            mode="edit"
            name={ruleName}
            initNodes={formData}
            initEdges={data?.loyalty_campaign_meta.metadata?.edges ?? []}
            onSave={handleSave}
            onClose={handleClose}
          />
          <RuleCreateRuleSetModal
            isOpen={isRuleSetModalOpen}
            title="Group Name"
            defaultValues={{ name: ruleName, platform_type: platformType }}
            onClose={() => setIsRuleSetModalOpen(false)}
            onSubmit={handleRuleSetSubmit}
          />
        </RuleProvider>
      </ReactFlowProvider>
    </PageWrapper>
  );
};

export default PageRuleEdit;
