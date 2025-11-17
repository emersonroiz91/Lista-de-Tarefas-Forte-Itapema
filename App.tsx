import React, { useState } from 'react';
import { getCurrentUser, logout, User } from './services/authService';
import Auth from './components/Auth';
import TaskManager from './components/TaskManager';
import AdminPanel from './components/AdminPanel';
import ChangePasswordModal from './components/ChangePasswordModal';

type View = 'tasks' | 'admin';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
    const [view, setView] = useState<View>('tasks');
    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setView('tasks');
    };

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
    };

    const handleOpenChangePassword = () => setChangePasswordModalOpen(true);
    const handleCloseChangePassword = () => setChangePasswordModalOpen(false);

    const renderContent = () => {
        if (!currentUser) {
            return <Auth onLoginSuccess={handleLoginSuccess} />;
        }

        if (view === 'admin' && currentUser.isAdmin) {
            return (
                <AdminPanel 
                    user={currentUser} 
                    onNavigateToTasks={() => setView('tasks')}
                    onOpenChangePassword={handleOpenChangePassword} 
                />
            );
        }
        
        // Default to tasks view
        return (
            <TaskManager 
                user={currentUser} 
                onLogout={handleLogout} 
                onNavigateToAdmin={() => setView('admin')} 
                onOpenChangePassword={handleOpenChangePassword}
            />
        );
    };

    return (
        <div className="p-4 md:p-8 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden relative">
                {renderContent()}
                {currentUser && isChangePasswordModalOpen && (
                    <ChangePasswordModal 
                        user={currentUser}
                        onClose={handleCloseChangePassword}
                    />
                )}
            </div>
        </div>
    );
};

export default App;