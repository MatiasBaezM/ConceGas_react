import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
    it('should render the company name', () => {
        render(<Footer />);
        expect(screen.getByText('ConceGas')).toBeInTheDocument();
    });

    it('should render contact information', () => {
        render(<Footer />);
        expect(screen.getByText(/contacto@concegas.cl/i)).toBeInTheDocument();
        expect(screen.getByText(/\+56 9 1234 5678/i)).toBeInTheDocument();
    });

    it('should render the copyright year', () => {
        render(<Footer />);
        expect(screen.getByText(/2026 ConceGas/i)).toBeInTheDocument();
    });
});
