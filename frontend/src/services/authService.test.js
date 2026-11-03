jest.mock('axios');
jest.mock('./api');

import authService from './authService';
import api from './api';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('register', () => {
    test('registers a new user successfully', async () => {
      const mockUser = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Usuário criado com sucesso',
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@example.com',
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.register(mockUser);

      expect(api.post).toHaveBeenCalledWith('/auth/register', mockUser);
      expect(result).toEqual(mockResponse.data);
    });

    test('throws error when registration fails', async () => {
      const mockError = {
        response: {
          data: { message: 'Email já está em uso' },
        },
      };

      api.post.mockRejectedValue(mockError);

      await expect(authService.register({ email: 'existing@example.com' })).rejects.toEqual(
        mockError,
      );
    });
  });

  describe('login', () => {
    test('logs in user successfully', async () => {
      const mockCredentials = {
        email: 'joao@example.com',
        password: 'senha123',
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: '1',
              name: 'João Silva',
              email: 'joao@example.com',
            },
            accessToken: 'fake-access-token',
            refreshToken: 'fake-refresh-token',
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login(mockCredentials.email, mockCredentials.password);

      expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(result).toEqual(mockResponse.data);
    });

    test('throws error when login fails', async () => {
      const mockError = {
        response: {
          data: { message: 'Credenciais inválidas' },
        },
      };

      api.post.mockRejectedValue(mockError);

      await expect(authService.login('wrong@example.com', 'wrongpassword')).rejects.toEqual(
        mockError,
      );
    });
  });

  describe('logout', () => {
    test('removes tokens from localStorage', async () => {
      localStorage.setItem('accessToken', 'fake-access-token');
      localStorage.setItem('refreshToken', 'fake-refresh-token');

      await authService.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    test('gets current user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            name: 'João Silva',
            email: 'joao@example.com',
            role: 'MEMBER',
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockResponse.data);
    });

    test('throws error when getting user fails', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Token inválido' },
        },
      };

      api.get.mockRejectedValue(mockError);

      await expect(authService.getCurrentUser()).rejects.toEqual(mockError);
    });
  });

  describe('isAuthenticated', () => {
    test('returns true when accessToken exists', () => {
      localStorage.setItem('accessToken', 'fake-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('returns false when accessToken does not exist', () => {
      localStorage.removeItem('accessToken');
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
