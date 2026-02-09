import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
  type FC,
} from 'react';

export type UserRole = 'admin' | null;

interface AuthContextType {
  role: UserRole;
  login: () => void;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    // Try to get role from localStorage on init
    return (localStorage.getItem('user_role') as UserRole) || null;
  });

  const login = useCallback(() => {
    const newRole: UserRole = 'admin';
    setRole(newRole);
    localStorage.setItem('user_role', newRole);
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    localStorage.removeItem('user_role');
  }, []);

  const value = useMemo(
    () => ({
      role,
      login,
      logout,
      isAdmin: role === 'admin',
      isAuthenticated: role !== null,
    }),
    [role, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
