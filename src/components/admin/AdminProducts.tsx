import { useState } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';

function AdminProducts() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Mock data based on template
    const products = [
        { name: 'Gas Licuado 15 kg', price: 25100, desc: 'Cilindro de gas para cocina y calefón', stock: 18 }
    ];

    return (
        <div>
            <h2 className="mb-4 text-dark">Gestión de Productos</h2>

            <div className="table-responsive">
                <Table hover className="align-middle bg-white">
                    <thead className="table-light">
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((prod, idx) => (
                            <tr key={idx}>
                                <td>{prod.name}</td>
                                <td>${prod.price.toLocaleString('es-CL')}</td>
                                <td>{prod.desc}</td>
                                <td><Badge bg="success">Stock: {prod.stock}</Badge></td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => setShowEditModal(true)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Agregar producto
            </Button>

            {/* MODAL AGREGAR PRODUCTO */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">Agrega Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Name" required />
                            <Form.Text className="text-muted">Ingrese el nombre del producto</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio ($)</Form.Label>
                            <Form.Control type="number" placeholder="$ 20.000" required />
                            <Form.Text className="text-muted">Ingrese el precio para producto</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control type="text" placeholder=" " required />
                            <Form.Text className="text-muted">Ingrese descripcion del producto</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen del producto</Form.Label>
                            <Button variant="outline-primary" className="w-100 mb-2">Seleccionar imagen</Button>
                            <Form.Text className="text-muted">JPG, PNG o WEBP</Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowCreateModal(false)}>Crear</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL EDITAR PRODUCTO */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">✏️ Editar producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={7}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" defaultValue="Gas Licuado 15 kg" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio ($)</Form.Label>
                                <Form.Control type="text" defaultValue="25100" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="number" defaultValue="18" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control as="textarea" rows={3} defaultValue="Cilindro de gas para cocina y calefón" required />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3">
                                <Form.Label>Imagen del producto</Form.Label>
                                <Button variant="outline-primary" className="w-100 mb-2">Cambiar imagen</Button>
                                <div className="text-center">
                                    <img src="/img/cilindro_15kg.png" className="img-fluid rounded border" style={{ maxHeight: '220px' }} alt="Preview" />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={() => setShowEditModal(false)}>Guardar cambios</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL ELIMINAR PRODUCTO */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">❌ Eliminar producto</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>¿Estás seguro que deseas eliminar el producto?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={() => setShowDeleteModal(false)}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminProducts;
