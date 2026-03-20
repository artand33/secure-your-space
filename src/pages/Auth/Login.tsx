import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: 'Success',
      description: 'You have been logged in.',
    });
    
    // Redirect logic will be handled by the dashboard route or App state
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
        <p className="text-sm text-[#9CA3AF]">
          Enter your credentials to access your account
        </p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#2E2E2E] border-[#3E3E3E] text-white focus:ring-[#E8640A]"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" title="password" className="text-white">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#2E2E2E] border-[#3E3E3E] text-white focus:ring-[#E8640A]"
            required
          />
        </div>
        <Button 
          type="submit" 
          id="login-button"
          className="w-full bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full h-11 transition-all" 
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log in'}
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-[#9CA3AF]">Don't have an account? </span>
        <Link to="/auth/signup" className="text-[#E8640A] hover:underline font-medium transition-all">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
