import { render } from '@tests/unit/setup/test.util';

import Footer from '../footer';

describe('Footer Component', () => {
  test('should renders the footer', async () => {
    const { findByTestId } = render(<Footer />);

    const contentElm = await findByTestId('content');
    const linkElm = await findByTestId('link');

    expect(contentElm).toBeInTheDocument();
    expect(contentElm).toHaveTextContent('Designed and built with ❤️ by Ammodesk');
    expect(linkElm).toBeInTheDocument();
    expect(linkElm).toHaveAttribute('href', '#');
    expect(linkElm).toHaveAttribute('target', '_blank');
    expect(linkElm).toHaveAttribute('rel', 'noreferrer');
  });
});
