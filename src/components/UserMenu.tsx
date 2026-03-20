import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, LogOut, Shield, LayoutDashboard } from 'lucide-react';

const UserMenu = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  if (!profile) {
    return (
      <Button asChild className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full px-6 text-[10px] md:text-xs h-9 font-bold uppercase tracking-wider shadow-lg shadow-[#E8640A]/20 transition-all hover:scale-105 active:scale-95">
        <Link to="/auth/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-[#202020] border border-transparent hover:border-[#2E2E2E] transition-all focus:outline-none group">
          <Avatar className="w-8 h-8 border border-[#2E2E2E] group-hover:border-[#E8640A] transition-colors shadow-lg shadow-black/40">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback className="bg-gradient-to-br from-[#E8640A] to-[#FF8C3A] text-white text-xs font-bold">
              {profile.full_name?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-[#141414] border-[#2E2E2E] text-white p-2 mt-4 shadow-2xl animate-in fade-in zoom-in-95" align="end">
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-bold truncate text-white">{profile.full_name}</p>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-black">{profile.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#2E2E2E] mx-1 my-1" />
        
        <DropdownMenuItem asChild className="focus:bg-[#E8640A]/10 focus:text-white rounded-xl cursor-pointer py-3 px-4 transition-all group">
          <Link to="/dashboard" className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 text-[#E8640A] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Main Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="focus:bg-[#E8640A]/10 focus:text-white rounded-xl cursor-pointer py-3 px-4 transition-all group">
          <Link to="/dashboard/profile" className="flex items-center gap-3">
            <User className="w-4 h-4 text-[#E8640A] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Your Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {profile.role === 'admin' && (
          <DropdownMenuItem asChild className="focus:bg-[#E8640A]/10 focus:text-white rounded-xl cursor-pointer py-3 px-4 transition-all group">
            <Link to="/dashboard/admin" className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#E8640A] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Administration</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-[#2E2E2E] mx-1 my-2" />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="focus:bg-red-500/10 focus:text-red-500 text-red-500/80 rounded-xl cursor-pointer py-3 px-4 transition-all group"
        >
          <LogOut className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Secure Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
