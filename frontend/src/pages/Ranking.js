import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Card from '../components/common/Card';
import { FaTrophy, FaMedal, FaArrowLeft, FaClock } from 'react-icons/fa';

const Ranking = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { seasonId } = useParams();
    const [rankings, setRankings] = useState([]);
    const [season, setSeason] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (seasonId) {
            loadSeasonRankings(seasonId);
            loadSeason(seasonId);
        } else {
            loadRankings();
            loadActiveSeason();
        }
    }, [seasonId]);

    const loadRankings = async () => {
        try {
            const response = await api.get('/rankings');
            setRankings(response.data.data);
        } catch (error) {
            toast.error('Erro ao carregar ranking');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadActiveSeason = async () => {
        try {
            const response = await api.get('/seasons/active');
            setSeason(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar temporada ativa:', error);
        }
    };

    const loadSeason = async (id) => {
        try {
            const response = await api.get(`/seasons/${id}`);
            setSeason(response.data.data);
        } catch (error) {
            toast.error('Erro ao carregar temporada');
            console.error(error);
        }
    };

    const loadSeasonRankings = async (id) => {
        try {
            const response = await api.get(`/rankings/season/${id}`);
            setRankings(response.data.data);
        } catch (error) {
            toast.error('Erro ao carregar ranking da temporada');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeRemaining = () => {
        if (!season) return null;

        const endDate = new Date(season.endDate);
        const now = new Date();
        const diffTime = endDate - now;

        if (diffTime < 0) {
            return 'Temporada encerrada';
        }

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Último dia!';
        } else if (diffDays === 1) {
            return '1 dia restante';
        } else if (diffDays < 30) {
            return `${diffDays} dias restantes`;
        } else {
            const months = Math.floor(diffDays / 30);
            const days = diffDays % 30;
            if (days === 0) {
                return `${months} ${months === 1 ? 'mês' : 'meses'} restante${months === 1 ? '' : 's'}`;
            }
            return `${months} ${months === 1 ? 'mês' : 'meses'} e ${days} ${days === 1 ? 'dia' : 'dias'} restantes`;
        }
    };

    const getMedalIcon = (position) => {
        switch (position) {
            case 1:
                return <FaTrophy className="text-yellow-400 text-2xl" />;
            case 2:
                return <FaMedal className="text-gray-400 text-2xl" />;
            case 3:
                return <FaMedal className="text-orange-400 text-2xl" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando ranking...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(seasonId ? '/seasons' : '/dashboard')}
                        className="mb-4 flex items-center gap-2 text-primary font-medium transition-colors px-4 py-2 border-2 border-primary rounded-lg hover:bg-primary hover:text-white"
                    >
                        <FaArrowLeft />
                        {seasonId ? 'Voltar para Temporadas' : 'Voltar ao Dashboard'}
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <FaTrophy className="text-primary" />
                        {seasonId ? 'Ranking da Temporada' : 'Ranking Geral'}
                    </h1>
                    <p className="text-gray-600">
                        Classificação dos membros por pontuação
                    </p>
                    {season && (
                        <div className="mt-4 flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-3 rounded-lg border border-blue-200">
                            <FaClock className="text-lg" />
                            <div>
                                <span className="font-semibold">{season.name}</span>
                                <span className="mx-2">•</span>
                                <span>{calculateTimeRemaining()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ranking List */}
                <Card>
                    <div className="space-y-3">
                        {rankings.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Nenhum registro de pontuação ainda
                            </p>
                        ) : (
                            rankings.map((rank, index) => {
                                const position = index + 1;
                                const isCurrentUser = rank.user.id === user.id;

                                return (
                                    <div
                                        key={rank.user.id}
                                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${isCurrentUser
                                            ? 'bg-primary bg-opacity-10 border-2 border-primary'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        {/* Position */}
                                        <div className="flex items-center justify-center w-12 h-12">
                                            {position <= 3 ? (
                                                getMedalIcon(position)
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-400">
                                                    {position}º
                                                </span>
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                                            {rank.user.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1">
                                            <p className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-gray-900'}`}>
                                                {rank.user.name}
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                                                        Você
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {rank.checkInsCount} check-in{rank.checkInsCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        {/* Points */}
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">
                                                {rank.totalPoints}
                                            </p>
                                            <p className="text-xs text-gray-500">pontos</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                {/* Legend */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Os pontos são calculados com base nos check-ins aprovados</p>
                </div>
            </div>
        </div>
    );
};

export default Ranking;
