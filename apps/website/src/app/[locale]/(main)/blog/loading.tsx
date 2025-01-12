import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';

export default async function PostLoading() {
  return (
    <div className="grow">
      <Loading />
    </div>
  );
}
