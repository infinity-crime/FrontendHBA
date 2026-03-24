import { useState } from 'react';
import { Table, Space, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import '../style/SalesForm.css';
import { SalesModal } from '../modalWindows/SalesModal';
import { getMockOrders } from '../../service/mockData/mockOrderData';
import type { Order } from '../types/Order';

export const SalesForm = () => {
  const [orders] = useState<Order[]>(getMockOrders());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewOrder = (record: Order) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: 'Заказ №',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <span className="order-id">#{id}</span>,
    },
    {
      title: 'ФИО покупателя',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text: string) => <span className="customer-name">{text}</span>,
    },
    {
      title: 'Тип покупателя',
      dataIndex: 'customerType',
      key: 'customerType',
      width: 130,
      render: (type: string) => (
        <Tag color={type === 'individual' ? 'blue' : 'orange'}>
          {type === 'individual' ? 'Физлицо' : 'Юрлицо'}
        </Tag>
      ),
    },
    {
      title: 'Сумма',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => <span className="total-amount">{amount} ₽</span>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => (
        <span className="order-date">
          {new Date(date).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 80,
      render: (_: any, record: Order) => (
        <Space size="small">
          <a
            onClick={() => handleViewOrder(record)}
            className="view-button"
          >
            <EyeOutlined /> Смотреть
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h1>Продажи</h1>
      </div>

      <div className="sales-table-wrapper">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Всего ${total} заказов`,
          }}
          className="sales-table"
        />
      </div>

      <SalesModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
