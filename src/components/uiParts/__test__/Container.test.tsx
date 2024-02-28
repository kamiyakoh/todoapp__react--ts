import type { SerializedStyles } from '@emotion/react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { render } from '@testing-library/react';
import { Container } from '../Container';

const padding = css`
  padding: 80px;
`;

const minHeight = css`
  min-height: 100vh;
`;

describe('Container Test', () => {
  test.each`
    isSingle
    ${true}
    ${false}
  `('isSingle-Props Test', (isSingle: boolean) => {
    const { asFragment } = render(<Container isSingle={isSingle}>children</Container>);
    expect(asFragment()).toMatchSnapshot();
  });

  test.each`
    cssName
    ${undefined}
    ${[padding, minHeight]}
  `('addClassName Test', (cssName: SerializedStyles | SerializedStyles[]) => {
    const { asFragment } = render(
      <Container isSingle={true} cssName={cssName}>
        children
      </Container>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
