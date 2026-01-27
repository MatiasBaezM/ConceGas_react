import { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar, Table, Badge } from 'react-bootstrap';
import { orderService } from '../../core/services/orderService';
import { productService } from '../../core/services/productService';
import type { Order, Product } from '../../core/types';

function AdminReports() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        setOrders(orderService.getAll());
        setProducts(productService.getAll());
    }, []);

    // Cálculos dinámicos
    const today = new Date().toLocaleDateString();

    // Filtrar pedidos de hoy
    const todayOrders = orders.filter(o => new Date(o.date).toLocaleDateString() === today);

    // Sumatoria de ventas del día (solo entregados)
    const dailyRevenue = todayOrders
        .filter(o => o.status === 'entregados')
        .reduce((sum, o) => sum + o.total, 0);

    // Pedidos completados hoy
    const completedToday = todayOrders.filter(o => o.status === 'entregados').length;

    // Pedidos pendientes (total, no solo hoy)
    const pendingOrders = orders.filter(o =>
        o.status === 'pendiente' ||
        o.status === 'preparacion' ||
        o.status === 'enviados'
    ).length;

    // Stock crítico (stock < 10)
    const criticalStockCount = products.filter(p => p.stock !== undefined && p.stock < 10).length;

    // Ventas por zona (Top 5)
    const salesByZone = orders.reduce((acc: Record<string, number>, o) => {
        const zone = o.comuna || 'Sin Comuna';
        acc[zone] = (acc[zone] || 0) + 1;
        return acc;
    }, {});

    const sortedZones = Object.entries(salesByZone)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div className="fade-in">
            <h2 className="mb-4 text-dark">📊 Reportes y Estadísticas</h2>

            {/* KPIs Principales */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-white bg-primary mb-3 shadow-sm border-0">
                        <Card.Header className="bg-transparent border-0 opacity-75">Ventas del Día</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold">${dailyRevenue.toLocaleString('es-CL')}</Card.Title>
                            <Card.Text>
                                <small>Hoy: {today}</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-success mb-3 shadow-sm border-0">
                        <Card.Header className="bg-transparent border-0 opacity-75">Pedidos Completados</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold">{completedToday}</Card.Title>
                            <Card.Text>
                                <small>Total históricos: {orders.filter(o => o.status === 'entregados').length}</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-warning mb-3 shadow-sm border-0">
                        <Card.Header className="text-dark bg-transparent border-0 opacity-75">En Curso</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold text-dark">{pendingOrders}</Card.Title>
                            <Card.Text className="text-dark">
                                <small>Pendientes de entrega</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-danger mb-3 shadow-sm border-0">
                        <Card.Header className="bg-transparent border-0 opacity-75">Stock Crítico</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold">{criticalStockCount}</Card.Title>
                            <Card.Text>
                                <small>Productos con bajo stock</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Ventas por Formato de Cilindro (Simulado con lógica base) */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Header className="bg-white fw-bold border-0">🔥 Distribución de Ventas</Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Gas 15kg</span>
                                    <span className="fw-bold">45%</span>
                                </div>
                                <ProgressBar variant="primary" now={45} />
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Gas 11kg</span>
                                    <span className="fw-bold">30%</span>
                                </div>
                                <ProgressBar variant="info" now={30} />
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Gas 45kg</span>
                                    <span className="fw-bold">15%</span>
                                </div>
                                <ProgressBar variant="warning" now={15} />
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Gas 5kg</span>
                                    <span className="fw-bold">10%</span>
                                </div>
                                <ProgressBar variant="success" now={10} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Zonas de Mayor Demanda */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Header className="bg-white fw-bold border-0">📍 Zonas de Mayor Demanda (Histórico)</Card.Header>
                        <Card.Body>
                            <Table hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Provincia/Comuna</th>
                                        <th>Pedidos</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedZones.map(([zone, count]) => (
                                        <tr key={zone}>
                                            <td>{zone}</td>
                                            <td>{count}</td>
                                            <td><Badge bg="success">Activo</Badge></td>
                                        </tr>
                                    ))}
                                    {sortedZones.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center">No hay datos suficientes</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Stock actual Real */}
                <Col md={12}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white fw-bold border-0">📦 Estado de Inventario (Real)</Card.Header>
                        <Card.Body>
                            <Row className="text-center">
                                {products.slice(0, 4).map(p => (
                                    <Col key={p.id} className="border-start">
                                        <h5 className="text-secondary small">{p.name}</h5>
                                        <h3 className={`fw-bold ${p.stock && p.stock < 10 ? 'text-danger' : 'text-dark'}`}>
                                            {p.stock ?? 0}
                                        </h3>
                                        <Badge bg={p.stock && p.stock < 10 ? 'danger' : 'success'}>
                                            {p.stock && p.stock < 10 ? 'Crítico' : 'OK'}
                                        </Badge>
                                    </Col>
                                ))}
                                {products.length === 0 && <Col>No hay productos registrados</Col>}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdminReports;


