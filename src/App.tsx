import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Header } from './components/projects/Header';
import { Router } from './routers/Router';
import { toastBoard } from './styles/const';

export const App = (): JSX.Element => {
  return (
    <div>
      <RecoilRoot>
        <BrowserRouter>
          <Header />
          <main
            css={css`
              padding-top: 80px;
            `}
          >
            <Router />
          </main>
          <Toaster toastOptions={{ className: '', style: toastBoard }} />
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
};
