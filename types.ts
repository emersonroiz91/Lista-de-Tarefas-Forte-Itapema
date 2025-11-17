export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    day: DayOfWeek;
}

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    time?: string; // HH:mm
    description?: string;
    createdAt: number;
}

export interface Notification {
    id: string;
    eventId: string;
    message: string;
    read: boolean;
    createdAt: number;
}
