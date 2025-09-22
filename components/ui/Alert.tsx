import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const baseClasses = 'p-4 rounded-lg mb-4 text-sm flex items-center justify-between border';
  const typeClasses = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold text-lg">&times;</button>
      )}
    </div>
  );
};

export default Alert;