import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2E7D55] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#C94C4C] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#2A5372] shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-[#FFFFFF] border-[#DDE9DF] text-[#29352F]',
    error: 'bg-[#FFFFFF] border-[#F5E3D7] text-[#29352F]',
    info: 'bg-[#FFFFFF] border-[#E5EEF5] text-[#29352F]',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5 ${bgStyles[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#788078] hover:text-[#29352F] p-0.5 rounded-lg"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
