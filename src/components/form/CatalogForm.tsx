import { useState } from 'react';
import { Button, Checkbox, message, Modal, Input } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import '../style/CatalogForm.css';
import { CardGrid } from '../CardsGrid';
import { ProductModal } from '../modalWindows/ProductModal';
import { getMockProducts } from '../../service/mockData/mockProductData';
import type { ValueCards } from '../types/ValueCards';

const DEFAULT_CATEGORIES = ['cosmetics', 'candy', 'toys', 'parfume', 'cloth', 'decoration'];

const CATEGORY_LABELS: Record<string, string> = {
  'cosmetics': 'Косметика',
  'candy': 'Сладости',
  'toys': 'Игрушки',
  'parfume': 'Парфюм',
  'cloth': 'Одежда',
  'decoration': 'Украшение',
};

export const CatalogForm = () => {
  const [values, setValues] = useState<ValueCards[]>(getMockProducts());
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('customCategories');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCategory, setActiveCategory] = useState('cosmetics');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ValueCards | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredValues = values.filter((item) => {
    const categoryFilter = item.category === activeCategory;
    const searchFilter = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const archivedFilter = showArchived ? item.isArchived : !item.isArchived;

    return categoryFilter && searchFilter && archivedFilter;
  });

  const handleCardClick = (product: ValueCards) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = (product: ValueCards) => {
    setValues(values.map((item) => (item.id === product.id ? product : item)));
    setSelectedProduct(product);
    message.success('Товар успешно сохранен');
  };

  const handleDeleteProduct = (productId: number) => {
    setValues(values.filter((item) => item.id !== productId));
    message.success('Товар удален');
  };

  const handleArchiveProduct = (productId: number) => {
    const product = values.find(item => item.id === productId);
    const newArchivedStatus = !product?.isArchived;
    
    const updatedProducts = values.map((item) =>
      item.id === productId ? { ...item, isArchived: newArchivedStatus } : item
    );
    setValues(updatedProducts);
    
    // Обновляем selectedProduct
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct({ ...selectedProduct, isArchived: newArchivedStatus });
    }
    
    const successMsg = newArchivedStatus ? 'Товар архивирован' : 'Товар разархивирован';
    message.success(successMsg);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

        const newProducts: ValueCards[] = [];
        const maxId = Math.max(...values.map((p) => p.id));

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values_row = lines[i].split(',').map((v) => v.trim());
          const product: ValueCards = {
            id: maxId + i,
            title: values_row[headers.indexOf('title')] || 'Неизвестный товар',
            description:
              values_row[headers.indexOf('description')] || 'Описание отсутствует',
            sku: values_row[headers.indexOf('sku')] || `SKU-${maxId + i}`,
            purchasePrice: parseFloat(values_row[headers.indexOf('purchaseprice')]) || 0,
            retailPrice:
              parseFloat(values_row[headers.indexOf('retailprice')]) || 0,
            price: parseFloat(values_row[headers.indexOf('price')]) || 0,
            image: values_row[headers.indexOf('image')] || '',
            count: parseInt(values_row[headers.indexOf('count')]) || 0,
            category:
              (values_row[headers.indexOf('category')] as any) ||
              'cosmetics',
            margin: parseInt(values_row[headers.indexOf('margin')]) || 0,
            isActive:
              values_row[headers.indexOf('isactive')]?.toLowerCase() !== 'false',
            isArchived:
              values_row[headers.indexOf('isarchived')]?.toLowerCase() ===
              'true',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          newProducts.push(product);
        }

        setValues([...values, ...newProducts]);
        message.success(`Импортировано товаров: ${newProducts.length}`);
      } catch (error) {
        message.error('Ошибка при импорте CSV файла');
        console.error('CSV Import error:', error);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const getAllCategories = () => {
    return [...DEFAULT_CATEGORIES, ...customCategories];
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      message.error('Введите название категории');
      return;
    }

    const categoryKey = newCategoryName.toLowerCase().replace(/\s+/g, '_');
    if (getAllCategories().includes(categoryKey)) {
      message.error('Категория с таким названием уже существует');
      return;
    }

    const updated = [...customCategories, categoryKey];
    setCustomCategories(updated);
    localStorage.setItem('customCategories', JSON.stringify(updated));
    CATEGORY_LABELS[categoryKey] = newCategoryName;
    setNewCategoryName('');
    setIsAddCategoryModalOpen(false);
    message.success('Категория добавлена');
  };

  const handleDeleteCategory = (categoryKey: string) => {
    const updated = customCategories.filter((cat) => cat !== categoryKey);
    setCustomCategories(updated);
    localStorage.setItem('customCategories', JSON.stringify(updated));
    message.success('Категория удалена');
  };

  return (
    <div className="catalog-container">
      <div className="header">
        <h1>Каталог</h1>
        <input
          type="search"
          placeholder="Поиск"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className="catalog-controls">
        <label className="archive-toggle">
          <Checkbox
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Показать архивированные товары
        </label>

        <label htmlFor="csv-import" className="import-button">
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => document.getElementById('csv-import')?.click()}
          >
            Импорт из CSV
          </Button>
          <input
            id="csv-import"
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="main-content">
        <div className="buttons-container">
          {getAllCategories().map((categoryKey) => (
            <div key={categoryKey} className="catalog-button-wrapper">
              <button
                className={activeCategory === categoryKey ? 'active' : ''}
                onClick={() => setActiveCategory(categoryKey)}
              >
                {CATEGORY_LABELS[categoryKey] || categoryKey}
              </button>
              {customCategories.includes(categoryKey) && (
                <button
                  className="delete-category"
                  onClick={() => handleDeleteCategory(categoryKey)}
                  title="Удалить категорию"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <div className="catalog-button">
            <button
              className="add-category"
              onClick={() => setIsAddCategoryModalOpen(true)}
              title="Добавить категорию"
            >
              <PlusOutlined /> Добавить
            </button>
          </div>
        </div>
        <div className="cards-box">
          <CardGrid
            cards={filteredValues}
            onCardClick={handleCardClick}
          />
        </div>
      </div>

      <Modal
        title="Добавить новую категорию"
        open={isAddCategoryModalOpen}
        onOk={handleAddCategory}
        onCancel={() => {
          setIsAddCategoryModalOpen(false);
          setNewCategoryName('');
        }}
        okText="Добавить"
        cancelText="Отменить"
      >
        <Input
          placeholder="Введите название категории"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onPressEnter={handleAddCategory}
        />
      </Modal>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={() => {}}
        onDelete={handleDeleteProduct}
        onArchive={handleArchiveProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
