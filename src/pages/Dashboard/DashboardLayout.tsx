import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut, LayoutDashboard, User } from 'lucide-react';

const DashboardLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] border-r border-[#2E2E2E] flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[#E8640A]" />
          <span className="font-bold text-xl tracking-tight">SecureGuard</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start gap-3 hover:bg-[#202020] text-[#9CA3AF] hover:text-[#E8640A] transition-all rounded-xl py-6">
            <Link to="/dashboard">
              <LayoutDashboard className="w-5 h-5 transition-transform group-hover:scale-110" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start gap-3 hover:bg-[#202020] text-[#9CA3AF] hover:text-[#E8640A] transition-all rounded-xl py-6">
            <Link to="/dashboard/profile">
              <User className="w-5 h-5 transition-transform group-hover:scale-110" />
              Profile
            </Link>
          </Button>
        </nav>

        <div className="p-4 border-t border-[#2E2E2E] bg-[#141414]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#E8640A]/20 flex items-center justify-center text-[#E8640A] font-bold shadow-inner">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{profile?.full_name ?? 'User'}</p>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-bold">{profile?.role ?? 'Role'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[#2E2E2E] bg-[#1A1A1A]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-lg">Dashboard Overview</h2>
            <div className="flex gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${profile?.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-[#E8640A]/10 text-[#E8640A] border border-[#E8640A]/20'}`}>
                {profile?.role} Access
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
