import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newText: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleToggle = () => {
        if (isEditing) return; // Don't toggle when editing
        onToggle(task.id, task.completed);
    };

    const handleDelete = () => {
        onDelete(task.id);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditText(task.text); // Reset text on cancel
    };

    const handleSave = () => {
        if (editText.trim()) {
            onEdit(task.id, editText.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };
    
    const completedClass = task.completed && !isEditing
        ? 'completed bg-green-50/70' 
        : 'hover:bg-gray-50';
    
    const textClass = task.completed && !isEditing
        ? 'line-through text-gray-500 opacity-80'
        : 'text-gray-800';

    if (isEditing) {
        return (
            <li className={`flex items-center p-3 bg-white rounded-xl shadow-sm border border-blue-500 ring-2 ring-blue-200`}>
                <input 
                    ref={inputRef}
                    type="text" 
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent focus:outline-none text-gray-800"
                    maxLength={100}
                />
                <button 
                    onClick={handleSave}
                    className="text-green-600 hover:text-green-800 transition duration-150 p-1 rounded-full hover:bg-green-100 flex-shrink-0 ml-2" 
                    aria-label="Salvar Tarefa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                 <button 
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 transition duration-150 p-1 rounded-full hover:bg-gray-100 flex-shrink-0" 
                    aria-label="Cancelar Edição"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </li>
        );
    }

    return (
        <li className={`flex items-center p-3 bg-white rounded-xl shadow-sm border transition-all duration-300 ease-in-out ${completedClass}`}>
            <input 
                type="checkbox" 
                checked={task.completed}
                onChange={handleToggle}
                id={`check-${task.id}`}
                className="h-5 w-5 text-green-600 border-gray-300 rounded-md focus:ring-green-500 cursor-pointer flex-shrink-0"
            />
            <span className={`flex-grow ml-3 break-words pr-3 ${textClass}`} title={task.text}>
                {task.text}
            </span>
            <div className="flex items-center">
                <button 
                    onClick={handleEdit}
                    className="edit-btn text-gray-400 hover:text-blue-600 transition duration-150 p-1 rounded-full hover:bg-blue-100 flex-shrink-0" 
                    aria-label="Editar Tarefa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                    </svg>
                </button>
                <button 
                    onClick={handleDelete}
                    className="delete-btn text-gray-400 hover:text-red-600 transition duration-150 p-1 rounded-full hover:bg-red-100 flex-shrink-0" 
                    aria-label="Excluir Tarefa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </li>
    );
};

export default TaskItem;