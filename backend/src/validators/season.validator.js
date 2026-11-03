const Joi = require('joi');

const createSeasonSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.min': 'Nome deve ter no mínimo 3 caracteres',
        'string.max': 'Nome deve ter no máximo 100 caracteres',
        'any.required': 'Nome é obrigatório',
    }),
    description: Joi.string().max(500).allow('', null),
    startDate: Joi.date().required().messages({
        'any.required': 'Data de início é obrigatória',
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
        'date.greater': 'Data de término deve ser posterior à data de início',
        'any.required': 'Data de término é obrigatória',
    }),
    isActive: Joi.boolean().default(false),
    pointsPerCheckIn: Joi.number().integer().min(1).default(10).messages({
        'number.min': 'Pontos por check-in deve ser no mínimo 1',
    }),
});

const updateSeasonSchema = Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(500).allow('', null),
    startDate: Joi.date(),
    endDate: Joi.date(),
    isActive: Joi.boolean(),
    pointsPerCheckIn: Joi.number().integer().min(1),
});

module.exports = {
    createSeasonSchema,
    updateSeasonSchema,
};
