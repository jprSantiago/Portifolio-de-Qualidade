import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { FaTrophy, FaCamera, FaCalendar, FaSignOutAlt, FaPlus, FaTrash, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCheckIns: 0,
        totalPoints: 0,
        ranking: 0,
    });
    const [recentCheckIns, setRecentCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const loadStats = async () => {
        try {
            const [myCheckinsRes, allCheckinsRes, rankingRes] = await Promise.all([
                api.get('/checkins/my-checkins'),
                api.get('/checkins'),
                api.get('/rankings'),
            ]);

            const myCheckIns = myCheckinsRes.data.data;
            const allCheckIns = allCheckinsRes.data.data;
            const rankings = rankingRes.data.data;

            const myRanking = rankings.findIndex((r) => r.user.id === user.id) + 1;
            const myPoints = rankings.find((r) => r.user.id === user.id)?.totalPoints || 0;

            setStats({
                totalCheckIns: myCheckIns.length,
                totalPoints: myPoints,
                ranking: myRanking || rankings.length + 1,
            });

            setRecentCheckIns(allCheckIns.slice(0, 10));
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logout realizado com sucesso!');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCheckIn = async () => {
        if (!selectedFile) {
            toast.error('Por favor, selecione uma foto');
            return;
        }

        setCheckInLoading(true);
        const formData = new FormData();
        formData.append('photo', selectedFile);

        try {
            await api.post('/checkins', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Check-in realizado com sucesso!');
            setShowCheckInModal(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            loadStats();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao fazer check-in');
        } finally {
            setCheckInLoading(false);
        }
    };

    const handleDeleteCheckIn = async (checkInId) => {
        if (!window.confirm('Tem certeza que deseja excluir este check-in?')) {
            return;
        }

        try {
            await api.delete(`/checkins/${checkInId}`);
            toast.success('Check-in excluído com sucesso!');
            loadStats();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao excluir check-in');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">NaSalinha</h1>
                        <p className="text-sm text-gray-600">{user.name} ({user.role})</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <FaSignOutAlt />
                        Sair
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">
                            Bem-vindo, {user.name}! 👋
                        </h2>
                        <p className="text-gray-600">
                            Acompanhe seu desempenho e continue fazendo check-ins
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCheckInModal(true)}
                        className="flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <FaPlus />
                        Novo Check-in
                    </Button>
                </div>

                {/* Stats Grid */}
                {user.role === 'ADMIN' ? (
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            icon={<FaUsers className="text-3xl" />}
                            title="Gerenciar Usuários"
                            value="Clique aqui"
                            color="bg-red-500"
                            clickable={true}
                            onClick={() => navigate('/users')}
                        />
                        <StatCard
                            icon={<FaCalendar className="text-3xl" />}
                            title="Gerenciar Temporadas"
                            value="Clique aqui"
                            color="bg-blue-500"
                            clickable={true}
                            onClick={() => navigate('/seasons')}
                        />
                        <StatCard
                            icon={<FaTrophy className="text-3xl" />}
                            title="Ver Ranking"
                            value="Clique aqui"
                            color="bg-purple-500"
                            clickable={true}
                            onClick={() => navigate('/ranking')}
                        />
                    </div>
                ) : (
                    <div className={`grid ${user.role === 'TRAINEE' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 mb-8`}>
                        <StatCard
                            icon={<FaCamera className="text-3xl" />}
                            title="Check-ins"
                            value={stats.totalCheckIns}
                            color="bg-blue-500"
                        />
                        <StatCard
                            icon={<FaTrophy className="text-3xl" />}
                            title="Pontos"
                            value={stats.totalPoints}
                            color="bg-yellow-500"
                        />
                        {user.role !== 'TRAINEE' && (
                            <StatCard
                                icon={<FaCalendar className="text-3xl" />}
                                title="Ranking"
                                value={`#${stats.ranking}`}
                                color="bg-purple-500"
                                clickable={true}
                                onClick={() => navigate('/ranking')}
                            />
                        )}
                    </div>
                )}

                {/* Recent Activity */}
                <Card title="Atividade Recente" className="mb-8">
                    {recentCheckIns.length === 0 ? (
                        <div className="text-center py-8">
                            <FaCamera className="text-5xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">
                                Você ainda não fez nenhum check-in. Clique em "Novo Check-in" para começar! 🎯
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentCheckIns.map((checkIn) => (
                                <div key={checkIn.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                                    <img
                                        src={checkIn.photoUrl}
                                        alt="Check-in"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                {checkIn.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-gray-900">
                                                    {checkIn.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(checkIn.createdAt).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            {user.role === 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDeleteCheckIn(checkIn.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                    title="Excluir check-in"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-primary">
                                                +{checkIn.points} pontos
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${checkIn.status === 'APPROVED'
                                                ? 'bg-green-100 text-green-800'
                                                : checkIn.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {checkIn.status === 'APPROVED' ? 'Aprovado' :
                                                    checkIn.status === 'PENDING' ? 'Pendente' : 'Rejeitado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Modal de Check-in */}
            {showCheckInModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4">Novo Check-in</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enviar foto
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary file:text-white
                                    hover:file:bg-primary-dark
                                    file:cursor-pointer"
                            />
                        </div>

                        {previewUrl && (
                            <div className="mb-4">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                onClick={handleCheckIn}
                                loading={checkInLoading}
                                disabled={!selectedFile}
                                fullWidth
                            >
                                Fazer Check-in
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowCheckInModal(false);
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                }}
                                variant="outline"
                                fullWidth
                            >
                                Cancelar
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, title, value, color, clickable, onClick }) => (
    <Card
        className={`text-center ${clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
        onClick={clickable ? onClick : undefined}
    >
        <div className={`${color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className="text-gray-600">{title}</p>
    </Card>
);

export default Dashboard;
