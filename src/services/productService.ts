import type { Product } from '../types';
import initialData from '../../public/data/productos.json';

const STORAGE_KEY = 'concegas_products';

// Helper to get products from storage
const getStoredProducts = (): Product[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

// Helper to save to storage
const setStoredProducts = (products: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
    getAll: (): Product[] => {
        const stored = getStoredProducts();
        if (stored.length === 0) {
            // Seed with initial data if empty
            // We map the raw JSON to ensure it matches our interface if needed
            // The JSON structure matches Product interface exactly
            setStoredProducts(initialData);
            return initialData;
        }
        return stored;
    },

    getById: (id: string): Product | undefined => {
        const products = productService.getAll();
        return products.find(p => p.id === id);
    },

    create: (product: Product): void => {
        const products = productService.getAll();
        // Check if ID exists
        if (products.some(p => p.id === product.id)) {
            throw new Error('El producto con este ID ya existe');
        }
        products.push(product);
        setStoredProducts(products);
    },

    update: (id: string, updatedProduct: Partial<Product>): void => {
        let products = productService.getAll();
        products = products.map(p =>
            p.id === id ? { ...p, ...updatedProduct } : p
        );
        setStoredProducts(products);
    },

    delete: (id: string): void => {
        let products = productService.getAll();
        products = products.filter(p => p.id !== id);
        setStoredProducts(products);
    }
};
