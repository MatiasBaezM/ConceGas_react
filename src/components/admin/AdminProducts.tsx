import { useState, useRef, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { formatPrice } from '../../utils/formatters';
import { productService } from '../../services/productService';
import type { Product } from '../../types';

function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Edit state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Delete state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        image: ''
    });

    // File handling
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        setProducts(productService.getAll());
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Convert to Base64 for storage
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectImageClick = () => {
        fileInputRef.current?.click();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: 0,
            description: '',
            stock: 0,
            image: ''
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingProduct(null);
    };

    const handleCreateClick = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock || 0, // Ensure type has stock if added, otherwise handle optional
            image: product.image
        });
        setPreviewUrl(product.image || null);
        setShowEditModal(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeletingProductId(id);
        setShowDeleteModal(true);
    };

    const handleCreateSubmit = () => {
        try {
            const newProduct: Product = {
                id: `prod-${Date.now()}`,
                name: formData.name || 'Nuevo Producto',
                price: Number(formData.price) || 0,
                description: formData.description || '',
                image: formData.image || '/img/productos/cilindro_15kg.png', // Default image
                stock: Number(formData.stock) || 0
            };

            productService.create(newProduct);
            loadProducts();
            setShowCreateModal(false);
            resetForm();
            alert('Producto creado correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al crear producto');
        }
    };

    const handleEditSubmit = () => {
        if (!editingProduct) return;

        try {
            productService.update(editingProduct.id, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock) || 0
            });
            loadProducts();
            setShowEditModal(false);
            resetForm();
            alert('Producto actualizado correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar producto');
        }
    };

    const handleDeleteConfirm = () => {
        if (deletingProductId) {
            productService.delete(deletingProductId);
            loadProducts();
            setShowDeleteModal(false);
            setDeletingProductId(null);
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-dark">Gestión de Productos</h2>

            <div className="table-responsive">
                <Table hover className="align-middle bg-white">
                    <thead className="table-light">
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((prod) => (
                            <tr key={prod.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {prod.image && <img src={prod.image} alt={prod.name} width="40" className="me-2 rounded" />}
                                        {prod.name}
                                    </div>
                                </td>
                                <td>{formatPrice(prod.price)}</td>
                                <td><small className="text-muted">{prod.description}</small></td>
                                <td><Badge bg={prod.stock && prod.stock > 5 ? "success" : "warning"}>Stock: {prod.stock || 0}</Badge></td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(prod)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(prod.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Button variant="primary" onClick={handleCreateClick}>
                Agregar producto
            </Button>

            {/* MODAL AGREGAR PRODUCTO */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} className="modal-premium" autoFocus={false}>
                <Modal.Header closeButton className="modal-premium-header">
                    <Modal.Title className="modal-premium-title">Agrega Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nombre del producto"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio ($)</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                placeholder="20000"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                placeholder="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descripción corta"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen del producto</Form.Label>

                            <input
                                type="file"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/webp"
                            />

                            <Button
                                variant="outline-primary"
                                className="w-100 mb-2"
                                onClick={handleSelectImageClick}
                            >
                                {selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                            </Button>

                            {previewUrl && (
                                <div className="text-center mt-2">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="img-fluid rounded border"
                                        style={{ maxHeight: '150px' }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={handleCreateSubmit} className="btn-premium">Crear</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL EDITAR PRODUCTO */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered className="modal-premium" autoFocus={false}>
                <Modal.Header closeButton className="modal-premium-header">
                    <Modal.Title className="modal-premium-title">✏️ Editar producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={7}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3">
                                <Form.Label>Imagen del producto</Form.Label>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <Button variant="outline-primary" className="w-100 mb-2" onClick={handleSelectImageClick}>
                                    Cambiar imagen
                                </Button>
                                <div className="text-center">
                                    {previewUrl && (
                                        <img src={previewUrl} className="img-fluid rounded border" style={{ maxHeight: '220px' }} alt="Preview" />
                                    )}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={handleEditSubmit} className="btn-premium">Guardar cambios</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL ELIMINAR PRODUCTO */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">❌ Eliminar producto</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>¿Estás seguro que deseas eliminar el producto?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminProducts;
