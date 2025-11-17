import { Notification, CalendarEvent } from '../types';
import { getEvents } from './eventService';

const getStorageKey = (username: string) => `forte-itapema-notifications-${username.toLowerCase()}`;

const getNotificationsFromStorage = (username: string): Notification[] => {
    try {
        const stored = localStorage.getItem(getStorageKey(username));
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Erro ao ler notificações do localStorage:", error);
        return [];
    }
};

const saveNotificationsToStorage = (username: string, notifications: Notification[]) => {
    try {
        localStorage.setItem(getStorageKey(username), JSON.stringify(notifications));
    } catch (error) {
        console.error("Erro ao salvar notificações no localStorage:", error);
    }
};

export const generateNotifications = async (username: string): Promise<Notification[]> => {
    const events = await getEvents(username);
    const notifications = getNotificationsFromStorage(username);
    const newNotifications: Notification[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach(event => {
        const eventDate = new Date(event.date + 'T00:00:00'); 
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let message = '';
        if (diffDays === 1) {
            message = `Lembrete: "${event.title}" é amanhã.`;
        } else if (diffDays === 0) {
            message = `Lembrete: "${event.title}" é hoje.`;
        }

        if (message && !notifications.some(n => n.eventId === event.id)) {
            newNotifications.push({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                eventId: event.id,
                message: message,
                read: false,
                createdAt: Date.now(),
            });
        }
    });

    if (newNotifications.length > 0) {
        const updatedNotifications = [...notifications, ...newNotifications];
        saveNotificationsToStorage(username, updatedNotifications);
        return updatedNotifications;
    }

    return notifications;
};


export const getNotifications = async (username: string): Promise<Notification[]> => {
    return generateNotifications(username);
};

export const markAllAsRead = async (username: string): Promise<Notification[]> => {
    const notifications = getNotificationsFromStorage(username);
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    saveNotificationsToStorage(username, updatedNotifications);
    return Promise.resolve(updatedNotifications);
};

export const deleteNotificationsForEvent = async (username: string, eventId: string): Promise<void> => {
    const notifications = getNotificationsFromStorage(username);
    const updatedNotifications = notifications.filter(n => n.eventId !== eventId);
    saveNotificationsToStorage(username, updatedNotifications);
    return Promise.resolve();
};


export const deleteAllNotificationsForUser = (username: string): void => {
     try {
        localStorage.removeItem(getStorageKey(username));
    } catch (error) {
        console.error("Erro ao deletar notificações do usuário:", error);
    }
}