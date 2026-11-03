import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaCamera, FaUsers, FaChartLine } from 'react-icons/fa';
import Button from '../components/common/Button';

import teamPhoto from '../assets/team.jpeg';

const Home = () => {
    return (
        <div className="min-h-screen relative">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${teamPhoto})`,
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            {/* Content */}
            <div className="relative min-h-screen flex items-center">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Side - Info */}
                        <div className="flex-1 text-white">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                                NaSalinha
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
                                Sistema de Check-in Gamificado para Comp Júnior
                            </p>
                        </div>

                        {/* Right Side - Login/Register Card */}
                        <div className="w-full lg:w-auto lg:min-w-[400px]">
                            <div className="bg-white rounded-2xl shadow-2xl p-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                                    Bem-vindo!
                                </h2>
                                <p className="text-gray-600 text-center mb-8">
                                    Faça login ou crie sua conta para começar
                                </p>
                                <div className="space-y-4">
                                    <Link to="/login" className="block">
                                        <Button size="lg" fullWidth>
                                            Fazer Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" className="block">
                                        <Button size="lg" variant="outline" fullWidth>
                                            Criar Conta
                                        </Button>
                                    </Link>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                        <FaTrophy className="text-primary" />
                                        <span>Junte-se à equipe Comp Júnior</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ icon, title }) => (
    <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
        <div className="text-white">{icon}</div>
        <span className="text-white font-medium">{title}</span>
    </div>
);

export default Home;
