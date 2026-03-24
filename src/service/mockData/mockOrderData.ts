// Mock Orders Data
import type { Order } from '../../components/types/Order';

export const getMockOrders = (): Order[] => {
  return [
    {
      id: 1,
      customerName: 'Иван Петров',
      customerType: 'individual',
      phoneNumber: '+7 (995) 123-45-67',
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'Адвент календарь профессиональная косметика',
          quantity: 2,
          price: 500,
          total: 1000,
        },
        {
          id: 2,
          productId: 5,
          productName: 'Парфюм "Зимний натиск"',
          quantity: 1,
          price: 2000,
          total: 2000,
        },
      ],
      totalAmount: 3000,
      status: 'delivered',
      createdAt: '2024-03-15T10:30:00Z',
      updatedAt: '2024-03-20T14:00:00Z',
    },
    {
      id: 2,
      customerName: 'ООО "Торговая компания"',
      customerType: 'legal_entity',
      phoneNumber: '+7 (812) 999-88-77',
      items: [
        {
          id: 3,
          productId: 2,
          productName: 'Подарочный набор для женщин',
          quantity: 5,
          price: 3000,
          total: 15000,
        },
      ],
      totalAmount: 15000,
      status: 'processing',
      createdAt: '2024-03-22T08:45:00Z',
      updatedAt: '2024-03-23T12:00:00Z',
    },
    {
      id: 3,
      customerName: 'Мария Сидорова',
      customerType: 'individual',
      phoneNumber: '+7 (951) 555-22-33',
      items: [
        {
          id: 4,
          productId: 3,
          productName: 'Сладкий предновогодний набор',
          quantity: 3,
          price: 700,
          total: 2100,
        },
        {
          id: 5,
          productId: 8,
          productName: 'Набор украшений на ёлку',
          quantity: 2,
          price: 750,
          total: 1500,
        },
      ],
      totalAmount: 3600,
      status: 'shipped',
      createdAt: '2024-03-20T15:20:00Z',
      updatedAt: '2024-03-22T10:30:00Z',
    },
    {
      id: 4,
      customerName: 'Александр Иванов',
      customerType: 'individual',
      phoneNumber: '+7 (921) 444-11-22',
      items: [
        {
          id: 6,
          productId: 4,
          productName: 'Мягкая игрушка Мишка',
          quantity: 1,
          price: 450,
          total: 450,
        },
      ],
      totalAmount: 450,
      status: 'pending',
      createdAt: '2024-03-23T13:00:00Z',
      updatedAt: '2024-03-23T13:00:00Z',
    },
    {
      id: 5,
      customerName: 'Елена Волкова',
      customerType: 'individual',
      phoneNumber: '+7 (988) 777-66-55',
      items: [
        {
          id: 7,
          productId: 6,
          productName: 'Рождественская кофта',
          quantity: 1,
          price: 1500,
          total: 1500,
        },
        {
          id: 8,
          productId: 7,
          productName: 'Снежинка декоративная',
          quantity: 4,
          price: 150,
          total: 600,
        },
      ],
      totalAmount: 2100,
      status: 'cancelled',
      createdAt: '2024-03-19T09:30:00Z',
      updatedAt: '2024-03-21T11:00:00Z',
    },
  ];
};

export const getOrderById = (id: number): Order | undefined => {
  return getMockOrders().find(order => order.id === id);
};
