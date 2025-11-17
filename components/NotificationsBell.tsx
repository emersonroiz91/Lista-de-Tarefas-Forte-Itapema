import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '../services/authService';
import { Notification } from '../types';
import { getNotifications, markAllAsRead } from '../services/notificationService';

interface NotificationsBellProps {
    user: User;
}

const BellIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const NotificationsBell: React.FC<NotificationsBellProps> = ({ user }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    const fetchNotifications = useCallback(() => {
        getNotifications(user.username).then(setNotifications);
    }, [user.username]);

    useEffect(() => {
        fetchNotifications();
        // Check for new notifications periodically
        const interval = setInterval(fetchNotifications, 60000); // every minute
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        const updated = await markAllAsRead(user.username);
        setNotifications(updated);
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={`Notificações (${unreadCount} não lidas)`}
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20">
                    <div className="p-3 flex justify-between items-center border-b">
                        <h3 className="font-semibold text-gray-800">Notificações</h3>
                        {notifications.length > 0 && (
                             <button onClick={handleMarkAllRead} className="text-sm text-blue-600 hover:underline disabled:text-gray-400" disabled={unreadCount === 0}>
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                             [...notifications].sort((a,b) => b.createdAt - a.createdAt).map(n => (
                                <div key={n.id} className={`p-3 border-b border-gray-100 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                    <p className="text-sm text-gray-700">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                             <p className="p-4 text-center text-gray-500">Nenhuma notificação.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsBell;
