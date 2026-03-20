import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Access Denied</h1>
      <p className="text-[#9CA3AF] max-w-md mb-8 leading-relaxed">
        You do not have the necessary permissions to access this restricted area. 
        Your current access level does not allow viewing administrative pages.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full px-8 h-12 shadow-xl shadow-[#E8640A]/20 transition-all hover:scale-105 active:scale-95">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
