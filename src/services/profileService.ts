import type { UserProfile } from '../types';
import { isValidChileanPhone } from '../utils/validationUtils';

const STORAGE_KEY = 'concegas_users';

const INITIAL_USERS: UserProfile[] = [
    {
        rut: '11.111.111-1',
        pass: 'cliente123',
        name: 'Juan Pérez',
        role: 'cliente',
        email: 'cliente@concegas.cl',
        telefono: '912345678'
    },
    {
        rut: '22.222.222-2',
        pass: 'admin123',
        name: 'Administrador',
        role: 'admin',
        email: 'admin@concegas.cl',
        telefono: '987654321'
    },
    {
        rut: '33.333.333-3',
        pass: 'repartidor123',
        name: 'Pedro Repartidor',
        role: 'repartidor',
        email: 'repartidor@concegas.cl',
        telefono: '955555555'
    }
];

const getStoredUsers = (): UserProfile[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

const setStoredUsers = (users: UserProfile[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const profileService = {
    getAll: (): UserProfile[] => {
        const stored = getStoredUsers();
        if (stored.length === 0) {
            setStoredUsers(INITIAL_USERS);
            return INITIAL_USERS;
        }
        return stored;
    },

    getByRut: (rut: string): UserProfile | undefined => {
        const users = profileService.getAll();
        return users.find(u => u.rut === rut);
    },

    create: (user: UserProfile): void => {
        const users = profileService.getAll();
        if (users.some(u => u.rut === user.rut)) {
            throw new Error('El usuario con este RUT ya existe');
        }
        if (!isValidChileanPhone(user.telefono)) {
            throw new Error('El número de teléfono no es válido (debe ser 9 dígitos)');
        }
        users.push(user);
        setStoredUsers(users);
    },

    update: (rut: string, updatedUser: Partial<UserProfile>): void => {
        let users = profileService.getAll();

        if (updatedUser.telefono && !isValidChileanPhone(updatedUser.telefono)) {
            throw new Error('El número de teléfono no es válido (debe ser 9 dígitos)');
        }

        users = users.map(u =>
            u.rut === rut ? { ...u, ...updatedUser } : u
        );
        setStoredUsers(users);
    },

    delete: (rut: string): void => {
        let users = profileService.getAll();
        // Prevent deleting the last admin? (Optional safety)
        users = users.filter(u => u.rut !== rut);
        setStoredUsers(users);
    },

    validateCredentials: (rut: string, pass: string): UserProfile | undefined => {
        const users = profileService.getAll();
        return users.find(u => u.rut === rut && u.pass === pass);
    }
};
