import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../components/layout/Navbar';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import ProductCard from '../components/shop/ProductCard';
import Footer from '../components/layout/Footer';
import Cart from '../components/shop/Cart';
import CustomerOrders from '../components/shop/CustomerOrders';
import RecoverPasswordModal from '../components/auth/RecoverPasswordModal';
import { productService } from '../services/productService';
import type { Product } from '../types';

export default function HomePage() {
    // Estados para controlar qué modales o vistas se muestran
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showRecover, setShowRecover] = useState(false);
    const [currentView, setCurrentView] = useState<'home' | 'cart' | 'orders'>('home');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        setProducts(productService.getAll());
    }, []);

    return (
        <>
            <Navbar
                onLoginClick={() => setShowLogin(true)}
                onRegisterClick={() => setShowRegister(true)}
                onCartClick={() => setCurrentView('cart')}
                onHomeClick={() => setCurrentView('home')}
                onOrdersClick={() => setCurrentView('orders')}
            />

            {/* Modales de Autenticación */}
            <LoginModal
                show={showLogin}
                handleClose={() => setShowLogin(false)}
                onRecoverClick={() => { setShowLogin(false); setShowRecover(true); }} // Cierra login y abre recuperar
                onRegisterClick={() => { setShowLogin(false); setShowRegister(true); }} // Cierra login y abre registro
            />
            <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} />
            <RecoverPasswordModal show={showRecover} handleClose={() => setShowRecover(false)} />

            {/* Renderizado de contenido principal basado en la vista actual */}
            {currentView === 'home' && (
                <>
                    <div className="text-center">
                        <img src="/img/banner.png" className="img-fluid w-100" alt="Banner ConceGas" />
                    </div>

                    <Container className="mt-4">
                        <Row>
                            {/* Mapeamos la lista de productos obtenida del servicio */}
                            {products.map((product) => (
                                <Col sm={4} key={product.id} className="mb-4">
                                    <ProductCard {...product} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </>
            )}

            {currentView === 'cart' && (
                <Cart
                    onContinueShopping={() => setCurrentView('home')}
                    onViewOrders={() => setCurrentView('orders')}
                />
            )}
            {currentView === 'orders' && <CustomerOrders />}

            {/* Footer solo visible para clientes */}
            <Footer />
        </>
    )
}
