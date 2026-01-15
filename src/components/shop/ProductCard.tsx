import { Card, Button } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

function ProductCard({ id, name, price, description, image }: ProductCardProps) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    // Función para formatear precio a peso chileno
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };

    const handleAdd = () => {
        addToCart({ id, name, price, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    return (
        <Card className="m-1 shadow h-100">
            <Card.Img variant="top" src={image} alt={name} />
            <Card.Body>
                <Card.Title as="h4">{name}</Card.Title>
                <Card.Title as="h5">{formatPrice(price)}</Card.Title>
                <Card.Text>
                    {description}
                </Card.Text>
                <Button
                    variant={added ? "success" : "primary"}
                    className="btn-agregar"
                    onClick={handleAdd}
                >
                    {added ? "Agregado ✅" : "Agregar"}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;
