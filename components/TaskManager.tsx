import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../services/taskService';
import { Task, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import Header from './Header';
import TaskForm from './TaskForm';
import DayColumn from './DayColumn';
import Spinner from './Spinner';
import { User } from '../services/authService';
import CalendarView from './CalendarView';

interface TaskManagerProps {
    user: User;
    onLogout: () => void;
    onNavigateToAdmin: () => void;
    onOpenChangePassword: () => void;
}

type TaskManagerView = 'tasks' | 'calendar';

const TaskManager: React.FC<TaskManagerProps> = ({ user, onLogout, onNavigateToAdmin, onOpenChangePassword }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<TaskManagerView>('tasks');

    useEffect(() => {
        if (view === 'tasks') {
            setLoading(true);
            setError(null);
            getTasks(user.username)
                .then(initialTasks => {
                    setTasks(initialTasks);
                })
                .catch(err => {
                     console.error(err);
                     setError('Falha ao carregar tarefas.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user.username, view]);

    const handleAddTask = useCallback(async (text: string, day: DayOfWeek) => {
        try {
            const updatedTasks = await addTask(user.username, text, day);
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
            setError("Não foi possível adicionar a tarefa.");
        }
    }, [user.username]);

    const handleToggleTask = useCallback(async (id: string, completed: boolean) => {
        try {
            const updatedTasks = await updateTask(user.username, id, { completed: !completed });
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            setError("Não foi possível atualizar a tarefa.");
        }
    }, [user.username]);

    const handleDeleteTask = useCallback(async (id: string) => {
        try {
            const updatedTasks = await deleteTask(user.username, id);
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
            setError("Não foi possível deletar a tarefa.");
        }
    }, [user.username]);

    const handleUpdateTaskText = useCallback(async (id: string, newText: string) => {
        try {
            const updatedTasks = await updateTask(user.username, id, { text: newText });
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Erro ao atualizar o texto da tarefa:", error);
            setError("Não foi possível atualizar o texto da tarefa.");
        }
    }, [user.username]);

    const tasksByDay = useMemo(() => {
        const groupedTasks: { [key in DayOfWeek]: Task[] } = {
            segunda: [],
            terca: [],
            quarta: [],
            quinta: [],
            sexta: [],
            sabado: [],
        };

        tasks.forEach(task => {
            if (groupedTasks[task.day]) {
                groupedTasks[task.day].push(task);
            }
        });

        for (const day in groupedTasks) {
            groupedTasks[day as DayOfWeek].sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return b.createdAt - a.createdAt;
            });
        }

        return groupedTasks;
    }, [tasks]);

    return (
        <div className="p-6 md:p-10">
            <Header 
                user={user} 
                onLogout={onLogout} 
                onNavigateToAdmin={onNavigateToAdmin}
                onOpenChangePassword={onOpenChangePassword}
            />

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setView('tasks')}
                        className={`${
                            view === 'tasks'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 focus:outline-none`}
                        aria-current={view === 'tasks' ? 'page' : undefined}
                    >
                        Tarefas da Semana
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`${
                            view === 'calendar'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 focus:outline-none`}
                        aria-current={view === 'calendar' ? 'page' : undefined}
                    >
                        Calendário e Eventos
                    </button>
                </nav>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {view === 'tasks' && (
                <>
                    <TaskForm onAddTask={handleAddTask} disabled={loading} />
                    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="md:col-span-2 lg:col-span-3">
                                <Spinner />
                            </div>
                        ) : (
                            DAYS_OF_WEEK.map(({ key, label }) => (
                                <DayColumn
                                    key={key}
                                    title={label}
                                    tasks={tasksByDay[key]}
                                    onToggleTask={handleToggleTask}
                                    onDeleteTask={handleDeleteTask}
                                    onUpdateTaskText={handleUpdateTaskText}
                                />
                            ))
                        )}
                    </main>
                </>
            )}

            {view === 'calendar' && (
                <CalendarView user={user} />
            )}
        </div>
    );
};

export default TaskManager;