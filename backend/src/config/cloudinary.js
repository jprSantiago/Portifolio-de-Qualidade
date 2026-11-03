const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload de imagem para o Cloudinary
 * @param {string} filePath - Caminho do arquivo
 * @param {string} folder - Pasta no Cloudinary
 * @returns {Promise<object>} - Resultado do upload
 */
const uploadImage = async (filePath, folder = 'nasalinha') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'auto',
            transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Erro no upload para Cloudinary:', error);
        throw new Error('Falha no upload da imagem');
    }
};

/**
 * Deleta imagem do Cloudinary
 * @param {string} publicId - ID público da imagem
 * @returns {Promise<void>}
 */
const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Erro ao deletar imagem do Cloudinary:', error);
        throw new Error('Falha ao deletar imagem');
    }
};

module.exports = {
    uploadImage,
    deleteImage,
};
