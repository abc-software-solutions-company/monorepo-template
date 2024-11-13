import classNames from 'classnames';
import { z } from 'zod';

import { campaignStep3Schema } from '../../validators/campaign-step-3.validator';

export type CampaignConfirmationValues = z.infer<typeof campaignStep3Schema>;

type CampaignConfirmationProps = {
  className?: string;
};

const CampaignConfirmation: React.FC<CampaignConfirmationProps> = ({ className }) => {
  return (
    <div className={classNames(className)}>
      <p>Review your campaign</p>
    </div>
  );
};

export default CampaignConfirmation;
