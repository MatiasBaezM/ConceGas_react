import { useState } from 'react';
import { Container, Table, Button, Badge, Modal, Form, Card, Nav } from 'react-bootstrap';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
import type { Order } from '../types';

// Mock initial orders (simulating what comes from DB)
// Adjusted to match Order interface
const initialOrders: Order[] = [
    {
        id: '#1000',
        date: new Date().toISOString(),
        customerRut: '11.111.111-1',
        customerName: 'Maria Garcia',
        address: 'Calle Falsa 123',
        status: 'preparacion',
        assignedTo: 'Pedro Repartidor',
        items: [{ id: 'gas45', name: 'Gas Licuado 45kg', qty: 1, price: 50200 }],
        total: 50200,
        paymentMethod: 'efectivo'
    },
    {
        id: '#0999',
        date: new Date().toISOString(),
        customerRut: '22.222.222-2',
        customerName: 'Carlos Lopez',
        address: 'Psje. 1',
        status: 'enviados',
        assignedTo: 'Pedro Repartidor',
        items: [{ id: 'gas5', name: 'Gas Licuado 5kg', qty: 1, price: 15000 }],
        total: 15000,
        paymentMethod: 'transferencia'
    }
];

export default function RepartidorPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>(() => {
        const stored = localStorage.getItem('repartidor_orders');
        return stored ? JSON.parse(stored) : initialOrders;
    });
    const [showFailModal, setShowFailModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [reason, setReason] = useState('');
    const [activeTab, setActiveTab] = useState('recibidos');

    const updateOrderStatus = (orderId: string, newStatus: Order['status'], failReason?: string) => {
        const updatedOrders = orders.map(o => {
            if (o.id === orderId) {
                return { ...o, status: newStatus, failReason: failReason || undefined };
            }
            return o;
        });
        setOrders(updatedOrders);
        localStorage.setItem('repartidor_orders', JSON.stringify(updatedOrders));
    };

    const handleDeliverySuccess = (order: Order) => {
        updateOrderStatus(order.id, 'entregados');
    };

    const handleDeliveryFailClick = (order: Order) => {
        setSelectedOrder(order);
        setReason('');
        setShowFailModal(true);
    };

    const confirmDeliveryFail = () => {
        if (!selectedOrder) return;
        updateOrderStatus(selectedOrder.id, 'sin entrega', reason);
        setShowFailModal(false);
    };

    const handleShowDetail = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    // Filter orders assigned to current user first
    const myOrders = orders.filter(o => o.assignedTo === user?.name);

    // Apply Tab Filter
    const filteredOrders = myOrders.filter(o => {
        if (activeTab === 'recibidos') return o.status === 'preparacion';
        if (activeTab === 'aceptados') return o.status === 'enviados';
        if (activeTab === 'finalizados') return o.status === 'entregados' || o.status === 'sin entrega';
        return false;
    });

    const renderTable = () => (
        <div className="table-responsive d-none d-md-block">
            <Table hover className="align-middle bg-white">
                <thead className="table-light">
                    <tr>
                        <th>ID Pedido</th>
                        <th>Cliente</th>
                        <th>Dirección</th>
                        <th>Estado Actual</th>
                        {activeTab === 'finalizados' && <th>Motivo</th>}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>{order.address}</td>
                            <td>
                                <Badge bg={
                                    order.status === 'preparacion' ? 'warning' :
                                        order.status === 'enviados' ? 'primary' :
                                            order.status === 'entregados' ? 'success' :
                                                order.status === 'sin entrega' ? 'danger' : 'secondary'
                                }>
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
                            <td>
                                <div className="d-flex gap-2">
                                    <Button size="sm" variant="info" className="text-white" onClick={() => handleShowDetail(order)}>
                                        👁️ Ver Detalles
                                    </Button>

                                    {order.status !== 'entregados' && order.status !== 'sin entrega' && (
                                        <>
                                            {order.status === 'preparacion' && (
                                                <Button size="sm" variant="success" onClick={() => updateOrderStatus(order.id, 'enviados')}>
                                                    🚚 En Camino
                                                </Button>
                                            )}
                                            {order.status === 'enviados' && (
                                                <>
                                                    <Button size="sm" variant="success" onClick={() => handleDeliverySuccess(order)}>
                                                        ✅ Entregado
                                                    </Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDeliveryFailClick(order)}>
                                                        ❌ No Entregado
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan={activeTab === 'finalizados' ? 6 : 5} className="text-center py-4">
                                No hay pedidos en esta categoría.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );

    const renderMobileCards = () => (
        <div className="d-md-none">
            {filteredOrders.map(order => (
                <Card key={order.id} className="mb-3 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                        <span className="fw-bold">{order.id}</span>
                        <Badge bg={
                            order.status === 'preparacion' ? 'warning' :
                                order.status === 'enviados' ? 'primary' :
                                    order.status === 'entregados' ? 'success' :
                                        order.status === 'sin entrega' ? 'danger' : 'secondary'
                        }>
                            {order.status.toUpperCase()}
                        </Badge>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title className="fs-5 mb-1">{order.customerName}</Card.Title>
                        <Card.Text className="text-muted mb-3">
                            📍 {order.address}
                        </Card.Text>

                        {order.status === 'sin entrega' && (
                            <div className="alert alert-danger p-2 mb-3">
                                <small><strong>Motivo:</strong> {order.failReason}</small>
                            </div>
                        )}

                        <div className="d-grid gap-2">
                            <Button variant="outline-info" size="sm" onClick={() => handleShowDetail(order)}>
                                👁️ Ver Detalles
                            </Button>

                            {order.status !== 'entregados' && order.status !== 'sin entrega' && (
                                <div className="d-grid gap-2 mt-2">
                                    {order.status === 'preparacion' && (
                                        <Button variant="success" size="lg" onClick={() => updateOrderStatus(order.id, 'enviados')}>
                                            🚚 INICIAR RUTA
                                        </Button>
                                    )}
                                    {order.status === 'enviados' && (
                                        <div className="d-flex gap-2">
                                            <Button variant="success" className="w-100 py-2" onClick={() => handleDeliverySuccess(order)}>
                                                ✅ ENTREGADO
                                            </Button>
                                            <Button variant="danger" className="w-100 py-2" onClick={() => handleDeliveryFailClick(order)}>
                                                ❌ FALLIDO
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            ))}
            {filteredOrders.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <p>No tienes pedidos en esta pestaña.</p>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Navbar
                onLoginClick={() => { }}
                onRegisterClick={() => { }}
                onCartClick={() => { }}
                onHomeClick={() => { }}
            />
            <Container className="my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>📦 Panel de Repartidor</h2>

                </div>

                <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'recibidos')} className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="recibidos">Recibidos</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="aceptados">En Ruta (Aceptados)</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="finalizados">Finalizados</Nav.Link>
                    </Nav.Item>
                </Nav>

                {renderTable()}
                {renderMobileCards()}

                {/* MODAL DETALLE PEDIDO */}
                <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} className="modal-premium" centered fullscreen="sm-down">
                    <Modal.Header closeButton className="modal-premium-header">
                        <Modal.Title className="modal-premium-title">Detalle Pedido {selectedOrder?.id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedOrder && (
                            <>
                                <p><strong>Cliente:</strong> {selectedOrder.customerName}</p>
                                <p><strong>Dirección:</strong> {selectedOrder.address}</p>
                                <hr />
                                <h6 className="fw-bold">Productos:</h6>
                                <ul className="list-group mb-3">
                                    {selectedOrder.items?.map((p, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                            {p.name}
                                            <Badge bg="primary" pill>x{p.qty}</Badge>
                                        </li>
                                    ))}
                                </ul>
                                {selectedOrder.failReason && (
                                    <div className="alert alert-danger">
                                        <strong>Motivo No Entrega:</strong> {selectedOrder.failReason}
                                    </div>
                                )}
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>

                {/* MODAL PARA MOTIVO DE NO ENTREGA */}
                <Modal show={showFailModal} onHide={() => setShowFailModal(false)} centered className="modal-premium">
                    <Modal.Header closeButton className="modal-premium-header">
                        <Modal.Title className="modal-premium-title">Reportar Problema</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <p className="mb-3">Por favor indique el motivo del problema con <strong>{selectedOrder?.id}</strong>:</p>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ej: Cliente no estaba, dirección errónea..."
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowFailModal(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={confirmDeliveryFail} disabled={!reason.trim()}>
                            Confirmar "Sin Entrega"
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </>
    );
}
