import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import RankingRoute from './components/common/RankingRoute';
import AdminRoute from './components/common/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Ranking from './pages/Ranking';
import UserManagement from './pages/UserManagement';
import SeasonManagement from './pages/SeasonManagement';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/ranking"
                            element={
                                <RankingRoute>
                                    <Ranking />
                                </RankingRoute>
                            }
                        />
                        <Route
                            path="/ranking/:seasonId"
                            element={
                                <PrivateRoute>
                                    <Ranking />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <AdminRoute>
                                    <UserManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/seasons"
                            element={
                                <AdminRoute>
                                    <SeasonManagement />
                                </AdminRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
