import classNames from 'classnames';
import { z } from 'zod';

import { campaignMechanismSchema } from '../../validators/campaign-mechanism.validator';

export type CampaignConfirmationValues = z.infer<typeof campaignMechanismSchema>;

type CampaignConfirmationProps = {
  className?: string;
};

const CampaignConfirmation: React.FC<CampaignConfirmationProps> = ({ className }) => {
  return (
    <div className={classNames(className)}>
      <strong>Progress Mechanics</strong>
      <p>Set rules for campaign, a maximum of 3 rules can be created for each campaign.</p>
    </div>
  );
};

export default CampaignConfirmation;
