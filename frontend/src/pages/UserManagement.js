import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Card from '../components/common/Card';
import { FaArrowLeft, FaUserSlash, FaUserCheck, FaTrash, FaUsers } from 'react-icons/fa';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.data);
        } catch (error) {
            toast.error('Erro ao carregar usuários');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const action = currentStatus ? 'desativar' : 'ativar';
        if (!window.confirm(`Tem certeza que deseja ${action} este usuário?`)) {
            return;
        }

        try {
            await api.patch(`/users/${userId}/toggle-status`);
            toast.success(`Usuário ${action === 'desativar' ? 'desativado' : 'ativado'} com sucesso!`);
            loadUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || `Erro ao ${action} usuário`);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Tem certeza que deseja EXCLUIR este usuário? Esta ação não pode ser desfeita!')) {
            return;
        }

        try {
            await api.delete(`/users/${userId}`);
            toast.success('Usuário excluído com sucesso!');
            loadUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao excluir usuário');
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            ADMIN: 'bg-red-100 text-red-800',
            MEMBER: 'bg-blue-100 text-blue-800',
            TRAINEE: 'bg-green-100 text-green-800',
        };
        const labels = {
            ADMIN: 'Admin',
            MEMBER: 'Membro',
            TRAINEE: 'Trainee',
        };
        return (
            <span className={`text-xs px-2 py-1 rounded-full ${styles[role]}`}>
                {labels[role]}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando usuários...</p>
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <FaUsers className="text-primary" />
                        Gerenciamento de Usuários
                    </h1>
                    <p className="text-gray-600">
                        Gerencie os usuários da plataforma
                    </p>
                </div>

                {/* Users List */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-700">Usuário</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">E-mail</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Cargo</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-right p-4 font-semibold text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-500">
                                            Nenhum usuário encontrado
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{user.email}</td>
                                            <td className="p-4">{getRoleBadge(user.role)}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.isActive ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                        className={`p-2 rounded transition-colors ${user.isActive
                                                            ? 'text-orange-600 hover:bg-orange-50'
                                                            : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                                                    >
                                                        {user.isActive ? <FaUserSlash /> : <FaUserCheck />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Excluir usuário"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="text-center">
                        <p className="text-gray-600 text-sm">Total de Usuários</p>
                        <p className="text-3xl font-bold text-primary">{users.length}</p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-gray-600 text-sm">Ativos</p>
                        <p className="text-3xl font-bold text-green-600">
                            {users.filter(u => u.isActive).length}
                        </p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-gray-600 text-sm">Inativos</p>
                        <p className="text-3xl font-bold text-gray-600">
                            {users.filter(u => !u.isActive).length}
                        </p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-gray-600 text-sm">Admins</p>
                        <p className="text-3xl font-bold text-red-600">
                            {users.filter(u => u.role === 'ADMIN').length}
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
