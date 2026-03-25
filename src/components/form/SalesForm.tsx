import { useState } from 'react';
import { Table, Space, Tag, Select } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import '../style/SalesForm.css';
import { SalesModal } from '../modalWindows/SalesModal';
import { getMockOrders } from '../../service/mockData/mockOrderData';
import type { Order } from '../types/Order';

export const SalesForm = () => {
  const [orders] = useState<Order[]>(getMockOrders());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

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

  const filteredOrders = orders.filter((order) => {
    const customerTypeMatch = !customerTypeFilter || order.customerType === customerTypeFilter;
    const statusMatch = !statusFilter || order.status === statusFilter;
    return customerTypeMatch && statusMatch;
  });

  const columns = [
    {
      title: 'Заказ №',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <span className="order-id">#{id}</span>,
      sorter: (a: Order, b: Order) => a.id - b.id,
    },
    {
      title: 'ФИО покупателя',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text: string) => <span className="customer-name">{text}</span>,
      sorter: (a: Order, b: Order) => a.customerName.localeCompare(b.customerName, 'ru'),
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
      sorter: (a: Order, b: Order) => a.customerType.localeCompare(b.customerType, 'ru'),
    },
    {
      title: 'Сумма',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => <span className="total-amount">{amount} ₽</span>,
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
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
      sorter: (a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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

      <div className="sales-filters" style={{ marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: "black" }}>Тип покупателя</label>
          <Select
            placeholder="Все типы покупателей"
            value={customerTypeFilter}
            onChange={setCustomerTypeFilter}
            allowClear
            style={{ width: '100%' }}
            options={[
              { label: 'Физлицо', value: 'individual' },
              { label: 'Юрлицо', value: 'legal' },
            ]}
          />
        </div>

        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: "black" }}>Статус заказа</label>
          <Select
            placeholder="Все статусы"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: '100%' }}
            options={[
              { label: 'Ожидание', value: 'pending' },
              { label: 'В обработке', value: 'processing' },
              { label: 'Отправлен', value: 'shipped' },
              { label: 'Доставлен', value: 'delivered' },
              { label: 'Отменён', value: 'cancelled' },
            ]}
          />
        </div>
      </div>

      <div className="sales-table-wrapper">
        <Table
          columns={columns}
          dataSource={filteredOrders}
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
