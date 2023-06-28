import type { FC } from 'react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { textPink } from './styles/const';
import logo from './logo.svg';
import './App.css';

const App: FC = () => {
  const fs4 = css`
    font-size: 4em;
  `;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p css={[fs4, textPink]}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
