jest.mock('react-toastify');
jest.mock('../services/authService');
jest.mock('../services/api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import authService from '../services/authService';

const MockedLogin = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authService.isAuthenticated.mockReturnValue(false);
  });

  test('renders login form', () => {
    render(<MockedLogin />);

    expect(screen.getByText('NaSalinha')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Check-in Gamificado')).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('renders forgot password link', () => {
    render(<MockedLogin />);
    expect(screen.getByText('Esqueci minha senha')).toBeInTheDocument();
  });

  test('renders register link', () => {
    render(<MockedLogin />);
    expect(screen.getByText(/não tem uma conta/i)).toBeInTheDocument();
    expect(screen.getByText(/registre-se/i)).toBeInTheDocument();
  });

  test('updates email input value on change', () => {
    render(<MockedLogin />);
    const emailInput = screen.getByLabelText(/e-mail/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput).toHaveValue('test@example.com');
  });

  test('updates password input value on change', () => {
    render(<MockedLogin />);
    const passwordInput = screen.getByLabelText(/senha/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput).toHaveValue('password123');
  });

  test('submits form with email and password', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    const mockResponse = {
      data: {
        user: { id: '1', name: 'João Silva', email: 'joao@example.com' },
        accessToken: 'fake-token',
        refreshToken: 'fake-refresh-token',
      },
    };

    authService.login.mockResolvedValue(mockResponse);
    toast.success.mockImplementation(() => {});

    render(<MockedLogin />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'joao@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
    });
  });

  test('shows loading state during submission', async () => {
    authService.login.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<MockedLogin />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'joao@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test('shows error toast when login fails', async () => {
    const mockError = {
      response: {
        data: { message: 'Credenciais inválidas' },
      },
    };

    authService.login.mockRejectedValue(mockError);
    toast.error.mockImplementation(() => {});

    render(<MockedLogin />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciais inválidas');
    });
  });

  test('shows generic error message when no specific message is provided', async () => {
    authService.login.mockRejectedValue(new Error('Network error'));
    toast.error.mockImplementation(() => {});

    render(<MockedLogin />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao fazer login');
    });
  });

  test('required attributes are set on inputs', () => {
    render(<MockedLogin />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('email input has correct type', () => {
    render(<MockedLogin />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('password input has correct type', () => {
    render(<MockedLogin />);
    const passwordInput = screen.getByLabelText(/senha/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
