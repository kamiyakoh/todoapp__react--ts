import { render } from '@testing-library/react';
import { Board } from '../Board';

describe('Board Test', () => {
  test('render', () => {
    const { asFragment } = render(<Board>children</Board>);
    expect(asFragment()).toMatchSnapshot();
  });
});
