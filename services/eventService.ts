import { CalendarEvent } from '../types';

const getStorageKey = (username: string) => `forte-itapema-events-${username.toLowerCase()}`;

const getEventsFromStorage = (username: string): CalendarEvent[] => {
    try {
        const stored = localStorage.getItem(getStorageKey(username));
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Erro ao ler eventos do localStorage:", error);
        return [];
    }
};

const saveEventsToStorage = (username: string, events: CalendarEvent[]) => {
    try {
        localStorage.setItem(getStorageKey(username), JSON.stringify(events));
    } catch (error) {
        console.error("Erro ao salvar eventos no localStorage:", error);
    }
};

export const getEvents = async (username: string): Promise<CalendarEvent[]> => {
    return Promise.resolve(getEventsFromStorage(username));
};

export const addEvent = async (username: string, eventData: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<CalendarEvent[]> => {
    const events = getEventsFromStorage(username);
    const newEvent: CalendarEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...eventData,
        createdAt: Date.now()
    };
    const updatedEvents = [...events, newEvent];
    saveEventsToStorage(username, updatedEvents);
    return Promise.resolve(updatedEvents);
};

export const updateEvent = async (username: string, id: string, updates: Partial<Omit<CalendarEvent, 'id'>>): Promise<CalendarEvent[]> => {
    const events = getEventsFromStorage(username);
    const updatedEvents = events.map(event =>
        event.id === id ? { ...event, ...updates } : event
    );
    saveEventsToStorage(username, updatedEvents);
    return Promise.resolve(updatedEvents);
};

export const deleteEvent = async (username: string, id: string): Promise<CalendarEvent[]> => {
    const events = getEventsFromStorage(username);
    const updatedEvents = events.filter(event => event.id !== id);
    saveEventsToStorage(username, updatedEvents);
    return Promise.resolve(updatedEvents);
};

export const deleteAllEventsForUser = (username: string): void => {
    try {
        localStorage.removeItem(getStorageKey(username));
    } catch (error) {
        console.error("Erro ao deletar eventos do usuário:", error);
    }
}