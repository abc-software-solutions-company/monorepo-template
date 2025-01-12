import { Separator } from '@repo/react-web-ui-shadcn/components/ui/separator';

interface ISettingHeadingProps {
  title: string;
  description: string;
}

const SettingHeading: React.FC<ISettingHeadingProps> = ({ title, description }) => {
  return (
    <div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Separator className="my-6" />
    </div>
  );
};

export default SettingHeading;
