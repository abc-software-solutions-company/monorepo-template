import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalConfirm from '@repo/react-web-ui-shadcn/components/modals/modal-confirm';
import { ReactFlowProvider } from '@xyflow/react';

import PageWrapper from '@/components/pages/page-wrapper';

import RuleBuilder from '@/modules/react-flow/components/rule/rule-builder';
import { RuleBuilderHeader } from '@/modules/react-flow/components/rule/rule-builder-header';
import { RuleBuilderToolbar } from '@/modules/react-flow/components/rule/rule-builder-toolbar';
import { RuleProvider } from '@/modules/react-flow/contexts/node-form.context';
import { convertResponseToNodes } from '@/modules/react-flow/dtos/rule.dto';

const data = {
  name: 'Untitled group',
  platform_type: 'YC',
  loyalty_campaign_meta: {
    id: '123',
    name: 'Untitled group',
    metadata: {
      edges: [],
    },
  },
  rulesets: [],
};

const PageRuleList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const formData = useMemo(() => {
    return convertResponseToNodes(data);
  }, []);

  const handleClose = () => {
    navigate('/rule-configuration');
  };

  const handleEdit = () => {
    navigate(`/rule/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      // toast.showToast({
      //   variant: 'success',
      //   message: 'Delete rule configuration successfully',
      // });
    } catch (error) {
      // toast.showToast({
      //   variant: 'destructive',
      //   message: 'Cannot delete rule configuration',
      // });
    } finally {
      handleClose();
    }
  };

  return (
    <PageWrapper>
      <ReactFlowProvider>
        <RuleProvider>
          <div className="flex items-center justify-between">
            <RuleBuilderHeader mode="view" ruleName={data?.loyalty_campaign_meta.name} onBack={handleClose} />
            <RuleBuilderToolbar mode="view" onDelete={() => setIsDeleteModalVisible(true)} onEdit={handleEdit} />
            <ModalConfirm
              visible={isDeleteModalVisible}
              title="Are you sure you want to delete this campaign?"
              btnNo="Cancel"
              btnYes="Delete"
              onYes={handleDelete}
              onNo={() => setIsDeleteModalVisible(false)}
            />
          </div>
          <RuleBuilder
            mode="view"
            name={data?.loyalty_campaign_meta.name}
            initNodes={formData}
            initEdges={data?.loyalty_campaign_meta.metadata?.edges ?? []}
          />
        </RuleProvider>
      </ReactFlowProvider>
    </PageWrapper>
  );
};

export default PageRuleList;
