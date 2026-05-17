import { Component, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6">
          <div className="bg-surface rounded-2xl shadow-sm border border-border max-w-md w-full p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
            </div>
            <h1 className="type-section-title mb-2">Something went wrong</h1>
            <p className="type-body mb-6">
              An unexpected error occurred. You can try refreshing the page or clicking the button
              below to recover.
            </p>
            {this.state.error && (
              <pre className="text-left type-error bg-bg border border-border-dark rounded-lg p-3 mb-6 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                <RefreshCw size={14} />
                Try again
              </button>
              <button
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="px-4 py-2 rounded-lg border border-border-dark text-text-muted text-sm font-medium hover:bg-bg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
