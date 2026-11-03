jest.mock('../services/authService');
jest.mock('../services/api');

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import authService from '../services/authService';

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  describe('useAuth hook', () => {
    test('provides auth context when inside AuthProvider', () => {
      authService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('isAuthenticated');
    });
  });

  describe('AuthProvider', () => {
    test('initializes correctly', async () => {
      authService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('loads user when authenticated on mount', async () => {
      const mockUser = {
        data: {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
        },
      };

      authService.isAuthenticated.mockReturnValue(true);
      authService.getCurrentUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser.data);
      expect(result.current.isAuthenticated).toBe(true);
    });

    test('sets loading to false when not authenticated', async () => {
      authService.isAuthenticated.mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('handles error when loading user fails', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      authService.isAuthenticated.mockReturnValue(true);
      authService.getCurrentUser.mockRejectedValue(new Error('Network error'));
      authService.logout.mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();

      consoleError.mockRestore();
    });

    test('logs in user successfully', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            name: 'João Silva',
            email: 'joao@example.com',
          },
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
        },
      };

      authService.isAuthenticated.mockReturnValue(false);
      authService.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let loginResponse;
      await act(async () => {
        loginResponse = await result.current.login('joao@example.com', 'senha123');
      });

      expect(authService.login).toHaveBeenCalledWith('joao@example.com', 'senha123');
      expect(localStorage.getItem('accessToken')).toBe('fake-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('fake-refresh-token');
      expect(result.current.user).toEqual(mockResponse.data.user);
      expect(result.current.isAuthenticated).toBe(true);
      expect(loginResponse).toEqual(mockResponse);
    });

    test('logs out user', async () => {
      const mockUser = {
        data: {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
        },
      };

      authService.isAuthenticated.mockReturnValue(true);
      authService.getCurrentUser.mockResolvedValue(mockUser);
      authService.logout.mockImplementation(() => {
        localStorage.clear();
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser.data);

      act(() => {
        result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
