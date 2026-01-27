import { describe, it, expect, beforeEach, vi } from 'vitest';
import { profileService } from './profileService';
import type { UserProfile } from '../types';

// Mocking the JSON import to avoid path resolving issues in tests if necessary, 
// though Vitest usually handles it. If issues arise, we can mock it.
// For now, we assume initialData is loaded correctly or we rely on localStorage being empty initially.

describe('profileService', () => {
    const mockUser: UserProfile = {
        rut: '99.999.999-9',
        name: 'Test User',
        email: 'test@example.com',
        telefono: '912345678',
        pass: 'password123',
        role: 'cliente'
    };

    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should create a new user', () => {
        // Inicialmente podría haber usuarios iniciales, pero filtramos por el que creamos
        profileService.create(mockUser);

        const user = profileService.getByRut(mockUser.rut);
        expect(user).toBeDefined();
        expect(user?.name).toBe(mockUser.name);
    });

    it('should not create a user with duplicate RUT', () => {
        profileService.create(mockUser);
        expect(() => profileService.create(mockUser)).toThrow('El usuario con este RUT ya existe');
    });

    it('should validate phone number on create', () => {
        const invalidUser = { ...mockUser, telefono: '123' };
        expect(() => profileService.create(invalidUser)).toThrow('El número de teléfono no es válido');
    });

    it('should update an existing user', () => {
        profileService.create(mockUser);

        const updates = { name: 'Updated Name' };
        profileService.update(mockUser.rut, updates);

        const updatedUser = profileService.getByRut(mockUser.rut);
        expect(updatedUser?.name).toBe('Updated Name');
    });

    it('should validate phone number on update', () => {
        profileService.create(mockUser);
        expect(() => profileService.update(mockUser.rut, { telefono: '123' })).toThrow('El número de teléfono no es válido');
    });

    it('should delete a user', () => {
        profileService.create(mockUser);
        expect(profileService.getByRut(mockUser.rut)).toBeDefined();

        profileService.delete(mockUser.rut);
        expect(profileService.getByRut(mockUser.rut)).toBeUndefined();
    });

    it('should validate credentials correctly', () => {
        profileService.create(mockUser);

        const validUser = profileService.validateCredentials(mockUser.email, mockUser.pass);
        expect(validUser).toBeDefined();
        expect(validUser?.rut).toBe(mockUser.rut);

        const invalidUser = profileService.validateCredentials(mockUser.email, 'wrongpass');
        expect(invalidUser).toBeUndefined();
    });
});
