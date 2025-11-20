import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Custom fallback UI to display when an error occurs
   * Receives the error and errorInfo as parameters
   */
  fallback?: (error: Error, errorInfo?: React.ErrorInfo) => React.ReactNode;
  /**
   * Callback function to log errors
   * Can be used to send errors to logging services
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error boundary component to catch and handle React component errors
 * Provides error logging and customizable fallback UI
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error information
    console.error('[ErrorBoundary] Component error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Store errorInfo in state
    this.setState({ errorInfo });
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Default fallback UI
      return (
        <div style={{ padding: '20px', color: 'red', border: '1px solid red', borderRadius: '4px' }}>
          <h3>Something went wrong</h3>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error Details</summary>
            <p><strong>Error:</strong> {this.state.error.message}</p>
            {this.state.errorInfo && (
              <p><strong>Stack:</strong> {this.state.errorInfo.componentStack}</p>
            )}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
