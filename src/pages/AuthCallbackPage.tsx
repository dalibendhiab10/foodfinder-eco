
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          // Redirect to home page after successful auth
          setTimeout(() => navigate('/'), 500);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Authentication Error</h2>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => navigate('/auth')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Completing Authentication</h2>
          <p className="mt-2">Please wait while we complete the authentication process...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallbackPage;
