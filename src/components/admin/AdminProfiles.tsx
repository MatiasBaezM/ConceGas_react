import { useState } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';

function AdminProfiles() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Mock data based on template
    const profiles = [
        { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', type: 'Cliente', status: 'Activo' },
        { id: 2, name: 'Admin General', email: 'admin@concegas.cl', type: 'Administrador', status: 'Activo' }
    ];

    return (
        <div>
            <h2 className="mb-4 text-dark">Gestión de Perfiles</h2>

            <div className="table-responsive">
                <Table striped bordered hover variant="dark" className="align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            <th>Tipo de Perfil</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map(profile => (
                            <tr key={profile.id}>
                                <td>{profile.id}</td>
                                <td>{profile.name}</td>
                                <td>{profile.email}</td>
                                <td>
                                    <Badge bg={profile.type === 'Administrador' ? 'danger' : 'primary'}>
                                        {profile.type}
                                    </Badge>
                                </td>
                                <td><Badge bg="success">{profile.status}</Badge></td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => setShowEditModal(true)}>
                                        Editar
                                    </Button>
                                    {profile.type !== 'Administrador' && (
                                        <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                                            Eliminar
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Button variant="success" className="mt-3" onClick={() => setShowCreateModal(true)}>
                + Crear Nuevo Usuario
            </Button>

            {/* MODAL CREAR USUARIO */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Crear Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control type="text" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Perfil</Form.Label>
                            <Form.Select>
                                <option value="cliente">Cliente</option>
                                <option value="repartidor">Repartidor</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={() => setShowCreateModal(false)}>Crear Usuario</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL EDITAR USUARIO */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control type="text" defaultValue="Juan Pérez" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" defaultValue="juan.perez@email.com" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Perfil</Form.Label>
                            <Form.Select defaultValue="cliente">
                                <option value="cliente">Cliente</option>
                                <option value="repartidor">Repartidor</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select defaultValue="activo">
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="bloqueado">Bloqueado</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={() => setShowEditModal(false)}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL ELIMINAR USUARIO */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title className="text-danger">Eliminar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <p>¿Estás seguro que deseas eliminar este usuario?</p>
                    <p className="text-danger small">Esta acción no se puede deshacer.</p>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={() => setShowDeleteModal(false)}>Eliminar Definitivamente</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminProfiles;
