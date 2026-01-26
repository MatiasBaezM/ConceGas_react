import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface ChangePasswordModalProps {
    show: boolean;
    handleClose: () => void;
}

function ChangePasswordModal({ show, handleClose }: ChangePasswordModalProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Simulación de cambio de contraseña
        setError('');
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setPassword('');
            setConfirmPassword('');
            handleClose();
        }, 2000);
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="modal-premium">
            <Modal.Header closeButton className="modal-premium-header">
                <Modal.Title className="modal-premium-title">Cambiar Contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success ? (
                    <Alert variant="success">
                        ✅ Contraseña actualizada correctamente.
                    </Alert>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="confirmNewPassword">
                            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="******"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="d-grid">
                            <Button className="btn-premium" type="submit">
                                Actualizar Contraseña
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default ChangePasswordModal;
