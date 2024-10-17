import { useLocation, useParams } from 'react-router-dom';

export const useRuleMode = () => {
  const { ruleConfigurationId } = useParams();
  const location = useLocation();

  const getMode = () => {
    if (!ruleConfigurationId) return 'create';

    return location.pathname.includes('edit') ? 'edit' : 'view';
  };

  const mode = getMode();

  return {
    mode,
    isView: mode === 'view',
    isEdit: mode === 'edit',
    isCreate: mode === 'create',
  };
};
