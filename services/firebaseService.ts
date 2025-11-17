import { Task, DayOfWeek } from '../types';

const LOCAL_STORAGE_KEY = 'forte-itapema-tasks';

let tasks: Task[] = [];
let listeners: ((tasks: Task[]) => void)[] = [];

// Helper para ler tarefas do localStorage com segurança
const getTasksFromStorage = (): Task[] => {
    try {
        const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error("Erro ao ler tarefas do localStorage:", error);
        return [];
    }
};

// Helper para salvar tarefas no localStorage
const saveTasksToStorage = () => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Erro ao salvar tarefas no localStorage:", error);
    }
};

// Notifica todos os 'ouvintes' (componentes) sobre mudanças nos dados
const notifyListeners = () => {
    listeners.forEach(listener => listener([...tasks]));
};

// Carrega as tarefas do localStorage assim que o módulo é carregado
tasks = getTasksFromStorage();

// Função que os componentes usarão para 'ouvir' por atualizações nas tarefas
export const onTasksUpdate = (
    callback: (tasks: Task[]) => void, 
    _onError: (error: Error) => void
): (() => void) => {
    listeners.push(callback);
    // Envia imediatamente la lista de tarefas atual quando um componente se inscreve
    callback([...tasks]);

    // Retorna uma função 'unsubscribe' para limpar o ouvinte
    return () => {
        listeners = listeners.filter(l => l !== callback);
    };
};

// Adiciona uma nova tarefa
export const addTask = async (text: string, day: DayOfWeek): Promise<void> => {
    const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        day,
        completed: false,
        createdAt: Date.now()
    };
    tasks.push(newTask);
    saveTasksToStorage();
    notifyListeners();
};

// Atualiza uma tarefa existente
export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>): Promise<void> => {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
    );
    saveTasksToStorage();
    notifyListeners();
};

// Deleta uma tarefa
export const deleteTask = async (id: string): Promise<void> => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage();
    notifyListeners();
};
