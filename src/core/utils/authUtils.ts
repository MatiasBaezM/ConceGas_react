import { jwtDecode } from 'jwt-decode';
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode('concegas_super_secret_key_12345');

interface TokenPayload {
    rut: string;
    email: string;
    role: string;
    exp: number;
}

/**
 * Genera un token JWT (Simulando lo que haría el backend)
 */
export const generateToken = async (payload: Omit<TokenPayload, 'exp'>) => {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(SECRET_KEY);
};

/**
 * Verifica si un token es válido (Simulando verificación en el frontend antes de peticiones)
 */
export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as unknown as TokenPayload;
    } catch (error) {
        console.error('Error verificando token:', error);
        return null;
    }
};

/**
 * Decodifica un token sin verificar la firma (Útil para leer datos rápidos)
 */
export const decodeToken = (token: string): TokenPayload | null => {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch (error) {
        console.error('Error decodificando token:', error);
        return null;
    }
};

/**
 * Comprueba si el token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};
