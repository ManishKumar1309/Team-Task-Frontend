import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getAccessToken } from '../services/apiClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => authService.isAuthenticated());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (authService.isAuthenticated()) {
      authService.refreshSession()
        .then((token) => {
          if (isMounted) {
            const authed = Boolean(token);
            setIsAuthenticated(authed);
            setUser(authed ? authService.getCurrentUser() : null);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = () => {
    setAuthError(null);
    authService.startGitHubLogin();
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken: getAccessToken(),
        isAuthenticated,
        isLoading,
        authError,
        setAuthError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
