import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">NaSalinha</h1>
                    <p className="text-gray-600">Sistema de Check-in Gamificado</p>
                </div>

                <form onSubmit={handleSubmit}>
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

                    <div className="flex items-center justify-end mb-4">
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            Esqueci minha senha
                        </Link>
                    </div>

                    <Button type="submit" fullWidth loading={loading} className="mb-4">
                        Entrar
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Registre-se
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Login;
