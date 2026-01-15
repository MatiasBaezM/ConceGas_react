import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { formatearRut, validarRut } from '../../utils/rutUtils';

interface RegisterModalProps {
    show: boolean;
    handleClose: () => void;
}

function RegisterModal({ show, handleClose }: RegisterModalProps) {
    const [formData, setFormData] = useState({
        rut: '',
        nombre: '',
        email: '',
        telefono: '',
        pass: '',
        repass: ''
    });
    const [success, setSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isRutValid, setIsRutValid] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'rut') {
            setFormData(prev => ({ ...prev, [name]: formatearRut(value) }));
            setIsRutValid(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Validar contraseñas al escribir
        if (name === 'pass' || name === 'repass') {
            const p1 = name === 'pass' ? value : formData.pass;
            const p2 = name === 'repass' ? value : formData.repass;
            if (p1 && p2 && p1 !== p2) {
                setPasswordError('Las contraseñas no coinciden');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleRutBlur = () => {
        if (formData.rut.length > 1) {
            setIsRutValid(validarRut(formData.rut));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarRut(formData.rut)) {
            setIsRutValid(false);
            return;
        }

        if (formData.pass !== formData.repass) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        // Aquí iría la lógica de registro (API)
        console.log('Register attempt:', formData);
        setSuccess(true);

        // Opcional: Cerrar modal después de unos segundos
        setTimeout(() => {
            setSuccess(false);
            handleClose();
            // Limpiar formulario
            setFormData({
                rut: '',
                nombre: '',
                email: '',
                telefono: '',
                pass: '',
                repass: ''
            });
            setIsRutValid(true);
        }, 2000);
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="text-primary-custom">Formulario de Registro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success && (
                    <Alert variant="success">
                        ✅ Se ha registrado correctamente.
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="rut">
                        <Form.Label>Rut</Form.Label>
                        <Form.Control
                            type="text"
                            name="rut"
                            placeholder="12.345.678-9"
                            value={formData.rut}
                            onChange={handleChange}
                            onBlur={handleRutBlur}
                            isInvalid={!isRutValid}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Rut inválido
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Ingrese rut sin puntos con guión
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Ingrese nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="ejemplo@correo.cl"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Form.Text className="text-muted">
                            Usaremos este correo para notificaciones y recuperación de contraseña.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="telefono">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="tel"
                            name="telefono"
                            placeholder="912345678"
                            maxLength={9}
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                        <Form.Text className="text-muted">
                            Ingrese teléfono chileno de 9 dígitos (ej: 912345678)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pass">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="pass"
                            value={formData.pass}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="repass">
                        <Form.Label>Reingrese contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="repass"
                            value={formData.repass}
                            onChange={handleChange}
                            required
                        />
                        {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
                    </Form.Group>

                    <div className="mt-4">
                        <Button variant="primary" size="lg" type="submit" className="w-100">
                            Registrar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default RegisterModal;
