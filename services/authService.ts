import { deleteAllTasksForUser } from './taskService';
import { deleteAllEventsForUser } from './eventService';
import { deleteAllNotificationsForUser } from './notificationService';


export interface User {
    username: string;
    isAdmin: boolean;
}

interface StoredUser extends User {
    passwordHash: string; // In a real app, this would be a proper hash.
}

const USERS_STORAGE_KEY = 'forte-itapema-users';
const SESSION_STORAGE_KEY = 'forte-itapema-session';

const seedAdminUser = (users: Record<string, StoredUser>): Record<string, StoredUser> => {
    // Migration: Remove old 'admin' user if it exists from a previous version
    if (users['admin']) {
        delete users['admin'];
    }

    if (!users['emerson']) {
        console.log("Criando usuário admin 'Emerson' (senha: sccp)...");
        users['emerson'] = {
            username: 'Emerson',
            // In a real app, never hardcode credentials. This is for demonstration only.
            passwordHash: 'sccp', 
            isAdmin: true,
        };
    }
    return users;
};

const getUsers = (): Record<string, StoredUser> => {
    try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        let users = stored ? JSON.parse(stored) : {};
        users = seedAdminUser(users);
        return users;
    } catch {
        let users = seedAdminUser({});
        return users;
    }
};

const saveUsers = (users: Record<string, StoredUser>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const signUp = async (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            if (!username || !password) {
                return reject(new Error("Usuário e senha são obrigatórios."));
            }
             if (username.toLowerCase() === 'emerson') {
                return reject(new Error("Este nome de usuário é reservado."));
            }
            const users = getUsers();
            if (users[username.toLowerCase()]) {
                return reject(new Error("Este nome de usuário já existe."));
            }

            const newUser: StoredUser = {
                username: username,
                passwordHash: password, // Storing plaintext for simplicity, NOT FOR PRODUCTION
                isAdmin: false,
            };
            users[username.toLowerCase()] = newUser;
            saveUsers(users);

            const sessionUser: User = { username: newUser.username, isAdmin: newUser.isAdmin };
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
            resolve(sessionUser);
        }, 500);
    });
};

export const login = async (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const user = users[username.toLowerCase()];

            if (!user || user.passwordHash !== password) {
                return reject(new Error("Nome de usuário ou senha inválidos."));
            }

            const sessionUser: User = { username: user.username, isAdmin: user.isAdmin };
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
            resolve(sessionUser);
        }, 500);
    });
};

export const logout = (): void => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
    try {
        const session = sessionStorage.getItem(SESSION_STORAGE_KEY);
        return session ? JSON.parse(session) : null;
    } catch {
        return null;
    }
};

export const changePassword = async (username: string, oldPassword: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const user = users[username.toLowerCase()];

            if (!user || user.passwordHash !== oldPassword) {
                return reject(new Error("A senha atual está incorreta."));
            }
            
            if (!newPassword || newPassword.length < 4) {
                 return reject(new Error("A nova senha deve ter pelo menos 4 caracteres."));
            }

            user.passwordHash = newPassword;
            users[username.toLowerCase()] = user;
            saveUsers(users);
            resolve();
        }, 500);
    });
};

// Admin functions
export const getAllUsers = async (currentUser: User): Promise<StoredUser[]> => {
     return new Promise((resolve, reject) => {
        if (!currentUser?.isAdmin) {
            return reject(new Error("Acesso negado. Apenas administradores."));
        }
        const users = getUsers();
        resolve(Object.values(users));
    });
};

export const deleteUser = async (currentUser: User, usernameToDelete: string): Promise<void> => {
     return new Promise((resolve, reject) => {
        if (!currentUser?.isAdmin) {
            return reject(new Error("Acesso negado. Apenas administradores."));
        }
        if (currentUser.username.toLowerCase() === usernameToDelete.toLowerCase()) {
            return reject(new Error("Você não pode excluir sua própria conta."));
        }

        const users = getUsers();
        if (!users[usernameToDelete.toLowerCase()]) {
            return reject(new Error("Usuário não encontrado."));
        }

        delete users[usernameToDelete.toLowerCase()];
        saveUsers(users);
        deleteAllTasksForUser(usernameToDelete); // Also delete user's tasks
        deleteAllEventsForUser(usernameToDelete);
        deleteAllNotificationsForUser(usernameToDelete);
        resolve();
    });
};