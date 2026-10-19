import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getAccessToken } from '../services/apiClient';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    authService.refreshSession()
      .then((token) => {
        if (isMounted) {
          setIsAuthenticated(Boolean(token));
          if (token) {
            setUser({ username: 'developer' });
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = () => {
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
        accessToken: getAccessToken(),
        isAuthenticated,
        isLoading,
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
