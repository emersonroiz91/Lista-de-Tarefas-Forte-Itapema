
import React from 'react';

const FirebaseWarning: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
      <p className="font-bold">Atenção: Configuração do Firebase Incompleta</p>
      <p>
        O aplicativo não pode salvar ou carregar suas tarefas. Por favor, certifique-se de que o arquivo{' '}
        <code className="bg-yellow-200 text-sm font-mono p-1 rounded">services/firebaseService.ts</code>{' '}
        contém suas chaves de API do Firebase válidas.
      </p>
    </div>
  );
};

export default FirebaseWarning;
