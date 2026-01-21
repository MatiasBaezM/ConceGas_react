import { useState } from 'react';
import { Nav, Table, Button, Badge, Modal, Row, Col, Form } from 'react-bootstrap';
import type { Order } from '../../types';

function AdminOrders() {
    const [activeTab, setActiveTab] = useState('pendiente');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Datos mock para demostración - Typed as Order[]
    const mockOrders: Order[] = [
        {
            id: '#1001',
            date: new Date().toISOString(),
            customerRut: '1-9',
            customerName: 'Juan Pérez',
            address: 'Av. Siempre Viva 123',
            total: 25100,
            status: 'pendiente',
            paymentMethod: 'efectivo',
            items: [{ id: 'p1', name: 'Gas Licuado 15kg', qty: 1, price: 25100 }]
        },
        {
            id: '#1000',
            date: new Date().toISOString(),
            customerRut: '2-7',
            customerName: 'Maria Garcia',
            address: 'Calle Falsa 123',
            total: 50200,
            status: 'preparacion',
            assignedTo: 'Pedro Repartidor',
            paymentMethod: 'transferencia',
            items: [{ id: 'p2', name: 'Gas Licuado 45kg', qty: 1, price: 50200 }]
        },
        {
            id: '#0999',
            date: new Date().toISOString(),
            customerRut: '3-5',
            customerName: 'Carlos Lopez',
            address: 'Psje. 1',
            total: 15000,
            status: 'enviados',
            assignedTo: 'Pedro Repartidor',
            paymentMethod: 'efectivo',
            items: [{ id: 'p3', name: 'Gas Licuado 5kg', qty: 1, price: 15000 }]
        },
        {
            id: '#0998',
            date: new Date().toISOString(),
            customerRut: '4-3',
            customerName: 'Ana Torres',
            address: 'Av. Libertad 500',
            total: 45000,
            status: 'entregados',
            assignedTo: 'Luisa Repartidor',
            paymentMethod: 'transferencia',
            items: [{ id: 'p4', name: 'Gas Licuado 15kg', qty: 2, price: 22500 }]
        },
    ];

    const filteredOrders = activeTab === 'finalizados'
        ? mockOrders.filter(o => o.status === 'entregados' || o.status === 'sin entrega')
        : mockOrders.filter(o => o.status === activeTab);

    const handleShowDetail = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const renderOrderTable = () => (
        <div className="table-responsive">
            <Table hover className="align-middle bg-white">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        {activeTab === 'pendiente' && <th>Dirección</th>}
                        {(activeTab === 'preparacion' || activeTab === 'enviados' || activeTab === 'finalizados') && <th>Repartidor</th>}
                        <th>Total</th>
                        <th>Estado</th>
                        {activeTab === 'finalizados' && <th>Motivo</th>}
                        {activeTab !== 'finalizados' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName}</td>
                            {activeTab === 'pendiente' && <td>{order.address}</td>}
                            {(activeTab === 'preparacion' || activeTab === 'enviados' || activeTab === 'finalizados') && (
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
                                    order.status === 'pendiente' ? 'warning' :
                                        order.status === 'preparacion' ? 'info' :
                                            order.status === 'enviados' ? 'primary' :
                                                order.status === 'sin entrega' ? 'danger' : 'success'
                                } text={order.status === 'pendiente' || order.status === 'preparacion' ? 'dark' : 'white'}>
                                    {order.status.toUpperCase()}
                                </Badge>
                            </td>
                            {activeTab === 'finalizados' && (
                                <td>
                                    {order.status === 'sin entrega'
                                        ? <span className="text-danger small fw-bold">{order.failReason || 'Sin motivo especificado'}</span>
                                        : <span className="text-muted small">N/A</span>
                                    }
                                </td>
                            )}
                            {activeTab !== 'finalizados' && (
                                <td>
                                    <Button variant="primary" size="sm" onClick={() => handleShowDetail(order)}>
                                        Ver Detalle
                                    </Button>
                                    {activeTab === 'pendiente' && (
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
                            <td colSpan={activeTab === 'finalizados' ? 7 : 6} className="text-center">No hay pedidos en esta categoría</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );

    return (
        <div>
            <h2 className="mb-4 text-dark">Administración de Pedidos</h2>

            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'pendiente')} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="pendiente">Pendientes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="preparacion">En preparación</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="enviados">Enviados</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="finalizados">Finalizados</Nav.Link>
                </Nav.Item>
            </Nav>

            {renderOrderTable()}

            {/* MODAL DETALLE */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered className="modal-premium">
                <Modal.Header closeButton className="modal-premium-header">
                    <Modal.Title className="modal-premium-title">Detalle del Pedido {selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <Row>
                                <Col md={6}>
                                    <h6 className="fw-bold">Información del Cliente</h6>
                                    <p className="mb-1"><strong>Nombre:</strong> {selectedOrder.customerName}</p>
                                    <p className="mb-1"><strong>Dirección:</strong> {selectedOrder.address}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 className="fw-bold">Estado</h6>
                                    <p>
                                        <Badge bg="info">{selectedOrder.status}</Badge>
                                    </p>
                                    {selectedOrder.failReason && (
                                        <div className="mt-2 p-2 border border-danger rounded bg-light">
                                            <small className="text-danger fw-bold">Motivo no entrega:</small>
                                            <p className="mb-0 small text-muted">{selectedOrder.failReason}</p>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <hr className="border-secondary" />
                            <h6 className="fw-bold mt-3">Productos</h6>
                            <Table hover size="sm" className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cant.</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((p, idx) => (
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
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
                    <Button variant="primary" className="btn-premium">Imprimir Ticket</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminOrders;
