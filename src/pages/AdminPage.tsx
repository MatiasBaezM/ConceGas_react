import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import AdminPanel from '../components/admin/AdminPanel';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import RecoverPasswordModal from '../components/auth/RecoverPasswordModal';
import ChangePasswordModal from '../components/auth/ChangePasswordModal';

export default function AdminPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showRecover, setShowRecover] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // We don't really show the cart in admin
    // But we reuse the navbar which expects these props.
    // In a real app we might have a different Navbar or conditional props.

    return (
        <>
            <Navbar
                onLoginClick={() => setShowLogin(true)}
                onRegisterClick={() => setShowRegister(true)}
                onCartClick={() => { }}
                onHomeClick={() => { }}
                onChangePasswordClick={() => setShowChangePassword(true)}
            />

            {/* Modals are available if admin wants to test login functionality or logout */}
            <LoginModal
                show={showLogin}
                handleClose={() => setShowLogin(false)}
                onRecoverClick={() => { setShowLogin(false); setShowRecover(true); }}
                onRegisterClick={() => { setShowLogin(false); setShowRegister(true); }}
            />
            <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} />
            <RecoverPasswordModal show={showRecover} handleClose={() => setShowRecover(false)} />
            <ChangePasswordModal show={showChangePassword} handleClose={() => setShowChangePassword(false)} />

            <AdminPanel />
        </>
    );
}
