import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { onTasksUpdate, addTask, updateTask, deleteTask } from './services/firebaseService';
import { Task, DayOfWeek } from './types';
import { DAYS_OF_WEEK } from './constants';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import DayColumn from './components/DayColumn';
import Spinner from './components/Spinner';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onTasksUpdate(
            (newTasks) => {
                setTasks(newTasks);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError('Falha ao carregar tarefas.');
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleAddTask = useCallback(async (text: string, day: DayOfWeek) => {
        try {
            await addTask(text, day);
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
            setError("Não foi possível adicionar a tarefa.");
        }
    }, []);

    const handleToggleTask = useCallback(async (id: string, completed: boolean) => {
        try {
            await updateTask(id, { completed: !completed });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            setError("Não foi possível atualizar a tarefa.");
        }
    }, []);

    const handleDeleteTask = useCallback(async (id: string) => {
        try {
            await deleteTask(id);
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
            setError("Não foi possível deletar a tarefa.");
        }
    }, []);

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
        <div className="p-4 md:p-8 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-6 md:p-10">
                <Header />
                <TaskForm onAddTask={handleAddTask} disabled={false} />

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="md:col-span-2 lg:col-span-3 flex justify-center items-center py-8">
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
                            />
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
