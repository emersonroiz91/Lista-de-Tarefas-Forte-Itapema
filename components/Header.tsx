
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="mb-8">
            <div className="flex flex-col items-center justify-center mb-4">
                <img 
                    src="https://i.ibb.co/3mdJb57c/Forte-Itapema-Transparente.png" 
                    alt="Logo do Forte Itapema" 
                    className="w-24 h-24 object-contain mb-3"
                />
                <h1 className="text-3xl font-extrabold text-gray-900 text-center">
                    Tarefas do Forte Itapema
                </h1>
            </div>
            <p className="text-gray-500 text-center">Lista simples para organizar a semana.</p>
        </header>
    );
};

export default Header;
