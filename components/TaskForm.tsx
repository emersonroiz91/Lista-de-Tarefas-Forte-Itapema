
import React, { useState } from 'react';
import { DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface TaskFormProps {
    onAddTask: (text: string, day: DayOfWeek) => void;
    disabled: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, disabled }) => {
    const [text, setText] = useState('');
    const [day, setDay] = useState<DayOfWeek>('segunda');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() === '' || isAdding || disabled) return;

        setIsAdding(true);
        await onAddTask(text, day);
        setText('');
        setIsAdding(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-8 p-4 bg-gray-50 rounded-lg shadow-sm border">
            <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="O que você precisa fazer?"
                className="flex-grow p-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-500 shadow-sm disabled:bg-gray-200"
                maxLength={100}
                disabled={isAdding || disabled}
            />
            <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)} 
                className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700 shadow-sm bg-white cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={isAdding || disabled}
            >
                {DAYS_OF_WEEK.map(d => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                ))}
            </select>
            <button 
                type="submit" 
                className="w-full md:w-auto px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md active:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={isAdding || text.trim() === '' || disabled}
            >
                {isAdding ? 'Adicionando...' : 'Adicionar Tarefa'}
            </button>
        </form>
    );
};

export default TaskForm;
