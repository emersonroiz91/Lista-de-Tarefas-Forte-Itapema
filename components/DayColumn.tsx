
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface DayColumnProps {
    title: string;
    tasks: Task[];
    onToggleTask: (id: string, completed: boolean) => void;
    onDeleteTask: (id: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ title, tasks, onToggleTask, onDeleteTask }) => {
    return (
        <div className="day-column bg-gray-50 p-4 rounded-lg shadow-inner border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h2>
            <ul className="space-y-3 min-h-[50px]">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskItem 
                            key={task.id}
                            task={task}
                            onToggle={onToggleTask}
                            onDelete={onDeleteTask}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-400 mt-3">Nenhuma tarefa.</p>
                )}
            </ul>
        </div>
    );
};

export default DayColumn;
