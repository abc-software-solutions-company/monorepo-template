import SignUpPage from '@/app/[locale]/(main)/sign-up/page';

import { pageParams } from '@tests/unit/constants';
import { render } from '@tests/unit/utils/test.util';

describe('Sign up page', () => {
  test('should renders the page', async () => {
    const { findByTestId } = render(await SignUpPage(pageParams));

    const content = await findByTestId('frm-sign-up');

    expect(content).toBeInTheDocument();
  });
});
