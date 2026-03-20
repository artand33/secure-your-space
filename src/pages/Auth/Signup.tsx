import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: 'Success',
      description: 'Please check your email to confirm your account.',
    });
    
    navigate('/auth/login');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Create an account</h2>
        <p className="text-sm text-[#9CA3AF]">
          Enter your details below to get started
        </p>
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" title="fullName" className="text-white">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-[#2E2E2E] border-[#3E3E3E] text-white focus:ring-[#E8640A]"
            required
          />
        </div>
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
          <Label htmlFor="password" title="password" className="text-white">Password</Label>
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
          id="signup-button"
          className="w-full bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full h-11 transition-all" 
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create account'}
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-[#9CA3AF]">Already have an account? </span>
        <Link to="/auth/login" className="text-[#E8640A] hover:underline font-medium transition-all">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
