import { Modal, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import type { ValueCards } from '../types/ValueCards';
import '../style/ProductModal.css';

interface ProductModalProps {
  product: ValueCards | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: ValueCards) => void;
  onDelete: (productId: number) => void;
  onArchive: (productId: number) => void;
}

export const ProductModal = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onArchive,
}: ProductModalProps) => {
  if (!product) return null;

  const handleEdit = () => {
    onEdit(product);
    onClose();
  };

  const handleDelete = () => {
    onDelete(product.id);
    onClose();
    message.success('Товар удален');
  };

  const handleArchive = () => {
    onArchive(product.id);
    onClose();
    message.success('Товар архивирован');
  };

  return (
    <Modal
      title={`Товар: ${product.title}`}
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>,
        <Space key="actions">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Удалить
          </Button>
          <Button
            type="default"
            icon={<InboxOutlined />}
            onClick={handleArchive}
          >
            Архивировать
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Редактировать
          </Button>
        </Space>,
      ]}
      className="product-modal"
    >
      <div className="product-details">
        <div className="product-left">
          <div className="product-image-container">
            {product.image ? (
              <img src={product.image} alt={product.title} />
            ) : (
              <div className="image-placeholder">📦</div>
            )}
            <div className="stock-badge">{product.count} шт</div>
            <div className="price-badge">{product.purchasePrice} ₽</div>
          </div>
          <div className="product-base-info">
            <h3>{product.title}</h3>
            <p className="sku">Артикул: {product.sku}</p>
          </div>
        </div>

        <div className="product-right">
          <div className="info-group">
            <label>Название товара</label>
            <p>{product.title}</p>
          </div>

          <div className="info-group">
            <label>Описание</label>
            <p>{product.description}</p>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>Закупочная цена</label>
              <p className="price-purchase">{product.purchasePrice} ₽</p>
            </div>
            <div className="info-group">
              <label>Розничная цена</label>
              <p className="price-retail">{product.retailPrice} ₽</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>Маржинальность</label>
              <p>{product.margin}%</p>
            </div>
            <div className="info-group">
              <label>Остаток на складе</label>
              <p>{product.count} шт</p>
            </div>
          </div>

          <div className="info-group">
            <label>Статус</label>
            <p>
              <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                {product.isActive ? '✓ Активен' : '✗ Неактивен'}
              </span>
            </p>
          </div>

          <div className="info-row">
            <div className="info-group">
              <label>Создано</label>
              <p>{new Date(product.createdAt).toLocaleString('ru-RU')}</p>
            </div>
            <div className="info-group">
              <label>Изменено</label>
              <p>{new Date(product.updatedAt).toLocaleString('ru-RU')}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
