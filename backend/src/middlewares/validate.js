/**
 * Middleware de validação usando Joi
 * @param {object} schema - Schema Joi para validação
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Erro de validação',
                errors: error.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                })),
            });
        }

        req.body = value;
        next();
    };
};

module.exports = validate;
