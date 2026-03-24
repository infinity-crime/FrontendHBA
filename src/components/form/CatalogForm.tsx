import { useState } from 'react';
import '../style/CatalogForm.css';
import {CardGrid} from '../CardsGrid';
import { ProductModal } from '../modalWindows/ProductModal';
import { getMockProducts } from '../../service/mockData/mockProductData';
import type{ ValueCards } from '../types/ValueCards';


export const CatalogForm = () => {
  const [values] = useState<ValueCards[]>(getMockProducts());
  const [activeCategory, setActiveCategory] = useState('cosmetics');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ValueCards | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredValues = values.filter(item => {
    const categoryFilter = item.category === activeCategory;
    const searchFilter = item.title.toLowerCase().includes(search.toLowerCase())

    return categoryFilter && searchFilter;
  });

  const handleCardClick = (product: ValueCards) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: ValueCards) => {
    console.log('Edit product:', product);
    // Здесь будет логика редактирования товара
  };

  const handleDeleteProduct = (productId: number) => {
    console.log('Delete product:', productId);
    // Здесь будет логика удаления товара
  };

  const handleArchiveProduct = (productId: number) => {
    console.log('Archive product:', productId);
    // Здесь будет логика архивирования товара
  };

  return (
    <div className='catalog-container'>
        <div className='header'>
            <h1>Каталог</h1>
            <input type='search'
             placeholder="Поиск"
             value ={search}
             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                setSearch(e.target.value)
             }}> 
             </input>
        </div>
        <div className='main-content'>
            <div className='buttons-container'>
                <div className='catalog-button'>
                    <button className={activeCategory === 'cosmetics' ? 'active' : ''}
                     onClick={() => setActiveCategory('cosmetics')} >Косметика</button>
                </div>
                <div className='catalog-button'>
                    <button className={activeCategory === 'candy' ? 'active' : ''}
                     onClick={() => setActiveCategory('candy')} >Сладости</button>
                </div>
                <div className='catalog-button'>
                    <button className={activeCategory === 'toys' ? 'active' : ''}
                     onClick={() => setActiveCategory('toys')} >Игрушки</button>
                </div>
                 <div className='catalog-button'>
                    <button className={activeCategory ==='parfume' ? 'active' : ''}
                        onClick={() => setActiveCategory('parfume')} >Парфюм</button>
                 </div>
                <div className='catalog-button'>
                   <button className={activeCategory === 'cloth' ? 'active' : ''}
                     onClick={() => setActiveCategory('cloth')} >Одежда</button>
                </div>
                <div className='catalog-button'>
                <button className={activeCategory === 'decoration' ? 'active' : ''}
                     onClick={() => setActiveCategory('decoration')} >Украшение</button>
                </div>
            </div>
            <div className='cards-box'>
                <CardGrid 
                    cards={filteredValues}
                    onCardClick={handleCardClick}
                />
            </div>
        </div>

        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onArchive={handleArchiveProduct}
        />
    </div>
  )
};
