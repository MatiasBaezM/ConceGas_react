import type { Order } from '../types';

const STORAGE_KEY = 'concegas_orders';

const getStoredOrders = (): Order[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

const setStoredOrders = (orders: Order[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const orderService = {
    getAll: (): Order[] => {
        return getStoredOrders();
    },

    getById: (id: string): Order | undefined => {
        const orders = orderService.getAll();
        return orders.find(o => o.id === id);
    },

    getByRut: (rut: string): Order[] => {
        const orders = orderService.getAll();
        return orders.filter(o => o.customerRut === rut);
    },

    create: (order: Order): void => {
        const orders = orderService.getAll();
        if (orders.some(o => o.id === order.id)) {
            throw new Error('El pedido con este ID ya existe');
        }
        orders.push(order);
        setStoredOrders(orders);
    },

    updateStatus: (id: string, newStatus: Order['status']): void => {
        let orders = orderService.getAll();
        orders = orders.map(o =>
            o.id === id ? { ...o, status: newStatus } : o
        );
        setStoredOrders(orders);
    },

    delete: (id: string): void => {
        let orders = orderService.getAll();
        orders = orders.filter(o => o.id !== id);
        setStoredOrders(orders);
    }
};
