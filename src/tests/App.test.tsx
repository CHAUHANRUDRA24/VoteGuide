import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getAllByRole('navigation')[0]).toBeInTheDocument();
  });
});
