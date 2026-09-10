import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Fail safely without printing secrets or stack traces to external logs
    console.error('Handled application boundary error:', error?.message);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            maxWidth: '600px',
            margin: '80px auto',
            padding: '32px 24px',
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🪔</div>
          <h2 style={{ color: '#8b0000', margin: '0 0 8px 0', fontSize: '22px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
            PujaPath encountered an unexpected error while rendering this view. Please try reloading the page.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              backgroundColor: '#8b0000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;