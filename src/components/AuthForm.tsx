
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Mail, Apple } from 'lucide-react';

type AuthMode = 'login' | 'register';

const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    setEmail('');
    setPassword('');
    if (mode === 'login') {
      setName('');
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: 'Logged in successfully',
          description: 'Welcome to FoodFinder Eco!',
        });

        navigate(from);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });

        if (error) throw error;
        
        if (data.user?.identities?.length === 0) {
          toast({
            variant: 'destructive',
            title: 'Email already registered',
            description: 'This email is already registered. Please login instead.',
          });
          setMode('login');
          return;
        }
        
        toast({
          title: 'Account created successfully',
          description: 'Welcome to FoodFinder Eco! Please check your email for verification.',
        });
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!signInError) {
          navigate(from);
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    try {
      setSocialLoading(provider);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: `${provider} Sign-in failed`,
        description: error.message || 'Please try again later.',
      });
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">FoodFinder Eco</h1>
        <p className="text-muted-foreground">Save food, save money, save the planet</p>
      </div>

      <Tabs defaultValue="login" onValueChange={(value) => setMode(value as AuthMode)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
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
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="/auth/reset-password" className="text-xs text-eco-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-eco-500 hover:bg-eco-600" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-eco-500 hover:bg-eco-600" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSocialAuth('google')}
            disabled={socialLoading !== null}
          >
            {socialLoading === 'google' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSocialAuth('apple')}
            disabled={socialLoading !== null}
          >
            {socialLoading === 'apple' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Apple className="mr-2 h-4 w-4" />
            )}
            Apple
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
