import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Loader2,
  User as UserIcon, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Briefcase, 
  Server, 
  CalendarCheck, 
  MessageSquare,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  console.log('[UserMenu Tracker]', {
    loading,
    hasProfile: !!profile,
    profileObject: profile,
    role: profile?.role
  });

  if (loading) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent">
        <Loader2 className="w-5 h-5 animate-spin text-[#9CA3AF]" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        onClick={() => navigate('/auth/login')}
        className="text-white hover:text-[#E8640A] transition-colors"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const handleLogout = async (e: Event | React.SyntheticEvent) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  try {
    await signOut();
    toast.success('Logged out successfully');
    window.location.href = '/auth/login';
  } catch (err) {
    window.location.href = '/auth/login';
  }
};

  const userInitial = profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U';
  // Check role carefully - support case-insensitive just in case database representation differs
  const isAdmin = profile?.role?.toString().toLowerCase() === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-[#E8640A]/50 transition-all active:scale-95 group focus-visible:ring-0 focus-visible:ring-offset-0">
          <Avatar className="h-full w-full">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
            <AvatarFallback className="bg-[#E8640A] text-white font-bold text-lg">
              {userInitial.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent 
          className="w-64 bg-[#1A1A1A] border border-[#2E2E2E] text-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-100 z-[1001]" 
          align="end" 
          side="bottom"
          sideOffset={12}
        >
          <DropdownMenuLabel className="font-normal px-2 py-3 mb-2 bg-[#202020] rounded-xl">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none text-white whitespace-nowrap overflow-hidden text-ellipsis">
                {profile?.full_name || 'User Account'}
              </p>
              <p className="text-[10px] leading-none text-[#9CA3AF] whitespace-nowrap overflow-hidden text-ellipsis mt-1 opacity-70 italic lowercase">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuItem asChild className="focus:bg-[#1A1A1A] focus:text-[#E8640A] cursor-pointer py-3 rounded-lg mb-1 group">
            <Link to="/profile" className="flex items-center w-full">
              <UserIcon className="mr-3 h-4 w-4 text-[#4B4B4B] group-hover:text-[#E8640A] transition-colors" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem asChild className="focus:bg-[#1A1A1A] focus:text-[#E8640A] cursor-pointer py-3 rounded-lg mb-1 group">
              <Link to="/dashboard/admin" className="flex items-center w-full">
                <ShieldCheck className="mr-3 h-4 w-4 text-[#4B4B4B] group-hover:text-[#E8640A] transition-colors" />
                <span className="font-bold">Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <>
              <DropdownMenuSeparator className="my-2 bg-[#2E2E2E]" />
              <div className="px-2 py-1.5 text-[10px] font-bold text-[#4B4B4B] uppercase tracking-[0.2em] mb-1">Management</div>
              
              <DropdownMenuItem asChild className="focus:bg-[#1A1A1A] focus:text-[#E8640A] cursor-pointer py-3 rounded-lg mb-1 group">
                <Link to="/admin/services" className="flex items-center w-full">
                  <Server className="mr-3 h-4 w-4 text-[#4B4B4B] group-hover:text-[#E8640A] transition-colors" />
                  <span>Service Type CRUD</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="focus:bg-[#1A1A1A] focus:text-[#E8640A] cursor-pointer py-3 rounded-lg mb-1 group">
                <Link to="/admin/jobs" className="flex items-center w-full">
                  <Briefcase className="mr-3 h-4 w-4 text-[#4B4B4B] group-hover:text-[#E8640A] transition-colors" />
                  <span>Job Creation Engine</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="focus:bg-[#1A1A1A] focus:text-[#E8640A] cursor-pointer py-3 rounded-lg mb-1 group">
                <Link to="/admin/bookings" className="flex items-center w-full">
                  <CalendarCheck className="mr-3 h-4 w-4 text-[#4B4B4B] group-hover:text-[#E8640A] transition-colors" />
                  <span>All Bookings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="focus:bg-[#1A1A1A] focus:text-[#E8640A] cursor-pointer py-3 rounded-lg mb-1 group">
                <Link to="/admin/enquiries" className="flex items-center w-full">
                  <MessageSquare className="mr-3 h-4 w-4 text-[#4B4B4B] group-hover:text-[#E8640A] transition-colors" />
                  <span>Lead Management</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="my-2 bg-[#2E2E2E]" />
          
          <DropdownMenuItem 
            onSelect={handleLogout}
            className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-400 py-3 rounded-lg group"
          >
            <LogOut className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default UserMenu;
