import { useState } from 'react';
import { Modal, Button, Space, message, Input, InputNumber, Checkbox, Select } from 'antd';
import { EditOutlined, DeleteOutlined, InboxOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { ValueCards } from '../types/ValueCards';
import '../style/ProductModal.css';

interface ProductModalProps {
  product: ValueCards | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: ValueCards) => void;
  onDelete: (productId: number) => void;
  onArchive: (productId: number) => void;
  onSave?: (product: ValueCards) => void;
}

export const ProductModal = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onArchive,
  onSave,
}: ProductModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ValueCards | null>(null);

  if (!product) return null;

  const currentData = isEditing && formData ? formData : product;

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({ ...product });
  };

  const handleSave = () => {
    if (formData) {
      if (onSave) {
        onSave(formData);
      } else {
        onEdit(formData);
      }
      message.success('Товар сохранен');
      setIsEditing(false);
      setFormData(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
  };

  const handleFieldChange = (field: keyof ValueCards, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
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
      title={`Товар: ${currentData.title}`}
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={
        isEditing
          ? [
              <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
                Отменить
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleSave}
                icon={<SaveOutlined />}
              >
                Сохранить
              </Button>,
            ]
          : [
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
                  onClick={handleEditClick}
                >
                  Редактировать
                </Button>
              </Space>,
            ]
      }
      className="product-modal"
    >
      {isEditing ? (
        <div className="product-edit-form">
          <div className="form-group">
            <label>Название товара</label>
            <Input
              value={formData?.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Название товара"
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <Input.TextArea
              rows={4}
              value={formData?.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Описание товара"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Артикул</label>
              <Input
                value={formData?.sku}
                onChange={(e) => handleFieldChange('sku', e.target.value)}
                placeholder="Артикул"
              />
            </div>
            <div className="form-group">
              <label>Категория</label>
              <Select
                value={formData?.category}
                onChange={(value) => handleFieldChange('category', value)}
                options={[
                  { label: 'Косметика', value: 'cosmetics' },
                  { label: 'Сладости', value: 'candy' },
                  { label: 'Игрушки', value: 'toys' },
                  { label: 'Парфюм', value: 'parfume' },
                  { label: 'Одежда', value: 'cloth' },
                  { label: 'Украшение', value: 'decoration' },
                ]}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Закупочная цена (₽)</label>
              <InputNumber
                value={formData?.purchasePrice}
                onChange={(value) => handleFieldChange('purchasePrice', value)}
                min={0}
              />
            </div>
            <div className="form-group">
              <label>Розничная цена (₽)</label>
              <InputNumber
                value={formData?.retailPrice}
                onChange={(value) => handleFieldChange('retailPrice', value)}
                min={0}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Маржинальность (%)</label>
              <InputNumber
                value={formData?.margin}
                onChange={(value) => handleFieldChange('margin', value)}
                min={0}
                max={100}
              />
            </div>
            <div className="form-group">
              <label>Остаток на складе (шт)</label>
              <InputNumber
                value={formData?.count}
                onChange={(value) => handleFieldChange('count', value)}
                min={0}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Checkbox
                checked={formData?.isActive}
                onChange={(e) => handleFieldChange('isActive', e.target.checked)}
              >
                Активен
              </Checkbox>
            </div>
            <div className="form-group">
              <Checkbox
                checked={formData?.isArchived}
                onChange={(e) => handleFieldChange('isArchived', e.target.checked)}
              >
                Архивирован
              </Checkbox>
            </div>
          </div>
        </div>
      ) : (
        <div className="product-details">
          <div className="product-left">
            <div className="product-image-container">
              {currentData.image ? (
                <img src={currentData.image} alt={currentData.title} />
              ) : (
                <div className="image-placeholder">📦</div>
              )}
              <div className="stock-badge">{currentData.count} шт</div>
              <div className="price-badge">{currentData.purchasePrice} ₽</div>
            </div>
            <div className="product-base-info">
              <h3>{currentData.title}</h3>
              <p className="sku">Артикул: {currentData.sku}</p>
            </div>
          </div>

          <div className="product-right">
            <div className="info-group">
              <label>Название товара</label>
              <p>{currentData.title}</p>
            </div>

            <div className="info-group">
              <label>Описание</label>
              <p>{currentData.description}</p>
            </div>

            <div className="info-row">
              <div className="info-group">
                <label>Закупочная цена</label>
                <p className="price-purchase">{currentData.purchasePrice} ₽</p>
              </div>
              <div className="info-group">
                <label>Розничная цена</label>
                <p className="price-retail">{currentData.retailPrice} ₽</p>
              </div>
            </div>

            <div className="info-row">
              <div className="info-group">
                <label>Маржинальность</label>
                <p>{currentData.margin}%</p>
              </div>
              <div className="info-group">
                <label>Остаток на складе</label>
                <p>{currentData.count} шт</p>
              </div>
            </div>

            <div className="info-group">
              <label>Статус</label>
              <p>
                <span
                  className={`status ${
                    currentData.isActive ? 'active' : 'inactive'
                  }`}
                >
                  {currentData.isActive ? '✓ Активен' : '✗ Неактивен'}
                </span>
              </p>
            </div>

            <div className="info-row">
              <div className="info-group">
                <label>Создано</label>
                <p>{new Date(currentData.createdAt).toLocaleString('ru-RU')}</p>
              </div>
              <div className="info-group">
                <label>Изменено</label>
                <p>
                  {new Date(currentData.updatedAt).toLocaleString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
