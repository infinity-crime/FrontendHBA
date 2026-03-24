import './style/CardGrid.css';
import type{ ValueCards } from './types/ValueCards';
import {Card} from './Card';


interface CardsGridProps {
  cards: ValueCards[];
  onCardClick: (card: ValueCards) => void;
}

export const CardGrid = ({ cards, onCardClick}: CardsGridProps) => {

  if (cards.length === 0) {
    return <div className="no-products">Товары не найдены</div>;
  }

  return (
    <div className="product-grid">
      {cards.map(value => (
        <Card
          key={value.id}
          card={value}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};
