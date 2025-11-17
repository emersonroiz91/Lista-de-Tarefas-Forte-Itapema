import { Task, DayOfWeek } from '../types';

const getStorageKey = (username: string) => `forte-itapema-tasks-${username.toLowerCase()}`;

const getTasksFromStorage = (username: string): Task[] => {
    try {
        const storedTasks = localStorage.getItem(getStorageKey(username));
        return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error("Erro ao ler tarefas do localStorage:", error);
        return [];
    }
};

const saveTasksToStorage = (username: string, tasks: Task[]) => {
    try {
        localStorage.setItem(getStorageKey(username), JSON.stringify(tasks));
    } catch (error) {
        console.error("Erro ao salvar tarefas no localStorage:", error);
    }
};

export const getTasks = async (username: string): Promise<Task[]> => {
    return Promise.resolve(getTasksFromStorage(username));
};

export const addTask = async (username: string, text: string, day: DayOfWeek): Promise<Task[]> => {
    const tasks = getTasksFromStorage(username);
    const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        day,
        completed: false,
        createdAt: Date.now()
    };
    const updatedTasks = [...tasks, newTask];
    saveTasksToStorage(username, updatedTasks);
    return Promise.resolve(updatedTasks);
};

export const updateTask = async (username: string, id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task[]> => {
    const tasks = getTasksFromStorage(username);
    const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
    );
    saveTasksToStorage(username, updatedTasks);
    return Promise.resolve(updatedTasks);
};

export const deleteTask = async (username: string, id: string): Promise<Task[]> => {
    const tasks = getTasksFromStorage(username);
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage(username, updatedTasks);
    return Promise.resolve(updatedTasks);
};

export const deleteAllTasksForUser = (username: string): void => {
    try {
        localStorage.removeItem(getStorageKey(username));
    } catch (error) {
        console.error("Erro ao deletar tarefas do usuário:", error);
    }
}
