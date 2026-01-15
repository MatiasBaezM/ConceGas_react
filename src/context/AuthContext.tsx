import { createContext, useState, type ReactNode } from 'react';

// Definimos los tipos de roles y usuario
// Role puede ser 'cliente' o 'admin'
export type Role = 'cliente' | 'admin' | 'repartidor';

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
    isRepartidor: boolean; // Bandera para repartidor
}

// Creamos el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    },
    {
        rut: '33.333.333-3',
        pass: 'repartidor123',
        name: 'Pedro Repartidor',
        role: 'repartidor' as Role
    }
];

// Proveedor del contexto: envuelve la app y da acceso a la autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
    // Inicializar estado leyendo de localStorage si existe
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('concegas_user');
        return stored ? JSON.parse(stored) : null;
    });

    // Lógica de inicio de sesión
    const login = (rut: string, pass: string): boolean => {
        // Buscamos si existe un usuario que coincida con rut y pass en nuestra lista Mock
        const foundUser = MOCK_USERS.find(u => u.rut === rut && u.pass === pass);

        if (foundUser) {
            const userData = {
                rut: foundUser.rut,
                name: foundUser.name,
                role: foundUser.role
            };
            // Si lo encontramos, guardamos sus datos en el estado y localStorage
            setUser(userData);
            localStorage.setItem('concegas_user', JSON.stringify(userData));
            return true; // Login exitoso
        }
        return false; // Login fallido
    };

    // Lógica para cerrar sesión
    const logout = () => {
        setUser(null); // Borramos el usuario del estado
        localStorage.removeItem('concegas_user'); // Borramos de localStorage
        // Opcional: limpiar también la vista guardada del admin
        localStorage.removeItem('admin_current_view');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user, // Es true si user no es null
            isAdmin: user?.role === 'admin', // Es true si el rol es admin
            isRepartidor: user?.role === 'repartidor' // Es true si el rol es repartidor
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook movido a src/hooks/useAuth.ts
