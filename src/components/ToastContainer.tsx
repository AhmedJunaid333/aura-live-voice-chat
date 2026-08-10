import React from 'react';
import { useToast } from '../services/toastAndErrorService';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-slide-in ${
              isError
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-950/50'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-950/50'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-950/50'
                : 'bg-slate-900/90 border-slate-700 text-slate-100 shadow-slate-950/50'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg">
                {isError ? '⚠️' : isSuccess ? '✅' : isWarning ? '⚡' : 'ℹ️'}
              </span>
              <div>
                <div className="text-xs font-bold font-sans flex items-center gap-1.5">
                  <span>{toast.module || 'System Alert'}</span>
                  <span className="text-[10px] opacity-60 font-mono">
                    {new Date(toast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-medium mt-0.5 leading-snug break-words">
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xs font-bold transition"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
