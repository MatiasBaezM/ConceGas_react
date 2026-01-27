import { describe, it, expect } from 'vitest';
import { isValidChileanPhone, isValidRut } from './validationUtils';

describe('Validation Utils', () => {
    describe('isValidChileanPhone', () => {
        it('should return true for a valid 9-digit phone number', () => {
            expect(isValidChileanPhone('912345678')).toBe(true);
        });

        it('should return true for a phone number with +56 prefix', () => {
            expect(isValidChileanPhone('+56912345678')).toBe(true);
        });

        it('should return true for a phone number with spaces', () => {
            expect(isValidChileanPhone('9 1234 5678')).toBe(true);
        });

        it('should return false for a phone number with less than 9 digits', () => {
            expect(isValidChileanPhone('91234567')).toBe(false);
        });

        it('should return false for a phone number with more than 9 digits', () => {
            expect(isValidChileanPhone('9123456789')).toBe(false);
        });

        it('should return false for non-numeric characters', () => {
            expect(isValidChileanPhone('91234abcd')).toBe(false);
        });
    });

    describe('isValidRut', () => {
        it('should return true for a valid RUT format', () => {
            expect(isValidRut('12345678-9')).toBe(true);
        });

        it('should return true for a valid RUT format with K', () => {
            expect(isValidRut('12345678-k')).toBe(true);
            expect(isValidRut('12345678-K')).toBe(true);
        });

        it('should return false for an invalid RUT format (missing dash)', () => {
            expect(isValidRut('123456789')).toBe(false);
        });

        it('should return false for empty rut', () => {
            expect(isValidRut('')).toBe(false);
        });
    });
});
