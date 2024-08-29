import ErrorInformation from '@/components/errors/error-information';

function PageNotFound() {
  return <ErrorInformation code={404} />;
}

export default PageNotFound;
