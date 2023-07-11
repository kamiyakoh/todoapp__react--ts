import type { ReactNode } from 'react';
import type { SerializedStyles } from '@emotion/react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

interface Props {
  cssName?: SerializedStyles | SerializedStyles[];
  isSingle: boolean;
  children: ReactNode;
}

export const Container = ({ cssName, isSingle, children }: Props): JSX.Element => {
  return <div css={[container, cssName, isSingle ? single : multi]}>{children}</div>;
};

const container = css`
  width: 90%;
  margin: 0 auto;
`;
const single = css`
  max-width: 720px;
`;
const multi = css`
  max-width: 1280px;
`;
