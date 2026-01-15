import { useState } from 'react';
import { Container, Table, Button, Card, Row, Col, Form, Alert, Modal } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };

    if (cart.length === 0) {
        return (
            <Container className="my-5 text-center">
                <h2 className="mb-4 text-dark">Tu Carrito</h2>
                <div className="alert alert-secondary">
                    Tu carrito está vacío.
                </div>
                <Button variant="secondary" href="/">Seguir comprando</Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-dark">Tu Carrito</h2>

            <div className="table-responsive">
                <Table hover className="align-middle">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th style={{ width: '150px' }}>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.image &&
                                        <img src={item.image} alt={item.name} width="50" style={{ marginRight: '10px' }} />
                                    }
                                    {item.name}
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, -1)}
                                        >
                                            -
                                        </Button>
                                        <span className="mx-2">{item.qty}</span>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </td>
                                <td>{formatPrice(item.price)}</td>
                                <td>{formatPrice(item.price * item.qty)}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={3} className="text-end">Total</th>
                            <th>{formatPrice(total)}</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </Table>
            </div>

            {/* BLOQUE DIRECCIÓN DE ENVÍO */}
            <Card className="shadow-sm my-4">
                <Card.Body>
                    <Card.Title className="mb-3 text-primary">Dirección de envío</Card.Title>
                    <Row className="g-2 align-items-end">
                        <Col className="mb-3">
                            <Form.Label>Enviar a:</Form.Label>
                            <Form.Select defaultValue="">
                                <option disabled value="">Seleccione una dirección</option>
                                <option value="1">Casa (Av. Ejemplo 1234)</option>
                            </Form.Select>
                        </Col>
                        <Col md={4} className="d-grid mb-3">
                            <Button variant="outline-primary" onClick={() => setShowAddressModal(true)}>
                                + Agregar nueva
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* BLOQUE MÉTODO DE PAGO */}
            <Card className="shadow-sm my-4">
                <Card.Body>
                    <Card.Title className="mb-3 text-primary">Método de pago</Card.Title>
                    <div className="mb-3">
                        <Form.Label>Pagar con:</Form.Label>
                        <Form.Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option disabled value="">Seleccione un método</option>
                            <option value="card">Tarjeta (crédito/débito)</option>
                            <option value="transfer">Transferencia</option>
                            <option value="cash">Efectivo (contra entrega)</option>
                        </Form.Select>
                    </div>

                    {paymentMethod === 'card' && (
                        <Alert variant="info">Demo: Se redirigirá a WebPay (simulado).</Alert>
                    )}
                    {paymentMethod === 'transfer' && (
                        <Alert variant="secondary">
                            <strong>Datos:</strong> Banco Estado, Cta 123456...
                        </Alert>
                    )}
                    {paymentMethod === 'cash' && (
                        <Form.Group className="mb-3">
                            <Form.Label>¿Con cuánto pagarás?</Form.Label>
                            <Form.Control type="number" placeholder="Ej: 20000" />
                        </Form.Group>
                    )}
                </Card.Body>
            </Card>

            <div className="d-flex gap-2">
                <Button variant="outline-danger" onClick={clearCart}>Vaciar carrito</Button>
                <Button variant="secondary" href="/">Seguir comprando</Button>
                <Button variant="success">Pedir</Button>
            </div>

            {/* MODAL PARA DIRECCIÓN */}
            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">Agregar dirección</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="addressForm">
                        <Form.Group className="mb-3" controlId="addrAlias">
                            <Form.Label>Alias (opcional)</Form.Label>
                            <Form.Control type="text" placeholder="Casa, Trabajo..." />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="addrStreet">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" required placeholder="Av. Siempre Viva 742" />
                        </Form.Group>

                        <Row className="g-2">
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3" controlId="addrComuna">
                                    <Form.Label>Comuna</Form.Label>
                                    <Form.Control type="text" required placeholder="Concepción" />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3" controlId="addrCiudad">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control type="text" required placeholder="Concepción" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="addrRef">
                            <Form.Label>Referencia (opcional)</Form.Label>
                            <Form.Control type="text" placeholder="Depto 12B, portón rojo..." />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowAddressModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={() => setShowAddressModal(false)}>Guardar</Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default Cart;
