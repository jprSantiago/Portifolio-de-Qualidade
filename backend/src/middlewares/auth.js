const { verifyAccessToken } = require('../utils/jwt');
const prisma = require('../config/database');

/**
 * Middleware de autenticação
 * Verifica se o usuário está autenticado através do JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuário inativo',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Token inválido',
    });
  }
};

/**
 * Middleware de autorização por role
 * @param {string[]} allowedRoles - Roles permitidas
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para acessar este recurso',
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
