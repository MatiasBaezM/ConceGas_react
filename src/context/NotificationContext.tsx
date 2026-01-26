import { createContext, useContext, useState, type ReactNode } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface NotificationContextType {
    notify: (message: string, title?: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('Notificación');
    const [variant, setVariant] = useState<'success' | 'danger' | 'info' | 'warning'>('info');

    const notify = (msg: string, t?: string, v?: 'success' | 'danger' | 'info' | 'warning') => {
        setMessage(msg);
        setTitle(t || 'Notificación');
        setVariant(v || 'info');
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const getHeaderClass = () => {
        switch (variant) {
            case 'success': return 'bg-success text-white';
            case 'danger': return 'bg-danger text-white';
            case 'warning': return 'bg-warning text-dark';
            default: return 'bg-primary text-white';
        }
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Modal show={show} onHide={handleClose} centered className="modal-premium">
                <Modal.Header closeButton className={`border-0 ${getHeaderClass()}`}>
                    <Modal.Title className="fs-5 fw-bold">{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 text-center">
                    <p className="mb-0 fs-5">{message}</p>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center pb-4">
                    <Button variant={variant === 'warning' ? 'warning' : variant} onClick={handleClose} className="px-4 btn-premium">
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
