export const isValidChileanPhone = (phone: string): boolean => {
    // Eliminar espacios, guiones y el prefijo +56 si existe
    const cleanPhone = phone.replace(/[\s\-+]/g, '').replace(/^56/, '');

    // Verificar que sean exactamente 9 dígitos numéricos
    const regex = /^\d{9}$/;

    return regex.test(cleanPhone);
};

export const isValidRut = (rut: string): boolean => {
    if (!rut || rut.length < 8) return false;
    // Lógica simplificada para demo
    return /^[0-9]+-[0-9kK]{1}$/.test(rut);
};
