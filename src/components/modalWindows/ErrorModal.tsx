import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import '../style/ModelWindows.css';

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: string;
  errorType?: 'validation' | 'server' | 'network' | 'permission' | 'conflict';
  onClose: () => void;
  onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  title,
  message,
  details,
  errorType = 'validation',
  onClose,
  onRetry,
}) => {
  if (!isOpen) return null;

  const getErrorColor = () => {
    switch (errorType) {
      case 'validation':
        return '#ff9800'; // Warning orange
      case 'server':
        return '#f44336'; // Red
      case 'network':
        return '#e91e63'; // Pink
      case 'permission':
        return '#9c27b0'; // Purple
      case 'conflict':
        return '#ff5722'; // Deep orange
      default:
        return '#f44336';
    }
  };

  const getErrorTypeLabel = () => {
    switch (errorType) {
      case 'validation':
        return 'Ошибка валидации';
      case 'server':
        return 'Серверная ошибка';
      case 'network':
        return 'Ошибка сети';
      case 'permission':
        return 'Доступ запрещен';
      case 'conflict':
        return 'Конфликт данных';
      default:
        return 'Ошибка';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content error-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ borderLeft: `4px solid ${getErrorColor()}` }}
      >
        <div className="modal-header error-header" style={{ backgroundColor: `${getErrorColor()}20` }}>
          <div className="error-icon-wrapper" style={{ color: getErrorColor() }}>
            <FaExclamationTriangle size={24} />
          </div>
          <div>
            <h3 style={{ color: getErrorColor(), margin: 0 }}>{title}</h3>
            <p style={{ color: getErrorColor(), fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              {getErrorTypeLabel()}
            </p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            style={{ color: getErrorColor() }}
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body error-body">
          <p className="error-message">{message}</p>
          {details && (
            <div className="error-details">
              <strong>Детали:</strong>
              <p>{details}</p>
            </div>
          )}
        </div>

        <div className="modal-footer error-footer">
          {onRetry && (
            <button
              className="btn btn-primary"
              onClick={() => {
                onRetry();
                onClose();
              }}
            >
              Повторить попытку
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
