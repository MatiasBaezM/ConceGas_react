import { useState } from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminProfiles from './AdminProfiles';
import AdminReports from './AdminReports';

function AdminPanel() {
    const [currentView, setCurrentView] = useState('pedidos');

    const renderContent = () => {
        switch (currentView) {
            case 'pedidos':
                return <AdminOrders />;
            case 'productos':
                return <AdminProducts />;
            case 'perfiles':
                return <AdminProfiles />;
            case 'reportes':
                return <AdminReports />;
            default:
                return <AdminOrders />;
        }
    };

    return (
        <Container fluid className="my-4">
            <Row>
                <Col md={2} className="bg-dark text-white p-3 rounded mb-3 mb-md-0 d-flex flex-column" style={{ minHeight: '80vh' }}>
                    <h4 className="text-white mb-4">Panel Admin</h4>
                    <Nav className="flex-column flex-grow-1" activeKey={currentView} onSelect={(k) => setCurrentView(k || 'pedidos')}>
                        <Nav.Item>
                            <Nav.Link eventKey="pedidos" className={currentView === 'pedidos' ? 'text-white fw-bold bg-secondary rounded' : 'text-white'}>
                                Pedidos
                            </Nav.Link>
                        </Nav.Item>
                        <hr className="text-white my-2" />
                        <Nav.Item>
                            <Nav.Link eventKey="productos" className={currentView === 'productos' ? 'text-white fw-bold bg-secondary rounded' : 'text-white-50'}>
                                Gestión Productos
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="perfiles" className={currentView === 'perfiles' ? 'text-white fw-bold bg-secondary rounded' : 'text-white-50'}>
                                Gestión Perfiles
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="reportes" className={currentView === 'reportes' ? 'text-white fw-bold bg-secondary rounded' : 'text-white-50'}>
                                Reportes
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="mt-auto pt-3 border-top border-secondary">
                        <small className="text-white-50">ConceGas Admin v1.0</small>
                    </div>
                </Col>

                <Col md={10}>
                    {renderContent()}
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPanel;
