
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-8">
            <div 
                className="border-4 border-t-blue-500 border-gray-200 rounded-full w-10 h-10 animate-spin"
                role="status"
            >
                <span className="sr-only">Carregando...</span>
            </div>
             <p className="ml-3 text-gray-500">Carregando tarefas...</p>
        </div>
    );
};

export default Spinner;
