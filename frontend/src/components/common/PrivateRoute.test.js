import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;

const MockedPrivateRoute = ({ allowedRoles = [], initialEntry = '/' }) => (
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      <Route
        path="/"
        element={
          <PrivateRoute allowedRoles={allowedRoles}>
            <TestComponent />
          </PrivateRoute>
        }
      />
    </Routes>
  </MemoryRouter>
);

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state while checking authentication', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
    });

    render(<MockedPrivateRoute />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    render(<MockedPrivateRoute />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders children when user is authenticated', () => {
    const mockUser = {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      role: 'MEMBER',
    };

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
    });

    render(<MockedPrivateRoute />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('renders children when user has allowed role', () => {
    const mockUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    };

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
    });

    render(<MockedPrivateRoute allowedRoles={['ADMIN']} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to dashboard when user does not have allowed role', () => {
    const mockUser = {
      id: '1',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'MEMBER',
    };

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
    });

    render(<MockedPrivateRoute allowedRoles={['ADMIN']} />);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  test('allows access when allowedRoles is empty array', () => {
    const mockUser = {
      id: '1',
      name: 'Any User',
      email: 'any@example.com',
      role: 'TRAINEE',
    };

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
    });

    render(<MockedPrivateRoute allowedRoles={[]} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('allows access for multiple allowed roles', () => {
    const mockUser = {
      id: '1',
      name: 'Member User',
      email: 'member@example.com',
      role: 'MEMBER',
    };

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
    });

    render(<MockedPrivateRoute allowedRoles={['ADMIN', 'MEMBER']} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
