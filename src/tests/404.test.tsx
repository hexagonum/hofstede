import NotFoundPage from '@/pages/404';
import { render } from '@testing-library/react';

describe('NotFoundPage', () => {
  it('to match snapshot', () => {
    const { container } = render(<NotFoundPage />);
    expect(container).toMatchSnapshot();
  });
});
