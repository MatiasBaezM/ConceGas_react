import { useState } from 'react';
import { Nav, Table, Button, Badge, Modal, Row, Col, Form } from 'react-bootstrap';

function AdminOrders() {
    const [activeTab, setActiveTab] = useState('pendientes');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // Datos mock para demostración
    const mockOrders = [
        { id: '#1001', client: 'Juan Pérez', address: 'Av. Siempre Viva 123', total: 25100, status: 'pendientes', products: [{ name: 'Gas Licuado 15kg', qty: 1, price: 25100 }] },
        { id: '#1000', client: 'Maria Garcia', address: 'Calle Falsa 123', total: 50200, status: 'preparacion', assignedTo: 'Pedro Repartidor', products: [{ name: 'Gas Licuado 45kg', qty: 1, price: 50200 }] },
        { id: '#0999', client: 'Carlos Lopez', address: 'Psje. 1', total: 15000, status: 'enviados', assignedTo: 'Pedro Repartidor', products: [{ name: 'Gas Licuado 5kg', qty: 1, price: 15000 }] },
        { id: '#0998', client: 'Ana Torres', address: 'Av. Libertad 500', total: 45000, status: 'entregados', assignedTo: 'Luisa Repartidor', products: [{ name: 'Gas Licuado 15kg', qty: 2, price: 22500 }] },
    ];

    const filteredOrders = mockOrders.filter(o => o.status === activeTab);

    const handleShowDetail = (order: any) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const renderOrderTable = () => (
        <div className="table-responsive">
            <Table striped bordered hover variant="dark" className="align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        {activeTab === 'pendientes' && <th>Dirección</th>}
                        {(activeTab === 'preparacion' || activeTab === 'enviados' || activeTab === 'entregados') && <th>Repartidor</th>}
                        <th>Total</th>
                        <th>Estado</th>
                        {activeTab !== 'entregados' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.client}</td>
                            {activeTab === 'pendientes' && <td>{order.address}</td>}
                            {(activeTab === 'preparacion' || activeTab === 'enviados' || activeTab === 'entregados') && (
                                <td>
                                    {activeTab === 'preparacion' ? (
                                        <Form.Select size="sm" defaultValue={order.assignedTo || ""}>
                                            <option value="">Sin asignar</option>
                                            <option value="Pedro">Pedro Repartidor</option>
                                            <option value="Luisa">Luisa Repartidor</option>
                                        </Form.Select>
                                    ) : (
                                        order.assignedTo
                                    )}
                                </td>
                            )}
                            <td>${order.total.toLocaleString('es-CL')}</td>
                            <td>
                                <Badge bg={
                                    order.status === 'pendientes' ? 'warning' :
                                        order.status === 'preparacion' ? 'info' :
                                            order.status === 'enviados' ? 'primary' : 'success'
                                } text={order.status === 'pendientes' || order.status === 'preparacion' ? 'dark' : 'white'}>
                                    {order.status.toUpperCase()}
                                </Badge>
                            </td>
                            {activeTab !== 'entregados' && (
                                <td>
                                    <Button variant="primary" size="sm" onClick={() => handleShowDetail(order)}>
                                        Ver Detalle
                                    </Button>
                                    {activeTab === 'pendientes' && (
                                        <Button variant="outline-light" size="sm" className="ms-1">Aceptar</Button>
                                    )}
                                    {activeTab === 'preparacion' && (
                                        <Button variant="success" size="sm" className="ms-1">Marcar Listo</Button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center">No hay pedidos en esta categoría</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );

    return (
        <div>
            <h2 className="mb-4 text-dark">Administración de Pedidos</h2>

            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'pendientes')} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="pendientes">Pendientes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="preparacion">En preparación</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="enviados">Enviados</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="entregados">Entregados</Nav.Link>
                </Nav.Item>
            </Nav>

            {renderOrderTable()}

            {/* MODAL DETALLE */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Detalle del Pedido {selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {selectedOrder && (
                        <>
                            <Row>
                                <Col md={6}>
                                    <h6 className="fw-bold">Información del Cliente</h6>
                                    <p className="mb-1"><strong>Nombre:</strong> {selectedOrder.client}</p>
                                    <p className="mb-1"><strong>Dirección:</strong> {selectedOrder.address}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 className="fw-bold">Estado</h6>
                                    <p>
                                        <Badge bg="info">{selectedOrder.status}</Badge>
                                    </p>
                                </Col>
                            </Row>
                            <hr className="border-secondary" />
                            <h6 className="fw-bold mt-3">Productos</h6>
                            <Table variant="dark" size="sm" striped>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cant.</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.products.map((p: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{p.name}</td>
                                            <td>{p.qty}</td>
                                            <td>${p.price.toLocaleString('es-CL')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan={2} className="text-end">Total a Pagar:</th>
                                        <th>${selectedOrder.total.toLocaleString('es-CL')}</th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
                    <Button variant="primary">Imprimir Ticket</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminOrders;
