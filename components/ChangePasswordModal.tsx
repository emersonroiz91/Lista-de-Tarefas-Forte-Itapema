import React, { useState } from 'react';
import { User, changePassword } from '../services/authService';

interface ChangePasswordModalProps {
    user: User;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ user, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('As novas senhas não coincidem.');
            return;
        }
        if (newPassword.length < 4) {
            setError('A nova senha deve ter pelo menos 4 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await changePassword(user.username, currentPassword, newPassword);
            setSuccess('Senha alterada com sucesso!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao alterar a senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl p-8 m-4 w-full max-w-md relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
                style={{animation: 'fade-in-scale 0.3s forwards'}}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Fechar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Alterar Senha</h2>
                
                {error && <p className="text-red-600 text-sm text-center mb-4 p-3 bg-red-100 rounded-xl">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center mb-4 p-3 bg-green-100 rounded-xl">{success}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword"  className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                        <input 
                            type="password" 
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900"
                            required
                            disabled={loading}
                        />
                    </div>
                     <div>
                        <label htmlFor="newPassword"  className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                        <input 
                            type="password" 
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900"
                            required
                            disabled={loading}
                        />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-700 mb-1">Confirme a Nova Senha</label>
                        <input 
                            type="password" 
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900"
                            required
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full px-5 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-150 shadow-md active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        disabled={loading || success !== null}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ChangePasswordModal;
