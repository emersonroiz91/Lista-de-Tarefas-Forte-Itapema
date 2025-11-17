
import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const handleToggle = () => {
        onToggle(task.id, task.completed);
    };

    const handleDelete = () => {
        onDelete(task.id);
    };
    
    const completedClass = task.completed 
        ? 'completed bg-green-50/70' 
        : 'hover:bg-gray-50';
    
    const textClass = task.completed
        ? 'line-through text-gray-500 opacity-80'
        : 'text-gray-800';

    return (
        <li className={`flex items-center p-3 bg-white rounded-lg shadow-sm border transition-all duration-300 ease-in-out ${completedClass}`}>
            <input 
                type="checkbox" 
                checked={task.completed}
                onChange={handleToggle}
                id={`check-${task.id}`}
                className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer flex-shrink-0"
            />
            <span className={`flex-grow ml-3 break-words pr-3 ${textClass}`} title={task.text}>
                {task.text}
            </span>
            <button 
                onClick={handleDelete}
                className="delete-btn text-gray-400 hover:text-red-600 transition duration-150 p-1 rounded-full hover:bg-red-100 flex-shrink-0" 
                aria-label="Excluir Tarefa"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        </li>
    );
};

export default TaskItem;
