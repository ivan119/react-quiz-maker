import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FC,
} from 'react';

export type UserRole = 'admin' | 'user' | null;

interface AuthContextType {
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
  isUser: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    // Try to get role from localStorage on init
    return (localStorage.getItem('user_role') as UserRole) || null;
  });

  const login = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('user_role', newRole);
    } else {
      localStorage.removeItem('user_role');
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('user_role');
  };

  const isAdmin = role === 'admin';
  const isUser = role === 'user';
  const isAuthenticated = role !== null;

  return (
    <AuthContext.Provider
      value={{ role, login, logout, isAdmin, isUser, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
