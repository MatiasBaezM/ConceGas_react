import { useState } from 'react';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { formatearRut, validarRut } from '../../utils/rutUtils';

interface LoginModalProps {
    show: boolean;
    handleClose: () => void;
    onRecoverClick?: () => void;
    onRegisterClick?: () => void;
}

function LoginModal({ show, handleClose, onRecoverClick, onRegisterClick }: LoginModalProps) {
    const { login } = useAuth(); // Hook de autenticación
    const [rut, setRut] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false); // Estado para mostrar/ocultar contraseña
    const [isRutValid, setIsRutValid] = useState(true);

    // Formatear RUT mientras el usuario escribe
    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setRut(formatearRut(val));
        setIsRutValid(true); // Reset validation state while typing
    };

    // Validar RUT cuando el usuario deja el campo
    const handleRutBlur = () => {
        if (rut.length > 1) {
            setIsRutValid(validarRut(rut));
        }
    };

    // Manejar envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validarRut(rut)) {
            setIsRutValid(false);
            return;
        }

        // Intentar loguear con el contexto
        const success = login(rut, pass);
        if (success) {
            handleClose();
            // Limpiar campos si fue exitoso
            setRut('');
            setPass('');
        } else {
            setError('Credenciales inválidas. Intente nuevamenta.\n(Demo: Cliente: 11.111.111-1 / admin: 22.222.222-2)');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="modal-premium">
            <Modal.Header closeButton className="modal-premium-header">
                <Modal.Title className="modal-premium-title">Inicio Sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Mostrar alerta si hay error */}
                {error && <Alert variant="danger" style={{ whiteSpace: 'pre-line' }}>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="rut">
                        <Form.Label>Rut</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="12.345.678-9"
                            value={rut}
                            onChange={handleRutChange}
                            onBlur={handleRutBlur}
                            isInvalid={!isRutValid} // Bootstrap styling for invalid check
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Rut inválido
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Ingrese rut sin puntos con guión
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pass">
                        <Form.Label>Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPass ? "text" : "password"} // Type dinámico para ver pass
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                required
                            />
                            {/* Botón del "ojito" para ver contraseña */}
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? "👁️" : "🔒"}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <div className="mt-4">
                        <Button className="w-100 mb-2 btn-premium" type="submit">
                            Iniciar
                        </Button>
                        <div className="text-center d-flex flex-column gap-2">
                            {/* Enlaces de ayuda que disparan eventos al padre (App) */}
                            <a
                                href="#"
                                className="text-muted small"
                                style={{ textDecoration: 'none' }}
                                onClick={(e) => { e.preventDefault(); onRecoverClick?.(); }}
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                            <a
                                href="#"
                                className="text-muted"
                                style={{ textDecoration: 'none' }}
                                onClick={(e) => { e.preventDefault(); onRegisterClick?.(); }}
                            >
                                ¿No tengo cuenta?
                            </a>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;
