import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.register(formData);
            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            toast.success('Cadastro realizado com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao fazer cadastro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
                    <p className="text-gray-600">Junte-se ao NaSalinha</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nome Completo"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="João Silva"
                        required
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                    />

                    <Input
                        label="Senha"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Usuário
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="TRAINEE">Trainee</option>
                            <option value="MEMBER">Membro</option>
                        </select>
                    </div>

                    <Button type="submit" fullWidth loading={loading} className="mb-4">
                        Criar Conta
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Faça login
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Register;
