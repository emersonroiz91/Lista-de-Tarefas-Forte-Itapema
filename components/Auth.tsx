import React, { useState } from 'react';
import { login, signUp, User } from '../services/authService';

interface AuthProps {
    onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const user = isLogin 
                ? await login(username, password) 
                : await signUp(username, password);
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setUsername('');
        setPassword('');
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 md:p-16">
             <header className="mb-8 text-center">
                <img 
                    src="https://i.ibb.co/3mdJb57c/Forte-Itapema-Transparente.png" 
                    alt="Logo do Forte Itapema" 
                    className="w-28 h-28 object-contain mx-auto mb-4"
                />
                <h1 className="text-3xl font-extrabold text-gray-900">
                    {isLogin ? 'Bem-vindo de volta!' : 'Crie sua Conta'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isLogin ? 'Acesse para ver suas tarefas.' : 'Organize sua semana com a gente.'}
                </p>
            </header>

            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                    <input 
                        type="text" 
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="seu.usuario"
                        className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input 
                        type="password" 
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                        required
                        disabled={loading}
                    />
                </div>
                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                <button 
                    type="submit" 
                    className="w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={loading || !username || !password}
                >
                    {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button onClick={toggleMode} className="font-semibold text-blue-600 hover:text-blue-500 ml-1">
                    {isLogin ? 'Cadastre-se' : 'Faça Login'}
                </button>
            </p>
        </div>
    );
};

export default Auth;
