import { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Button, Modal, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../core/hooks/useAuth';
import { orderService } from '../../core/services/orderService';
import type { Order } from '../../core/types';

function CustomerOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [showTracking, setShowTracking] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (user) {
            // Cargar pedidos del usuario logueado
            const userOrders = orderService.getByRut(user.rut);
            // Ordenar por fecha descendente
            userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(userOrders);
        }
    }, [user]);

    const handleTrack = (order: Order) => {
        setSelectedOrder(order);
        setShowTracking(true);
    };

    const getStatusPercent = (status: Order['status']) => {
        switch (status) {
            case 'pendiente': return 25;
            case 'preparacion': return 50;
            case 'enviados': return 75;
            case 'entregados': return 100;
            case 'sin entrega': return 100;
            default: return 0;
        }
    };

    const getStatusLabel = (status: Order['status']) => {
        switch (status) {
            case 'pendiente': return 'Pedido Recibido';
            case 'preparacion': return 'En Preparación';
            case 'enviados': return 'En Camino a tu Hogar';
            case 'entregados': return '¡Entregado!';
            case 'sin entrega': return 'Entrega Fallida';
            default: return 'Procesando';
        }
    };

    if (orders.length === 0) {
        return (
            <Container className="my-5 text-center">
                <Card className="p-5 shadow-sm border-0">
                    <div className="display-1 mb-3">📦</div>
                    <h3>Aún no tienes pedidos</h3>
                    <p className="text-muted">¡Realiza tu primera compra de gas y aparecerá aquí!</p>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-dark">Mis Pedidos</h2>
            <Row>
                {orders.map(order => (
                    <Col md={12} key={order.id} className="mb-3">
                        <Card className="shadow-sm border-0 overflow-hidden">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <div className="text-muted small">ID Pedido</div>
                                        <div className="fw-bold">#{order.id}</div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="text-muted small">Fecha</div>
                                        <div>{new Date(order.date).toLocaleDateString()}</div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="text-muted small">Total</div>
                                        <div className="text-primary fw-bold">${order.total.toLocaleString('es-CL')}</div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="text-muted small">Estado</div>
                                        <Badge bg={
                                            order.status === 'pendiente' ? 'warning' :
                                                order.status === 'preparacion' ? 'info' :
                                                    order.status === 'enviados' ? 'primary' :
                                                        order.status === 'sin entrega' ? 'danger' : 'success'
                                        } text={order.status === 'pendiente' || order.status === 'preparacion' ? 'dark' : 'white'}>
                                            {order.status.toUpperCase()}
                                        </Badge>
                                    </Col>
                                    <Col md={3} className="text-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="btn-premium"
                                            onClick={() => handleTrack(order)}
                                        >
                                            Rastrear Pedido
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* MODAL DE SEGUIMIENTO */}
            <Modal show={showTracking} onHide={() => setShowTracking(false)} centered size="lg" className="modal-premium">
                <Modal.Header closeButton className="modal-premium-header">
                    <Modal.Title className="modal-premium-title">Seguimiento de Pedido #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedOrder && (
                        <div className="text-center">
                            <h4 className="mb-4">{getStatusLabel(selectedOrder.status)}</h4>

                            <div className="position-relative mb-5" style={{ height: '10px' }}>
                                <ProgressBar
                                    now={getStatusPercent(selectedOrder.status)}
                                    variant={selectedOrder.status === 'sin entrega' ? 'danger' : 'success'}
                                    animated={selectedOrder.status !== 'entregados' && selectedOrder.status !== 'sin entrega'}
                                    style={{ height: '10px' }}
                                />
                                <div className="d-flex justify-content-between position-absolute w-100" style={{ top: '-15px' }}>
                                    <div className="text-center" style={{ width: '25%' }}>
                                        <div className={`rounded-circle bg-${getStatusPercent(selectedOrder.status) >= 25 ? 'success' : 'light'} border mx-auto mb-1`} style={{ width: '30px', height: '30px', lineHeight: '30px', color: 'white' }}>
                                            {getStatusPercent(selectedOrder.status) >= 25 ? '✓' : '1'}
                                        </div>
                                        <small className="d-none d-md-block">Recibido</small>
                                    </div>
                                    <div className="text-center" style={{ width: '25%' }}>
                                        <div className={`rounded-circle bg-${getStatusPercent(selectedOrder.status) >= 50 ? 'success' : 'light'} border mx-auto mb-1`} style={{ width: '30px', height: '30px', lineHeight: '30px', color: 'white' }}>
                                            {getStatusPercent(selectedOrder.status) >= 50 ? '✓' : '2'}
                                        </div>
                                        <small className="d-none d-md-block">Preparación</small>
                                    </div>
                                    <div className="text-center" style={{ width: '25%' }}>
                                        <div className={`rounded-circle bg-${getStatusPercent(selectedOrder.status) >= 75 ? 'success' : 'light'} border mx-auto mb-1`} style={{ width: '30px', height: '30px', lineHeight: '30px', color: 'white' }}>
                                            {getStatusPercent(selectedOrder.status) >= 75 ? '✓' : '3'}
                                        </div>
                                        <small className="d-none d-md-block">En Camino</small>
                                    </div>
                                    <div className="text-center" style={{ width: '25%' }}>
                                        <div className={`rounded-circle bg-${selectedOrder.status === 'sin entrega' ? 'danger' : (getStatusPercent(selectedOrder.status) === 100 ? 'success' : 'light')} border mx-auto mb-1`} style={{ width: '30px', height: '30px', lineHeight: '30px', color: 'white' }}>
                                            {getStatusPercent(selectedOrder.status) === 100 ? (selectedOrder.status === 'sin entrega' ? '✕' : '✓') : '4'}
                                        </div>
                                        <small className="d-none d-md-block">{selectedOrder.status === 'sin entrega' ? 'Falla' : 'Entregado'}</small>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <Row className="text-start mt-4">
                                <Col md={6}>
                                    <h6 className="fw-bold">Detalle de Entrega</h6>
                                    <p className="mb-1"><strong>Repartidor:</strong> {selectedOrder.assignedTo || 'Buscando repartidor...'}</p>
                                    <p className="mb-1"><strong>Dirección:</strong> {selectedOrder.address}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 className="fw-bold">Productos</h6>
                                    <ul className="list-unstyled">
                                        {selectedOrder.items.map((item, idx) => (
                                            <li key={idx} className="small">
                                                {item.qty}x {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>

                            {selectedOrder.failReason && (
                                <div className="mt-3 p-3 bg-danger bg-opacity-10 border border-danger rounded text-danger text-start">
                                    <strong>Nota de Entrega:</strong> {selectedOrder.failReason}
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTracking(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default CustomerOrders;
