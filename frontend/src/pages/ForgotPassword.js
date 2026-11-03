import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/auth/forgot-password', { email });
            setEmailSent(true);
            toast.success('E-mail de recuperação enviado com sucesso!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erro ao enviar e-mail de recuperação');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">E-mail enviado!</h2>
                        <p className="text-gray-600 mb-6">
                            Enviamos um e-mail para <strong>{email}</strong> com instruções para redefinir sua senha.
                        </p>
                        <Link to="/login">
                            <Button fullWidth>Voltar ao Login</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Esqueci minha senha</h1>
                    <p className="text-gray-600">Digite seu e-mail para receber instruções de recuperação</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="E-mail"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                    />

                    <Button type="submit" fullWidth loading={loading} className="mb-4">
                        Enviar e-mail de recuperação
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Lembrou sua senha?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Voltar ao login
                        </Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
