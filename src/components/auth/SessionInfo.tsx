import { useAuth } from '../../core/hooks/useAuth';
import { decodeToken } from '../../core/utils/authUtils';
import { Card, Table, Badge } from 'react-bootstrap';

export default function SessionInfo() {
    const { user } = useAuth();

    if (!user || !user.token) {
        return <p className="text-muted">No hay una sesión activa con token.</p>;
    }

    const decoded = decodeToken(user.token);

    return (
        <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Información de Sesión (JWT)</h5>
            </Card.Header>
            <Card.Body>
                <h6>Token Crudo:</h6>
                <div className="bg-light p-2 rounded mb-3 text-break small" style={{ maxHeight: '100px', overflowY: 'auto', border: '1px solid #ddd' }}>
                    <code>{user.token}</code>
                </div>

                <h6>Payload Decodificado:</h6>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Campo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>RUT</strong></td>
                            <td>{decoded?.rut}</td>
                        </tr>
                        <tr>
                            <td><strong>Email</strong></td>
                            <td>{decoded?.email}</td>
                        </tr>
                        <tr>
                            <td><strong>Rol</strong></td>
                            <td><Badge bg={decoded?.role === 'admin' ? 'danger' : 'info'}>{decoded?.role}</Badge></td>
                        </tr>
                        <tr>
                            <td><strong>Expira</strong></td>
                            <td>{decoded?.exp ? new Date(decoded.exp * 1000).toLocaleString() : 'N/A'}</td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}
