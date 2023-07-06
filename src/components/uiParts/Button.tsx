import type { MouseEventHandler, ReactNode } from 'react';
import type { SerializedStyles } from '@emotion/react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { btn } from '../../styles/const';

interface Props {
  isSubmit: boolean;
  btnId?: string;
  cssName?: SerializedStyles;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export const Button = ({ isSubmit, btnId, cssName, onClick, children }: Props): JSX.Element => {
  return (
    <button type={isSubmit ? 'submit' : 'button'} id={btnId} css={[btn, cssName]} onClick={onClick}>
      {children}
    </button>
  );
};
