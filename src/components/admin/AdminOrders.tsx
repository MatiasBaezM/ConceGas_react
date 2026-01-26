import { useState, useEffect } from 'react';
import { Nav, Table, Button, Badge, Modal, Row, Col, Form, InputGroup } from 'react-bootstrap';
import type { Order, UserProfile } from '../../types';
import { orderService } from '../../services/orderService';
import { profileService } from '../../services/profileService';

function AdminOrders() {
    const [activeTab, setActiveTab] = useState('todos');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, total-high, total-low

    // Repartidores state
    const [repartidores, setRepartidores] = useState<UserProfile[]>([]);

    useEffect(() => {
        loadOrders();
        // Load repartidores
        const allUsers = profileService.getAll();
        setRepartidores(allUsers.filter(u => u.role === 'repartidor'));
    }, []);

    const loadOrders = () => {
        setOrders(orderService.getAll());
    };

    // Auto-refresh periodically to see new orders
    useEffect(() => {
        const interval = setInterval(() => {
            loadOrders();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredOrders = orders
        .filter(o => {
            // Filter by Tab
            if (activeTab === 'todos') return true;
            if (activeTab === 'finalizados') return o.status === 'entregados' || o.status === 'sin entrega';
            return o.status === activeTab;
        })
        .filter(o => {
            // Filter by Search Term
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                o.id.toLowerCase().includes(search) ||
                o.customerName.toLowerCase().includes(search) ||
                o.address.toLowerCase().includes(search)
            );
        })
        .sort((a, b) => {
            // Sort logic
            switch (sortOrder) {
                case 'newest':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'total-high':
                    return b.total - a.total;
                case 'total-low':
                    return a.total - b.total;
                default:
                    return 0;
            }
        });

    const handleShowDetail = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleAccept = (id: string) => {
        orderService.updateStatus(id, 'preparacion');
        loadOrders();
    };

    const handleAssign = (id: string, repartidorName: string) => {
        if (!repartidorName) return;
        orderService.updateStatus(id, 'enviados', repartidorName);
        loadOrders();
    };

    const renderOrderTable = () => (
        <div className="table-responsive">
            <Table hover className="align-middle bg-white">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        {(activeTab === 'pendiente' || activeTab === 'todos') && <th>Dirección</th>}
                        {(activeTab === 'preparacion' || activeTab === 'enviados' || activeTab === 'finalizados' || activeTab === 'todos') && <th>Repartidor</th>}
                        <th>Total</th>
                        <th>Estado</th>
                        {(activeTab === 'finalizados' || activeTab === 'todos') && <th>Motivo</th>}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{order.customerName}</td>
                            {(activeTab === 'pendiente' || activeTab === 'todos') && <td>{order.address}</td>}
                            {(activeTab === 'preparacion' || activeTab === 'enviados' || activeTab === 'finalizados' || activeTab === 'todos') && (
                                <td>
                                    {activeTab === 'preparacion' ? (
                                        <Form.Select
                                            size="sm"
                                            defaultValue=""
                                            onChange={(e) => handleAssign(order.id, e.target.value)}
                                        >
                                            <option value="">Asignar Repartidor...</option>
                                            {repartidores.map(rep => (
                                                <option key={rep.rut} value={rep.name}>{rep.name}</option>
                                            ))}
                                        </Form.Select>
                                    ) : (
                                        order.assignedTo || <span className="text-muted">Sin asignar</span>
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
                            {(activeTab === 'finalizados' || activeTab === 'todos') && (
                                <td>
                                    {order.status === 'sin entrega'
                                        ? <span className="text-danger small fw-bold">{order.failReason || 'Sin motivo especificado'}</span>
                                        : <span className="text-muted small">N/A</span>
                                    }
                                </td>
                            )}
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleShowDetail(order)}>
                                    Ver Detalle
                                </Button>
                                {activeTab === 'pendiente' && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="ms-1"
                                        onClick={() => handleAccept(order.id)}
                                    >
                                        Aceptar
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan={activeTab === 'finalizados' || activeTab === 'todos' ? 9 : 8} className="text-center">No hay pedidos que coincidan con los criterios</td>
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
                    <Nav.Link eventKey="todos">Todos</Nav.Link>
                </Nav.Item>
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

            <Row className="mb-4 g-3">
                <Col md={8}>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Text className="bg-white border-end-0">
                                🔍
                            </InputGroup.Text>
                            <Form.Control
                                className="border-start-0 ps-0"
                                placeholder="Buscar por ID, nombre de cliente o dirección..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="d-flex align-items-center">
                        <Form.Label className="me-2 mb-0 text-nowrap">Ordenar por:</Form.Label>
                        <Form.Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Más recientes primero</option>
                            <option value="oldest">Más antiguos primero</option>
                            <option value="total-high">Monto más alto</option>
                            <option value="total-low">Monto más bajo</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>



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
