import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './components/layout/Navbar';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import ProductCard from './components/shop/ProductCard';
import Footer from './components/layout/Footer';
import Cart from './components/shop/Cart';
import AdminPanel from './components/admin/AdminPanel';
import products from '../public/data/productos.json';
import { useAuth } from './context/AuthContext';

import RecoverPasswordModal from './components/auth/RecoverPasswordModal';

function App() {
  // Estados para controlar qué modales o vistas se muestran
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRecover, setShowRecover] = useState(false);
  const [showCart, setShowCart] = useState(false); // Estado para alternar entre tienda y carrito

  // Obtenemos si es admin desde el Contexto de Autenticación
  const { isAdmin } = useAuth();

  // Si es admin, mostramos el panel directamente (renderizado condicional)
  if (isAdmin) {
    return (
      <>
        {/* Navbar de Admin: al hacer click en home cierra el carrito (aunque aquí no hay carrito visible) */}
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          onCartClick={() => setShowCart(!showCart)}
          onHomeClick={() => setShowCart(false)}
        />
        {/* Renderizamos el panel de admin en lugar de la tienda */}
        <AdminPanel />
      </>
    );
  }

  // Si NO es admin (cliente o visita), mostramos la tienda normal
  return (
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onCartClick={() => setShowCart(!showCart)}
        onHomeClick={() => setShowCart(false)}
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

      {/* Renderizado de contenido principal: ¿Mostrar carrito o lista de productos? */}
      {!showCart ? (
        <>
          <div className="text-center">
            <img src="/img/banner.png" className="img-fluid w-100" alt="Banner ConceGas" />
          </div>

          <Container className="mt-4">
            <Row>
              {/* Mapeamos la lista de productos del JSON para crear tarjetas */}
              {products.map((product) => (
                <Col sm={4} key={product.id} className="mb-4">
                  <ProductCard {...product} />
                </Col>
              ))}
            </Row>
          </Container>
        </>
      ) : (
        // Si showCart es true, mostramos el componente del Carrito
        <Cart />
      )}

      {/* Footer solo visible para clientes */}
      <Footer />
    </>
  )
}

export default App
