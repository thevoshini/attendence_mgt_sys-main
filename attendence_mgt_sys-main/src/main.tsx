import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';

// Import Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if key is valid (not empty, undefined, or a placeholder)
const isValidKey = PUBLISHABLE_KEY &&
  PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here' &&
  PUBLISHABLE_KEY.startsWith('pk_');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isValidKey ? (
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        signUpUrl={undefined}
      >
        <App />
      </ClerkProvider>
    ) : (
      <div className="container" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div>
          <h1>⚠️ Configuration Required</h1>
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
            Please add your Clerk Publishable Key to <code>.env.local</code>
          </p>
          <pre style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'left',
            border: '1px solid var(--color-border)'
          }}>
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
            VITE_SUPABASE_URL=https://your-project.supabase.co
            VITE_SUPABASE_ANON_KEY=your_anon_key_here
          </pre>
          <p style={{ marginTop: '2rem', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            After adding your keys, restart the development server with <code>npm run dev</code>
          </p>
        </div>
      </div>
    )}
  </StrictMode>
);
