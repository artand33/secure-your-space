import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Button variant="ghost" asChild className="text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] transition-colors rounded-full px-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </Button>
      </div>
      <div className="mb-8 flex items-center gap-2">
        <ShieldCheck className="w-10 h-10 text-[#E8640A]" />
        <h1 className="text-2xl font-bold text-white tracking-tight">SecureGuard</h1>
      </div>
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-8 shadow-xl">
        <Outlet />
      </div>
      <p className="mt-8 text-[#9CA3AF] text-sm">
        &copy; {new Date().getFullYear()} SecureGuard Systems. All rights reserved.
      </p>
    </div>
  );
};

export default AuthLayout;
