import LoginPage from '@/app/[locale]/(main)/sign-in/page';

import { pageParams } from '@tests/unit/constants';
import { render } from '@tests/unit/utils/test.util';

describe('Sign in page', () => {
  test('should renders the page', async () => {
    const { findByTestId } = render(await LoginPage(pageParams));

    const content = await findByTestId('frm-sign-in');

    expect(content).toBeInTheDocument();
  });
});
