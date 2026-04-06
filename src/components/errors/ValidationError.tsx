import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import './ValidationError.css';

interface ValidationErrorProps {
  errors: Record<string, string[]>;
  position?: 'inline' | 'top' | 'bottom';
}

export const ValidationError: React.FC<ValidationErrorProps> = ({
  errors,
  position = 'top',
}) => {
  const errorList = Object.entries(errors)
    .flatMap(([field, msgs]) =>
      msgs.map((msg) => ({
        field,
        message: msg,
      }))
    );

  if (errorList.length === 0) return null;

  return (
    <div className={`validation-error-container validation-error-${position}`}>
      <div className="validation-error-header">
        <FaExclamationCircle className="validation-error-icon" />
        <span className="validation-error-title">
          {errorList.length} ошибка{errorList.length > 1 ? 'й' : ''}
        </span>
      </div>
      <ul className="validation-error-list">
        {errorList.map((error, index) => (
          <li key={index}>
            <strong>{error.field}:</strong> {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface FieldErrorProps {
  error?: string;
  touched?: boolean;
}

export const FieldError: React.FC<FieldErrorProps> = ({ error, touched }) => {
  if (!touched || !error) return null;

  return (
    <div className="field-error">
      <FaExclamationCircle className="field-error-icon" />
      <span>{error}</span>
    </div>
  );
};
