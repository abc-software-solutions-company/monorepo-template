import { FC } from 'react';
import { Label } from '@repo/react-web-ui-shadcn/components/ui/label';

type RuleOutcomeDisplayProps = {
  pointStrategyName?: string;
  expiryStrategyName?: string;
};

const RuleOutcomeDisplay: FC<RuleOutcomeDisplayProps> = ({ pointStrategyName, expiryStrategyName }) => (
  <div className="space-y-3">
    <Label>Outcome</Label>
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        Earn condition
        <span className="text-destructive">*</span>
      </p>
      <p className="whitespace-pre-wrap break-words break-all font-bold" style={{ wordBreak: 'keep-all' }}>
        {pointStrategyName ?? ''}
      </p>
    </div>
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        Expiry condition
        <span className="text-destructive">*</span>
      </p>
      <p className="whitespace-pre-wrap break-words break-all font-bold" style={{ wordBreak: 'keep-all' }}>
        {expiryStrategyName ?? ''}
      </p>
    </div>
  </div>
);

export default RuleOutcomeDisplay;
