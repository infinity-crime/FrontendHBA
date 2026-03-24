import './style/Card.css';
import type{ ValueCards } from './types/ValueCards';

interface CardProps {
  card: ValueCards;
  onClick: (card: ValueCards) => void;
}

export const Card = ({card, onClick}: CardProps) => {
    return (
        <div 
            className="product-card"
            onClick={() => onClick(card)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick(card);
                }
            }}
            style={{ cursor: 'pointer' }}
        >
            <div className="product-image">
                {card.image ? (
                    <img src={card.image} alt={card.title} />
                ) : (
                    <div className="image-placeholder">📦</div>
                )}
                <div className="stock-label">{card.count} шт</div>
                <div className="price-label">{card.purchasePrice} ₽</div>
            </div>

            <div className="product-info">
                <h3>{card.title}</h3>
                <div className="price">{card.price} ₽</div>
            </div>
        </div>
    );
}