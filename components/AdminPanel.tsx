import React, { useState, useEffect, useCallback } from 'react';
import { User, getAllUsers, deleteUser } from '../services/authService';
import Spinner from './Spinner';

interface AdminPanelProps {
    user: User;
    onNavigateToTasks: () => void;
    onOpenChangePassword: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigateToTasks, onOpenChangePassword }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allUsers = await getAllUsers(user);
            setUsers(allUsers.sort((a, b) => a.username.localeCompare(b.username)));
        } catch (err: any) {
            setError(err.message || 'Falha ao carregar usuários.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (usernameToDelete: string) => {
        if (!window.confirm(`Você tem certeza que deseja excluir o usuário "${usernameToDelete}"? Esta ação não pode ser desfeita.`)) {
            return;
        }

        setIsDeleting(usernameToDelete);
        setError(null);
        try {
            await deleteUser(user, usernameToDelete);
            // Refresh user list
            fetchUsers();
        } catch (err: any) {
            setError(err.message || 'Falha ao excluir usuário.');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="p-6 md:p-10">
            <header className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Painel de Administração</h1>
                    <p className="text-gray-500">Gerenciamento de usuários do sistema.</p>
                </div>
                 <div className="flex items-center gap-3">
                    <button
                        onClick={onOpenChangePassword}
                        className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition duration-150 shadow-sm active:bg-yellow-700"
                    >
                        Alterar Senha
                    </button>
                    <button
                        onClick={onNavigateToTasks}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-150 shadow-sm active:bg-blue-800"
                    >
                        Voltar para Tarefas
                    </button>
                </div>
            </header>

            {error && <p className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded-xl">{error}</p>}

            {loading ? (
                <Spinner />
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Função
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u.username} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{u.username}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {u.isAdmin ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Admin
                                            </span>
                                        ) : (
                                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                Usuário
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteUser(u.username)}
                                            disabled={isDeleting === u.username || u.username === user.username}
                                            className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isDeleting === u.username ? 'Excluindo...' : 'Excluir'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
