import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ReactFlowProvider } from '@xyflow/react';

import PageWrapper from '@/components/pages/page-wrapper';

import RuleBuilder, { RuleBuilderRef } from '@/modules/react-flow/components/rule/rule-builder';
import { RuleBuilderHeader } from '@/modules/react-flow/components/rule/rule-builder-header';
import { RuleBuilderToolbar } from '@/modules/react-flow/components/rule/rule-builder-toolbar';
import { CreateRuleSetFormValues, RuleCreateRuleSetModal } from '@/modules/react-flow/components/rule/rule-create-ruleset-modal';
import { RuleProvider } from '@/modules/react-flow/contexts/node-form.context';
import { convertNodesToPayload } from '@/modules/react-flow/dtos/rule.dto';

const PageRuleNew = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payload, setPayload] = useState<unknown>();
  const ruleBuilderRef = useRef<RuleBuilderRef>(null);
  const [ruleName, setRuleName] = useState('');
  const [platformType, setPlatformType] = useState('YC');
  const [isRuleSetModalOpen, setIsRuleSetModalOpen] = useState(false);

  const handleClose = () => {
    navigate('/rule-configuration');
  };

  const handleSave = async () => {
    if (!ruleBuilderRef.current) return;

    try {
      setIsSaving(true);

      const { isValid } = await ruleBuilderRef.current.validateAllForms();

      if (!isValid) {
        return;
      }

      const ruleConfig = convertNodesToPayload(ruleName, platformType, ruleBuilderRef.current.getNodes(), ruleBuilderRef.current.getEdges());

      setPayload(ruleConfig);

      toast.success('Create Ruleset', { description: 'Create ruleset successfully' });

      // handleClose();
    } catch (error) {
      toast.error('Create Ruleset', { description: 'Cannot create ruleset' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/rule-configuration/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    alert(`delete: ${id}`);
  };

  const handleRename = () => {
    setIsRuleSetModalOpen(true);
  };

  const handleRuleSetSubmit = (data: CreateRuleSetFormValues) => {
    setRuleName(data.name);
    setPlatformType(data.platform_type);
    setIsRuleSetModalOpen(false);

    if (ruleBuilderRef.current?.isEmpty()) {
      ruleBuilderRef.current.addSet();
    }
  };

  useEffect(() => {
    if (ruleBuilderRef.current?.isEmpty()) {
      setIsRuleSetModalOpen(true);
    }
  }, []);

  return (
    <PageWrapper>
      <ReactFlowProvider>
        <RuleProvider>
          <div className="flex items-center justify-between">
            {/* <pre className="bg-slate-50 text-xs">{JSON.stringify(payload, null, 2)}</pre> */}
            <RuleBuilderHeader mode="create" ruleName={ruleName} onBack={handleClose} onRename={handleRename} />
            <RuleBuilderToolbar mode="create" isLoading={isSaving} onClose={handleClose} onSave={handleSave} />
          </div>
          <RuleBuilder ref={ruleBuilderRef} mode="create" onSave={handleSave} onClose={handleClose} onEdit={handleEdit} onDelete={handleDelete} />
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

export default PageRuleNew;
