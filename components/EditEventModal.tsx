import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';

interface EditEventModalProps {
    event: CalendarEvent;
    onSave: (id: string, updates: { title: string, time?: string }) => void;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onSave, onClose, onDelete }) => {
    const [title, setTitle] = useState(event.title);
    const [time, setTime] = useState(event.time || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTitle(event.title);
        setTime(event.time || '');
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        onSave(event.id, { title: title.trim(), time });
        // The parent component will handle closing on success
    };

    const handleDelete = () => {
        if (window.confirm(`Você tem certeza que deseja excluir o evento "${event.title}"?`)) {
            setLoading(true);
            onDelete(event.id);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 m-4 w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Evento</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input 
                            id="edit-title"
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Título do Evento" 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-time" className="block text-sm font-medium text-gray-700 mb-1">Horário (opcional)</label>
                        <input 
                            id="edit-time"
                            type="time" 
                            value={time} 
                            onChange={e => setTime(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                        />
                    </div>
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 disabled:bg-blue-300"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                        <button 
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-2 mt-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-150 disabled:bg-red-300"
                            disabled={loading}
                        >
                            Excluir Evento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;