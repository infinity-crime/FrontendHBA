//import { useState } from 'react';
import '../style/SalesForm.css';




export const SalesForm = () => {
 
   const productValue = [
    { name:'Петя', shop: 'Озон', basket:'кофта',status:'в работе',result:4000,date:'20.03.2000 19:33' },
    { name:'Петя', shop: 'Озон', basket:'кофта',status:'в работе',result:4000,date:'20.03.2000 19:33' }
  ];


  return (
    <div>
      <text className='product-text'>Продажи</text>  
      <div className ='list-product'>
                <div className = 'header-list-product'>
                    <div className='producy-span'>
                        <span>Покупатель </span>
                    </div>
                    <div  className='producy-span'>
                        <span>Магазин</span>
                    </div>
                    <div  className='producy-span'>
                        <span>Корзина</span>
                    </div>
                    <div  className='producy-span'>
                        <span>Статус</span>
                    </div>
                    <div  className='producy-span'>
                        <span>Итог</span>
                    </div>
                    <div  className='producy-span'>
                        <span>Дата</span>
                    </div>
                </div>


                 {productValue.map((product) => (
                    <div className='list-items-product' >
                        <button className='name-button'>{product.name}</button>
                        <text>{product.shop}</text>
                        <text>{product.basket}</text>
                        <text>{product.status}</text>
                        <button className='price-button'>{product.result}</button>
                         <text>{product.date}</text>             
                      </div>
                    ))}
            </div>
    </div>
  )
};
