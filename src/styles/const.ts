/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface bp {
  sp: number;
  tab: number;
  ex: number;
}
const breakpoints: bp = { sp: 600, tab: 960, ex: 1422 };
export const mq = (bp: keyof bp): string => {
  return `@media (width < ${breakpoints[bp]}px)`;
};

export const pink = css`
  --color: #ff7fbf;
`;
export const blue = css`
  --color: #6fd1ff;
`;
export const yellow = css`
  --color: #ffff6b;
`;
export const green = css`
  --color: #8fff70;
`;
export const size2 = css`
  --size: 2;
`;
export const size3 = css`
  --size: 3;
`;
export const textOrange = css`
  color: #ff6c00;
`;
export const textPink = css`
  color: #ff7fbf;
`;
export const textYellow = css`
  color: #ffff6b;
`;
export const bgLightYellow = css`
  background: #fbfbab;
`;
export const bgLightPink = css`
  background: #ffd9ec;
`;
export const dBlock = css`
  display: block;
`;
export const dInline = css`
  display: inline;
`;
export const dNone = css`
  display: none;
`;
export const fs3 = css`
  font-size: 3rem;
`;
export const fwBold = css`
  font-weight: bold;
`;
export const singleBoard = css`
  width: 100%;
  margin: 2em auto;
`;
export const sec = css`
  min-height: calc(100vh - 80px);
  padding: 32px 0;
`;
export const form = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  ${mq('sp')} {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 24px;
  }

  div {
    * + * {
      margin-top: 8px;
    }
    label + button {
      margin-top: 24px;
    }
  }

  input {
    display: block;
    width: 100%;
  }
`;
export const btn = css`
  cursor: pointer;
  color: var(--color, #fff);
  background-color: transparent;
  border-radius: calc(var(--size, 1) * 2px + 2px);
  border: solid 2px var(--color, #fff);
  font-size: calc(var(--size, 1) * 1rem);
  line-height: 1;
  padding: calc(var(--size, 1) * 2px + 2px);
  border-width: calc(var(--size, 1) * 2px);
`;
export const toastBoard = {
  padding: '1em',
  background: '#202020',
  color: '#fff',
  border: '8px solid #8b4513',
  borderRadius: '3px',
  boxShadow: '0 0 5px #333, 0 0 5px #555 inset',
};
