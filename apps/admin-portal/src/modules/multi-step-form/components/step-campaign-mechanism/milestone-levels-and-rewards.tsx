import classNames from 'classnames';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { ProgressMechanicsValues } from '../../interfaces/campaign.interface';
import { campaignMechanismSchema } from '../../validators/campaign-mechanism.validator';

export type MilestoneLevelsAndRewardsValues = z.infer<typeof campaignMechanismSchema>;

type MilestoneLevelsAndRewardsProps = {
  className?: string;
  form: UseFormReturn<ProgressMechanicsValues>;
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
