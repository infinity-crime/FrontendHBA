import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { OnboardingStep } from '../../service/faqContent/onboardingContent';
import '../style/OnboardingModal.css';

interface OnboardingModalProps {
  isOpen: boolean;
  steps: OnboardingStep[];
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  steps,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  return (
    <div className="onboarding-modal-overlay" onClick={handleSkip}>
      <div
        className="onboarding-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="onboarding-modal-header">
          <div className="onboarding-progress">
            <span className="onboarding-step-number">
              Шаг {currentStep + 1} из {steps.length}
            </span>
            <div className="onboarding-progress-bar">
              <div
                className="onboarding-progress-fill"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <button className="onboarding-close-btn" onClick={handleSkip}>
            <FaTimes size={24} />
          </button>
        </div>

        <div className="onboarding-modal-body">
          <h2 className="onboarding-title">{step.title}</h2>
          <p className="onboarding-description">{step.description}</p>
        </div>

        <div className="onboarding-modal-footer">
          <button
            className="onboarding-btn onboarding-btn-secondary"
            onClick={handleSkip}
          >
            Пропустить
          </button>

          <div className="onboarding-navigation">
            <button
              className="onboarding-btn onboarding-btn-icon"
              onClick={handlePrevious}
              disabled={isFirst}
              title="Предыдущий шаг"
            >
              <FaChevronLeft size={20} />
            </button>

            <button
              className="onboarding-btn onboarding-btn-primary"
              onClick={handleNext}
            >
              {isLast ? 'Завершить' : 'Следующий шаг'}
              {!isLast && <FaChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
