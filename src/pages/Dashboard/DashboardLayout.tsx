import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  User,
  Briefcase,
  Server,
  HelpCircle,
  Settings,
  Home,
  Menu,
  ChevronLeft,
  Flame,
  LayoutGrid,
  Bell
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserMenu from '@/components/UserMenu';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

const DashboardLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isAdmin = profile?.role === 'admin';
  const isHomePage = location.pathname === '/';

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    window.location.href = '/auth/login';
  };

  // Close sidebar on path change and handle scrolling
  useEffect(() => {
    setOpen(false);

    // Handle hash scrolling
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Sidebar links (Navigation only)
  const navLinks = [
    { title: 'Home', path: '/', icon: Home },
    { title: 'Dashboard', path: isAdmin ? '/dashboard/admin' : '/dashboard/user', icon: LayoutGrid },
    { title: 'Profile', path: '/profile', icon: User },
    { title: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { title: 'Browse Jobs', path: '/dashboard/jobs', icon: Briefcase },
    { title: 'Services', path: '/#services', icon: Server },
    { title: 'FAQ', path: '/#faq', icon: HelpCircle },
    { title: 'Hero', path: '/#hero', icon: Flame },
    { title: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-hidden border-r border-[#2E2E2E]">
      <div className="p-8 flex items-center gap-3 border-b border-[#2E2E2E] bg-[#1A1A1A]">
        <ShieldCheck className="w-8 h-8 text-[#E8640A]" />
        <span className="font-bold text-xl tracking-tight italic">SG SYSTEMS</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-bold text-[#4B4B4B] uppercase tracking-[0.2em] mb-6 px-3">Navigation Menu</div>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || (location.pathname === '/' && link.path.startsWith('/#') && location.hash === link.path.replace('/', ''));
          return (
            <Button
              key={link.path}
              asChild
              variant="ghost"
              className={`w-full justify-start gap-4 hover:bg-[#202020] transition-all rounded-xl py-7 ${isActive ? 'bg-[#202020] text-[#E8640A]' : 'text-[#9CA3AF] hover:text-[#E8640A]'}`}
            >
              <Link to={link.path}>
                <link.icon className={`w-5 h-5 ${isActive ? 'text-[#E8640A]' : 'text-[#4B4B4B]'}`} />
                <span className="font-semibold text-lg">{link.title}</span>
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#2E2E2E] bg-[#141414]">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-4 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors py-7 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold">Log Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Universal Floating Header */}
      <header className={`h-20 border-b border-white/5 bg-[#0D0D0D]/90 backdrop-blur-xl px-4 md:px-12 flex items-center justify-between sticky top-0 z-[100] transition-all`}>
        <div className="flex items-center gap-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#9CA3AF] hover:text-[#E8640A] transition-all hover:bg-white/5 border border-[#2E2E2E] rounded-xl w-11 h-11 shrink-0">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 bg-[#1A1A1A] border-[#2E2E2E] shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-[#E8640A]/10 flex items-center justify-center border border-[#E8640A]/20">
              <ShieldCheck className="w-6 h-6 text-[#E8640A]" />
            </div>
            <span className="font-bold text-lg hidden sm:block tracking-tighter italic uppercase">SECUREGUARD SYSTEMS</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {!isHomePage && (
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-[#9CA3AF] hover:text-white hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          )}

          <div className="h-8 w-px bg-white/10 hidden sm:block mx-1" />

          <NotificationBell />
          <UserMenu />
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-1 overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notifications-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-[#9CA3AF] hover:text-[#E8640A] hover:bg-white/5 border border-[#2E2E2E] rounded-xl w-11 h-11 shrink-0"
      onClick={() => navigate('/dashboard/notifications')}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8640A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#E8640A] text-[10px] font-bold text-white items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </span>
      )}
    </Button>
  );
};

export default DashboardLayout;
