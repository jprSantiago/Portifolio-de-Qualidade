const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn((fulfilled, rejected) => {
        mockApi.interceptors.request.handlers.push({ fulfilled, rejected });
        return mockApi.interceptors.request.handlers.length - 1;
      }),
      handlers: [],
    },
    response: {
      use: jest.fn((fulfilled, rejected) => {
        mockApi.interceptors.response.handlers.push({ fulfilled, rejected });
        return mockApi.interceptors.response.handlers.length - 1;
      }),
      handlers: [],
    },
  },
  defaults: {
    baseURL: 'http://localhost:5001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

export default mockApi;
