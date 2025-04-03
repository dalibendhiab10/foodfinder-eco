
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthCallbackPage = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the intended destination from query parameters
        const params = new URLSearchParams(location.search);
        const redirectTo = params.get('redirectTo') || '/';
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          toast({
            title: 'Authentication successful',
            description: 'You have been signed in successfully.',
          });
          
          // Redirect to the intended destination after successful auth
          setTimeout(() => navigate(redirectTo, { replace: true }), 500);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
        toast({
          variant: 'destructive',
          title: 'Authentication failed',
          description: err.message || 'An error occurred during authentication',
        });
      }
    };

    handleAuthCallback();
  }, [navigate, location.search, toast]);

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
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold">Completing Authentication</h2>
          <p className="mt-2">Please wait while we complete the authentication process...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallbackPage;
