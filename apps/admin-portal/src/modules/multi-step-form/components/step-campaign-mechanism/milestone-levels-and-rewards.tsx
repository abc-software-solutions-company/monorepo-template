import classNames from 'classnames';
import { UseFormReturn } from 'react-hook-form';

import { CampaignMechanismFormValues } from '../../interfaces/campaign.interface';

type MilestoneLevelsAndRewardsProps = {
  className?: string;
  form: UseFormReturn<CampaignMechanismFormValues>;
};

const MilestoneLevelsAndRewards: React.FC<MilestoneLevelsAndRewardsProps> = ({ className }) => {
  return (
    <div className={classNames('border bg-gray-50 p-2', className)}>
      <label className="font-bold">Milestone levels and rewards</label>
      <p>Define goals for each level and configure rewards such as physical rewards, discount coupons, and Yara Points.</p>
    </div>
  );
};

export default MilestoneLevelsAndRewards;
