export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    day: DayOfWeek;
}
