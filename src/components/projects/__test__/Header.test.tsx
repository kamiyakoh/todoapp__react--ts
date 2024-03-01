import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '../Header';
describe('Header Test', () => {
  test('Navigation links matching pathname', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const createLink = screen.getByText('作成');
    const activeLink = screen.getByText('進行中');
    const completedLink = screen.getByText('完了済');

    fireEvent.click(createLink);
    expect(window.location.pathname).toBe('/');

    fireEvent.click(activeLink);
    expect(window.location.pathname).toBe('/active');

    fireEvent.click(completedLink);
    expect(window.location.pathname).toBe('/comp');
  });
});
