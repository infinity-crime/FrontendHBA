import { Modal, Table, Tag, Empty } from 'antd';
import type { Order } from '../types/Order';
import '../style/SalesModal.css';

interface SalesModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SalesModal = ({ order, isOpen, onClose }: SalesModalProps) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'processing';
      case 'shipped':
        return 'orange';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидание';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменён';
      default:
        return status;
    }
  };

  const getCustomerTypeLabel = (type: string) => {
    return type === 'individual' ? 'Физическое лицо' : 'Юридическое лицо';
  };

  const columns = [
    {
      title: 'Товар',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string) => <span className="product-name">{text}</span>,
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Цена (шт.)',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => <span>{price} ₽</span>,
    },
    {
      title: 'Сумма',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total: number) => <span className="total-price">{total} ₽</span>,
    },
  ];

  return (
    <Modal
      title={`Заказ №${order.id}`}
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={null}
      className="sales-modal"
    >
      <div className="order-details">
        <div className="order-header">
          <div className="status-section">
            <h3>Статус</h3>
            <Tag color={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Tag>
          </div>
          <div className="date-section">
            <div className="date-item">
              <span className="label">Создано:</span>
              <span className="value">
                {new Date(order.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
            <div className="date-item">
              <span className="label">Обновлено:</span>
              <span className="value">
                {new Date(order.updatedAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        <div className="customer-info">
          <h3>Информация о покупателе</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">ФИО</span>
              <span className="value">{order.customerName}</span>
            </div>
            <div className="info-item">
              <span className="label">Тип покупателя</span>
              <span className="value">{getCustomerTypeLabel(order.customerType)}</span>
            </div>
            <div className="info-item">
              <span className="label">Номер телефона</span>
              <span className="value">{order.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="items-section">
          <h3>Товары в заказе</h3>
          {order.items.length > 0 ? (
            <Table
              dataSource={order.items}
              columns={columns}
              pagination={false}
              rowKey="id"
              size="small"
            />
          ) : (
            <Empty description="Товары не найдены" />
          )}
        </div>

        <div className="order-summary">
          <div className="summary-item total">
            <span className="label">Итоговая сумма:</span>
            <span className="value">{order.totalAmount} ₽</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
