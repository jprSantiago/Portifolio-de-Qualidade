const jwt = require('jsonwebtoken');

/**
 * Gera access token JWT
 * @param {object} payload - Dados do usuário
 * @returns {string} Token JWT
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
};

/**
 * Gera refresh token JWT
 * @param {object} payload - Dados do usuário
 * @returns {string} Token JWT
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};

/**
 * Verifica access token
 * @param {string} token - Token JWT
 * @returns {object} Payload decodificado
 */
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido ou expirado');
    }
};

/**
 * Verifica refresh token
 * @param {string} token - Token JWT
 * @returns {object} Payload decodificado
 */
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Refresh token inválido ou expirado');
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
