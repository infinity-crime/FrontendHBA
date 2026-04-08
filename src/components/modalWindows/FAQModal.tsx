import React, { useState } from 'react';
import { FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { FAQPage } from '../../service/faqContent/faqContent';
import '../style/FAQModal.css';

interface FAQModalProps {
  isOpen: boolean;
  faqData: FAQPage;
  onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, faqData, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="faq-modal-overlay" onClick={onClose}>
      <div className="faq-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="faq-modal-header">
          <h2>{faqData.description}</h2>
          <button className="faq-close-btn" onClick={onClose}>
            <FaTimes size={24} />
          </button>
        </div>

        <div className="faq-modal-body">
          {faqData.items.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question-btn"
                onClick={() => toggleExpand(index)}
              >
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-toggle-icon">
                  {expandedIndex === index ? (
                    <FaChevronUp size={16} />
                  ) : (
                    <FaChevronDown size={16} />
                  )}
                </span>
              </button>

              {expandedIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-modal-footer">
          <p className="faq-footer-text">
            Не нашли ответ на свой вопрос? Свяжитесь с поддержкой: support@company.com
          </p>
        </div>
      </div>
    </div>
  );
};
