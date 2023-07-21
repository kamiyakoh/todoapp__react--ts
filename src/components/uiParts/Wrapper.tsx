import type { ReactNode, FC } from 'react';
import type { SerializedStyles } from '@emotion/react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';

interface Props {
  cssName?: SerializedStyles | SerializedStyles[];
  children: ReactNode;
}

export const Wrapper: FC<Props> = ({ cssName, children }) => {
  return <div css={[wrapper, cssName]}>{children}</div>;
};

const wrapper = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2em;
  padding: 2em 0;
`;
