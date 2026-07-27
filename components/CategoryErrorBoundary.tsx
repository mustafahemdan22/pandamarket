'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class CategoryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log to console so Vercel runtime logs capture it
    console.error('[CategoryErrorBoundary] Runtime crash caught:', error.message);
    console.error('[CategoryErrorBoundary] Stack:', error.stack);
    console.error('[CategoryErrorBoundary] Component stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16">
          <div className="text-center max-w-lg px-4">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded p-2">
              {this.state.error?.message}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Check the browser console for the full stack trace.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mr-3"
            >
              Try Again
            </button>
            <a
              href="/categories"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Back to Categories
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
