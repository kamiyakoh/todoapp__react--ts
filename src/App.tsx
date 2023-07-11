import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { New } from './components/pages/New';
// import { Test } from './components/pages/Test';

export const App = (): JSX.Element => {
  return (
    <div>
      <RecoilRoot>
        <BrowserRouter>
          <New />
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
};
