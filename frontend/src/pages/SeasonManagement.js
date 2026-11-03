import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { FaArrowLeft, FaCalendar, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaTrophy } from 'react-icons/fa';

const SeasonManagement = () => {
    const navigate = useNavigate();
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSeason, setEditingSeason] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        pointsPerCheckIn: 10,
        isActive: false,
    });

    useEffect(() => {
        loadSeasons();
    }, []);

    const loadSeasons = async () => {
        try {
            const response = await api.get('/seasons');
            setSeasons(response.data.data);
        } catch (error) {
            toast.error('Erro ao carregar temporadas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingSeason) {
                await api.put(`/seasons/${editingSeason.id}`, formData);
                toast.success('Temporada atualizada com sucesso!');
            } else {
                await api.post('/seasons', formData);
                toast.success('Temporada criada com sucesso!');
            }

            setShowModal(false);
            setEditingSeason(null);
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                pointsPerCheckIn: 10,
                isActive: false,
            });
            loadSeasons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao salvar temporada');
        }
    };

    const handleEdit = (season) => {
        setEditingSeason(season);
        setFormData({
            name: season.name,
            description: season.description || '',
            startDate: season.startDate.split('T')[0],
            endDate: season.endDate.split('T')[0],
            pointsPerCheckIn: season.pointsPerCheckIn,
            isActive: season.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = async (seasonId) => {
        if (!window.confirm('Tem certeza que deseja excluir esta temporada? Esta ação não pode ser desfeita!')) {
            return;
        }

        try {
            await api.delete(`/seasons/${seasonId}`);
            toast.success('Temporada excluída com sucesso!');
            loadSeasons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao excluir temporada');
        }
    };

    const handleToggleActive = async (season) => {
        try {
            await api.patch(`/seasons/${season.id}/toggle-active`);
            toast.success(`Temporada ${season.isActive ? 'desativada' : 'ativada'} com sucesso!`);
            loadSeasons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao alterar status da temporada');
        }
    };

    const openNewSeasonModal = () => {
        setEditingSeason(null);
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            pointsPerCheckIn: 10,
            isActive: false,
        });
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando temporadas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mb-4 flex items-center gap-2 text-primary font-medium transition-colors px-4 py-2 border-2 border-primary rounded-lg hover:bg-primary hover:text-white"
                    >
                        <FaArrowLeft />
                        Voltar ao Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <FaCalendar className="text-primary" />
                                Gerenciamento de Temporadas
                            </h1>
                            <p className="text-gray-600">
                                Crie e gerencie as temporadas de check-in
                            </p>
                        </div>
                        <Button
                            onClick={openNewSeasonModal}
                            className="flex items-center justify-center gap-2"
                        >
                            <FaPlus />
                            Nova Temporada
                        </Button>
                    </div>
                </div>

                {/* Seasons List */}
                <Card>
                    <div className="space-y-4">
                        {seasons.length === 0 ? (
                            <div className="text-center py-12">
                                <FaCalendar className="text-5xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Nenhuma temporada cadastrada ainda</p>
                                <Button onClick={openNewSeasonModal}>
                                    <FaPlus className="mr-2" />
                                    Criar Primeira Temporada
                                </Button>
                            </div>
                        ) : (
                            seasons.map((season) => (
                                <div
                                    key={season.id}
                                    className={`p-6 rounded-lg border-2 transition-all ${season.isActive
                                        ? 'bg-green-50 border-green-500'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {season.name}
                                                </h3>
                                                {season.isActive && (
                                                    <span className="text-xs px-3 py-1 bg-green-500 text-white rounded-full font-semibold">
                                                        ATIVA
                                                    </span>
                                                )}
                                            </div>
                                            {season.description && (
                                                <p className="text-gray-600 mb-3">{season.description}</p>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Início:</span>
                                                    <span className="ml-2 font-medium">
                                                        {new Date(season.startDate).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Fim:</span>
                                                    <span className="ml-2 font-medium">
                                                        {new Date(season.endDate).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Pontos/Check-in:</span>
                                                    <span className="ml-2 font-medium text-primary">
                                                        {season.pointsPerCheckIn}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row md:flex-col gap-2">
                                            <button
                                                onClick={() => navigate(`/ranking/${season.id}`)}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                                title="Ver Ranking"
                                            >
                                                <FaTrophy size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(season)}
                                                className={`p-2 rounded transition-colors ${season.isActive
                                                    ? 'text-orange-600 hover:bg-orange-50'
                                                    : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={season.isActive ? 'Desativar' : 'Ativar'}
                                            >
                                                {season.isActive ? <FaToggleOff size={20} /> : <FaToggleOn size={20} />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(season)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Editar"
                                            >
                                                <FaEdit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(season.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Excluir"
                                            >
                                                <FaTrash size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center">
                        <p className="text-gray-600 text-sm">Total de Temporadas</p>
                        <p className="text-3xl font-bold text-primary">{seasons.length}</p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-gray-600 text-sm">Temporada Ativa</p>
                        <p className="text-3xl font-bold text-green-600">
                            {seasons.filter(s => s.isActive).length}
                        </p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-gray-600 text-sm">Temporadas Encerradas</p>
                        <p className="text-3xl font-bold text-gray-600">
                            {seasons.filter(s => !s.isActive).length}
                        </p>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">
                            {editingSeason ? 'Editar Temporada' : 'Nova Temporada'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome da Temporada *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ex: Temporada 2025.1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Descrição opcional da temporada"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data de Início *
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data de Fim *
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pontos por Check-in *
                                    </label>
                                    <input
                                        type="number"
                                        name="pointsPerCheckIn"
                                        value={formData.pointsPerCheckIn}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                        Ativar temporada imediatamente
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <Button type="submit" fullWidth>
                                    {editingSeason ? 'Atualizar' : 'Criar'} Temporada
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingSeason(null);
                                    }}
                                    variant="outline"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SeasonManagement;
