import React, { useState } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { OnboardingModal } from './modalWindows/OnboardingModal';
import { ONBOARDING_STEPS } from '../service/faqContent/onboardingContent';
import './style/OnboardingButton.css';

export const OnboardingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="onboarding-button"
        onClick={() => setIsOpen(true)}
        title="Пошаговое обучение"
        aria-label="Открыть пошаговое обучение"
      >
        <FaGraduationCap size={28} />
      </button>

      <OnboardingModal
        isOpen={isOpen}
        steps={ONBOARDING_STEPS}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
