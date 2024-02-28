import type { SerializedStyles } from '@emotion/react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { render } from '@testing-library/react';
import { Wrapper } from '../Wrapper';

const margin = css`
  margin: 80px;
`;

const minHeight = css`
  min-height: 100vh;
`;

describe('Wrapper Test', () => {
  test.each`
    cssName
    ${undefined}
    ${[margin, minHeight]}
  `('render', (cssName: SerializedStyles | SerializedStyles[]) => {
    const { asFragment } = render(<Wrapper cssName={cssName}>children</Wrapper>);
    expect(asFragment()).toMatchSnapshot();
  });
});
