import { createContext, useContext, useState, type ReactNode } from 'react';

// Definimos los tipos de roles y usuario
// Role puede ser 'cliente' o 'admin'
export type Role = 'cliente' | 'admin';

// Definición de la estructura de un Usuario
export interface User {
    rut: string;
    name: string;
    role: Role;
}

// Interfaz que define qué datos y funciones compartirá este contexto
interface AuthContextType {
    user: User | null; // El usuario actual, o null si no hay nadie conectado
    login: (rut: string, pass: string) => boolean; // Función para iniciar sesión
    logout: () => void; // Función para cerrar sesión
    isAuthenticated: boolean; // Bandera rápida para saber si está logueado
    isAdmin: boolean; // Bandera rápida para saber si es admin
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios "Mock" (falsos/quemados en código para pruebas sin base de datos real)
const MOCK_USERS = [
    {
        rut: '11.111.111-1',
        pass: 'cliente123',
        name: 'Juan Pérez',
        role: 'cliente' as Role
    },
    {
        rut: '22.222.222-2',
        pass: 'admin123',
        name: 'Administrador',
        role: 'admin' as Role
    }
];

// Proveedor del contexto: envuelve la app y da acceso a la autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Lógica de inicio de sesión
    const login = (rut: string, pass: string): boolean => {
        // Buscamos si existe un usuario que coincida con rut y pass en nuestra lista Mock
        const foundUser = MOCK_USERS.find(u => u.rut === rut && u.pass === pass);

        if (foundUser) {
            // Si lo encontramos, guardamos sus datos en el estado
            setUser({
                rut: foundUser.rut,
                name: foundUser.name,
                role: foundUser.role
            });
            return true; // Login exitoso
        }
        return false; // Login fallido
    };

    // Lógica para cerrar sesión
    const logout = () => {
        setUser(null); // Borramos el usuario del estado
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user, // Es true si user no es null
            isAdmin: user?.role === 'admin' // Es true si el rol es admin
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar este contexto fácilmente en cualquier componente
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
