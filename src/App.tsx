import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Router } from './routers/Router';
import { toastBoard } from './styles/const';

export const App = (): JSX.Element => {
  return (
    <div>
      <RecoilRoot>
        <BrowserRouter>
          <main>
            <Router />
          </main>
          <Toaster toastOptions={{ className: '', style: toastBoard }} />
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
};
