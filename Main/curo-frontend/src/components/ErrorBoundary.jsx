import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 text-center">
          <div className="w-full max-w-2xl rounded-xl2 border border-line bg-white p-8 shadow-card">
            <h1 className="font-display text-2xl font-semibold text-pulse">
              Something broke while rendering CURO
            </h1>
            <p className="mt-4 text-sm text-ink-soft">
              {this.state.error?.toString()}
            </p>
            {this.state.errorInfo && (
              <pre className="mt-6 max-h-60 overflow-auto rounded-lg bg-paper-dim p-4 text-left font-mono text-xs text-ink-soft select-all">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
