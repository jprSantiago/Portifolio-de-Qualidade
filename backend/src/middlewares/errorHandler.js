/**
 * Middleware de tratamento de erros
 * Captura erros e retorna respostas padronizadas
 */
const errorHandler = (err, req, res, next) => {
    console.error('Erro:', err);

    if (err.isJoi) {
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors: err.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            })),
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Registro não encontrado',
        });
    }

    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            message: 'Este registro já existe',
            field: err.meta?.target?.[0] || 'unknown',
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            message: 'Arquivo muito grande. Tamanho máximo: 5MB',
        });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Erro interno do servidor',
    });
};

module.exports = errorHandler;
