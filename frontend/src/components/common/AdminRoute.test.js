import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const TestComponent = () => <div>Admin Content</div>;

const MockedAdminRoute = ({ initialEntry = '/' }) => (
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      <Route
        path="/"
        element={
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        }
      />
    </Routes>
  </MemoryRouter>
);

describe('AdminRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state while checking authentication', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
    });

    render(<MockedAdminRoute />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    render(<MockedAdminRoute />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders children when user is ADMIN', () => {
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

    render(<MockedAdminRoute />);

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('redirects to dashboard when user is MEMBER', () => {
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

    render(<MockedAdminRoute />);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  test('redirects to dashboard when user is TRAINEE', () => {
    const mockUser = {
      id: '1',
      name: 'Trainee User',
      email: 'trainee@example.com',
      role: 'TRAINEE',
    };

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
    });

    render(<MockedAdminRoute />);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
