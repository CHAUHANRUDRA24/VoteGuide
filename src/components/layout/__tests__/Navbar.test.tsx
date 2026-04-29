import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock Firebase auth specifically so it doesn't fail parsing or initialization
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null);
    return () => {};
  }),
  signOut: vi.fn(),
}));

describe('Navbar Component', () => {
  it('renders navbar correctly', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getAllByRole('navigation')[0]).toBeInTheDocument();
  });
});
