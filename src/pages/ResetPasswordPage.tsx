
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Reset link sent',
        description: 'Check your email for a password reset link',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send reset link',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-sm bg-background">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        
        {submitted ? (
          <div className="text-center space-y-4">
            <p>If an account exists with email {email}, you will receive a password reset link.</p>
            <p className="text-sm text-muted-foreground">
              Don't see the email? Check your spam folder or{' '}
              <button 
                className="text-eco-500 hover:underline" 
                onClick={() => setSubmitted(false)}
              >
                try again
              </button>.
            </p>
            <Button asChild className="mt-4">
              <Link to="/auth">Back to Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <div className="text-center mt-4">
              <Link to="/auth" className="text-sm text-eco-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
