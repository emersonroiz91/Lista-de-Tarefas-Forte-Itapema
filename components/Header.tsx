import React from 'react';
import { User } from '../services/authService';
import NotificationsBell from './NotificationsBell';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onNavigateToAdmin?: () => void;
    onOpenChangePassword: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateToAdmin, onOpenChangePassword }) => {
    return (
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <div className="flex items-center mb-4 sm:mb-0">
                    <img 
                        src="https://i.ibb.co/3mdJb57c/Forte-Itapema-Transparente.png" 
                        alt="Logo do Forte Itapema" 
                        className="w-20 h-20 object-contain mr-3"
                    />
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Tarefas do Forte Itapema
                        </h1>
                         <p className="text-gray-500">Lista simples para organizar a semana.</p>
                    </div>
                </div>
                {user && onLogout && (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <NotificationsBell user={user} />
                        <span className="text-gray-600">Olá, <span className="font-bold">{user.username}</span>!</span>
                        <div className="flex items-center gap-3">
                            {user.isAdmin && onNavigateToAdmin && (
                                 <button 
                                    onClick={onNavigateToAdmin}
                                    className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-150 shadow-sm active:bg-gray-900"
                                >
                                    Painel Admin
                                </button>
                            )}
                            <button
                                onClick={onOpenChangePassword}
                                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-150 shadow-sm active:bg-yellow-700"
                            >
                                Alterar Senha
                            </button>
                            <button 
                                onClick={onLogout}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-150 shadow-sm active:bg-red-700"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;