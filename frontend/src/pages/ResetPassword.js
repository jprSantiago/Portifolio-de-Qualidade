import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (!token) {
            toast.error('Token inválido ou expirado');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: formData.password,
            });
            toast.success('Senha redefinida com sucesso!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao redefinir senha. Token pode estar expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Redefinir Senha</h1>
                    <p className="text-gray-600">Digite sua nova senha</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nova Senha"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />

                    <Input
                        label="Confirmar Nova Senha"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />

                    <Button type="submit" fullWidth loading={loading} className="mb-4">
                        Redefinir Senha
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ResetPassword;
