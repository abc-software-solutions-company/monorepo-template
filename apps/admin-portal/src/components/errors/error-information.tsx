import { FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslations } from 'use-intl';
import { Button } from '@repo/react-web-ui-shadcn/components/ui/button';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

type ErrorInformationType = {
  code?: number;
  title?: string;
  message?: string;
  stack?: string;
  cause?: string;
  onBackClick?: () => void;
};

const ErrorInformation: FC<ErrorInformationType> = ({ code, title, message, stack, cause, onBackClick }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <section className="relative py-24" data-testid="error-info">
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="md:max-w-4xl">
            <span className="text-4xl font-bold leading-tight text-primary md:text-5xl">{t('something_went_wrong')}</span>
            <h2 className="font-boldmd:text-3xl my-4 text-2xl">{code}</h2>
            <p className="mb-6 text-lg text-gray-400 md:text-xl">{title}</p>
            <p>{message}</p>
            <code className="mb-6 text-sm text-gray-400 md:text-xl">
              <pre>{stack}</pre>
              <pre>{cause}</pre>
            </code>
            <div className="flex flex-wrap space-x-2">
              <Button
                onClick={() => {
                  onBackClick
                    ? onBackClick()
                    : navigate({
                        pathname: '/',
                        search: `?${objectToQueryString({ sidebar: searchParams.get('sidebar') })}`,
                      });
                }}
              >
                {t('back_to_home')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorInformation;
