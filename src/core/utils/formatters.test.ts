import { describe, it, expect } from 'vitest';
import { formatPrice, parsePrice } from './formatters';

describe('formatters', () => {
    describe('formatPrice', () => {
        it('should format numbers to CLP currency string', () => {
            // Note: Intl formatting might include non-breaking spaces or specific characters
            // depending on the environment. We check if it contains the currency symbol and numbers.
            const result = formatPrice(15000);
            expect(result).toContain('$');
            expect(result).toContain('15.000');
        });

        it('should return empty string if input is not numeric', () => {
            expect(formatPrice('abc')).toBe('');
        });

        it('should handle numeric strings', () => {
            const result = formatPrice('20000');
            expect(result).toContain('20.000');
        });
    });

    describe('parsePrice', () => {
        it('should convert currency string back to number', () => {
            expect(parsePrice('$ 15.000')).toBe(15000);
            expect(parsePrice('15000')).toBe(15000);
        });

        it('should return 0 for non-numeric strings', () => {
            expect(parsePrice('abc')).toBe(0);
        });
    });
});
