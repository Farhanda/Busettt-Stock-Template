import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { socketService } from './socket';

// 1. Definisi bentuk data dalam Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  role: UserRole | null;
}

// 2. Buat Context dengan default value null
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user dari localStorage saat pertama kali aplikasi jalan
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Langsung hubungkan socket jika user tersimpan
      socketService.connect(parsedUser.id, parsedUser.role);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('token', userData.token || ''); // Simpan token jika ada
    localStorage.setItem('user', JSON.stringify(userData));
    socketService.connect(userData.id, userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketService.disconnect();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      role: user?.role || null 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook agar pemanggilan di komponen lebih pendek
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};