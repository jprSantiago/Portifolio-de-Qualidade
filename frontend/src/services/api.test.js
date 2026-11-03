jest.mock('./api');

import api from './api';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API instance configuration', () => {
    test('creates axios instance with correct baseURL', () => {
      expect(api.defaults.baseURL).toBe('http://localhost:5001/api');
    });

    test('sets default Content-Type header', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    test('has required HTTP methods', () => {
      expect(api.get).toBeDefined();
      expect(api.post).toBeDefined();
      expect(api.put).toBeDefined();
      expect(api.patch).toBeDefined();
      expect(api.delete).toBeDefined();
    });

    test('has interceptors configured', () => {
      expect(api.interceptors).toBeDefined();
      expect(api.interceptors.request).toBeDefined();
      expect(api.interceptors.response).toBeDefined();
    });
  });
});
