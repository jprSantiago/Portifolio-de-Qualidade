const authService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
};

export default authService;
