import React, { Component, ErrorInfo, ReactNode } from 'react';
import { handleEnterpriseError } from '../services/toastAndErrorService';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    handleEnterpriseError(
      `Unhandled UI Exception: ${error.message || 'React render error'}`,
      { error, componentStack: errorInfo.componentStack },
      'Global Error Boundary',
      '/component/boundary'
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070C14] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-[#131C2E] border border-[#273449] p-8 rounded-3xl max-w-lg w-full space-y-5 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-rose-500/30">
              ⚡
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Application Exception Recovered</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                A non-fatal error occurred in the user interface. The system prevented a blank screen freeze and logged the diagnostic stack trace to the Audit Log.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#0B1220] border border-[#273449] p-3.5 rounded-xl text-left font-mono text-[11px] text-rose-300 max-h-36 overflow-y-auto hide-scrollbar">
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                🔄 Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
