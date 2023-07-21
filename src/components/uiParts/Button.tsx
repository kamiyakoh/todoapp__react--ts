import type { MouseEventHandler, ReactNode, FC } from 'react';
import type { SerializedStyles } from '@emotion/react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { btn } from '../../styles/const';

interface Props {
  isSubmit: boolean;
  btnId?: string;
  cssName?: SerializedStyles | SerializedStyles[];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export const Button: FC<Props> = ({ isSubmit, btnId, cssName, onClick, children }) => {
  return (
    <button type={isSubmit ? 'submit' : 'button'} id={btnId} css={[btn, cssName]} onClick={onClick}>
      {children}
    </button>
  );
};
