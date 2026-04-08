import React, { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { FAQModal } from './modalWindows/FAQModal';
import { getFAQByPageOrGeneral } from '../service/faqContent/faqContent';
import './style/FAQButton.css';

interface FAQButtonProps {
  pageName?: string;
}

export const FAQButton: React.FC<FAQButtonProps> = ({ pageName = 'General' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const faqData = getFAQByPageOrGeneral(pageName);

  return (
    <>
      <button
        className="faq-button"
        onClick={() => setIsOpen(true)}
        title="Часто задаваемые вопросы"
        aria-label="Открыть часто задаваемые вопросы"
      >
        <FaQuestionCircle size={28} />
      </button>

      <FAQModal
        isOpen={isOpen}
        faqData={faqData}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
