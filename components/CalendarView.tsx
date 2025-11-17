import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '../services/authService';
import { CalendarEvent } from '../types';
import { getEvents, addEvent, deleteEvent, updateEvent } from '../services/eventService';
import { deleteNotificationsForEvent } from '../services/notificationService';
import Spinner from './Spinner';
import EditEventModal from './EditEventModal';

interface CalendarViewProps {
    user: User;
}

const CalendarView: React.FC<CalendarViewProps> = ({ user }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');

    const fetchEvents = useCallback(() => {
        setLoading(true);
        getEvents(user.username)
            .then(setEvents)
            .catch(() => setError("Falha ao carregar eventos."))
            .finally(() => setLoading(false));
    }, [user.username]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleAddEvent = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const updatedEvents = await addEvent(user.username, { date: selectedDate, title, time });
            setEvents(updatedEvents);
            setTitle('');
            setTime('');
        } catch {
            setError("Não foi possível adicionar o evento.");
        }
    }, [user.username, selectedDate, title, time]);

    const handleUpdateEvent = useCallback(async (id: string, updates: { title: string, time?: string }) => {
        try {
            await updateEvent(user.username, id, updates);
            setEvents(prevEvents => prevEvents.map(event =>
                event.id === id ? { ...event, ...updates } : event
            ));
            setEditingEvent(null);
        } catch {
            setError("Não foi possível atualizar o evento.");
        }
    }, [user.username]);


    const handleDeleteEvent = useCallback(async (id: string) => {
        try {
            await deleteEvent(user.username, id);
            await deleteNotificationsForEvent(user.username, id);
            setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
            setEditingEvent(null); // Close modal on success
        } catch {
            setError("Não foi possível excluir o evento.");
        }
    }, [user.username]);


    const { month, year, calendarGrid, monthName } = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid = [];
        let day = 1;
        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)) || day > daysInMonth) {
                    week.push(null);
                } else {
                    week.push(day++);
                }
            }
            grid.push(week);
            if (day > daysInMonth) break;
        }
        return { month, year, calendarGrid: grid, monthName };
    }, [currentDate]);
    
    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            (acc[event.date] = acc[event.date] || []).push(event);
            return acc;
        }, {} as Record<string, CalendarEvent[]>);
    }, [events]);

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    return (
        <div>
             {editingEvent && (
                <EditEventModal 
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSave={handleUpdateEvent}
                    onDelete={handleDeleteEvent}
                />
            )}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar Grid */}
                <div className="w-full md:w-2/3">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">&larr;</button>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{monthName}</h2>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">&rarr;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => <div key={d} className="font-semibold text-sm text-gray-500 p-2">{d}</div>)}
                        {calendarGrid.flat().map((day, i) => {
                             const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                             const isToday = new Date().toISOString().split('T')[0] === dateStr;
                             const isSelected = selectedDate === dateStr;

                            return (<div key={i} className="relative flex items-center justify-center">
                                {day && (
                                    <button
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                                            ${isSelected ? 'bg-blue-600 text-white font-bold' : ''}
                                            ${!isSelected && isToday ? 'bg-blue-100 text-blue-700 font-bold' : ''}
                                            ${!isSelected && !isToday ? 'text-gray-700 hover:bg-gray-100' : ''}
                                        `}
                                    >
                                        {day}
                                    </button>
                                )}
                                {eventsByDate[dateStr] && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-red-500 rounded-full"></div>}
                            </div>
                        )})}
                    </div>
                </div>

                {/* Events & Form */}
                <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-lg mb-3 text-gray-800">Eventos para {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</h3>
                    <div className="space-y-2 mb-4 min-h-[80px]">
                        {eventsByDate[selectedDate] ? eventsByDate[selectedDate].sort((a,b) => (a.time || '').localeCompare(b.time || '')).map(event => (
                            <div key={event.id} className="bg-white p-2 rounded shadow-sm border flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{event.title}</p>
                                    <p className="text-sm text-gray-500">{event.time}</p>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setEditingEvent(event)}
                                        className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                        aria-label="Editar Evento"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-sm">Nenhum evento neste dia.</p>}
                    </div>

                    <form onSubmit={handleAddEvent} className="space-y-3 border-t pt-4">
                         <h4 className="font-semibold text-gray-800">Adicionar Novo Evento</h4>
                         <div>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título do Evento" className="w-full p-2 border border-gray-300 rounded-lg" required />
                         </div>
                         <div>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                         </div>
                         <button type="submit" className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Adicionar</button>
                    </form>
                </div>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
};

export default CalendarView;