import { useEffect } from 'react';
import { socketService } from './socket';
import { useAuth } from './AuthContext'; // Asumsi pake Zustand/Context
import { Router } from 'react-router';

const App = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Hubungkan socket dengan membawa ID dan Role
      socketService.connect(user.id, user.role);
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated, user]);

  return <Router> ... </Router>;
};