import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" aria-live="assertive" className="min-h-[400px] flex items-center justify-center p-8 text-center text-error border border-error/50 bg-error/10 rounded-2xl m-8">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p>We apologize, but an unexpected error occurred.</p>
            <button 
              className="px-6 py-2 bg-error text-white rounded-full font-medium mt-4 hover:opacity-90"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
