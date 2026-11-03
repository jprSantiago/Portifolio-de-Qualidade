const Joi = require('joi');

const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(100).messages({
        'string.min': 'Nome deve ter no mínimo 3 caracteres',
        'string.max': 'Nome deve ter no máximo 100 caracteres',
    }),
    email: Joi.string().email().messages({
        'string.email': 'E-mail inválido',
    }),
    role: Joi.string().valid('ADMIN', 'MEMBER', 'TRAINEE'),
    isActive: Joi.boolean(),
});

module.exports = {
    updateUserSchema,
};
