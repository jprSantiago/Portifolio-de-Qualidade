const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.min': 'Nome deve ter no mínimo 3 caracteres',
        'string.max': 'Nome deve ter no máximo 100 caracteres',
        'any.required': 'Nome é obrigatório',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'E-mail inválido',
        'any.required': 'E-mail é obrigatório',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Senha deve ter no mínimo 6 caracteres',
        'any.required': 'Senha é obrigatória',
    }),
    role: Joi.string().valid('ADMIN', 'MEMBER', 'TRAINEE').default('MEMBER'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'E-mail inválido',
        'any.required': 'E-mail é obrigatório',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Senha é obrigatória',
    }),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'E-mail inválido',
        'any.required': 'E-mail é obrigatório',
    }),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Token é obrigatório',
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'Senha deve ter no mínimo 6 caracteres',
        'any.required': 'Senha é obrigatória',
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
