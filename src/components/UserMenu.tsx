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
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, LogOut, LogIn } from 'lucide-react';

const UserMenu = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  const userInitial = profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-[#E8640A]/50 transition-all active:scale-95">
          <Avatar className="h-full w-full">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
            <AvatarFallback className="bg-[#E8640A] text-white font-bold text-lg">
              {userInitial.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1A1A1A] border-[#2E2E2E] text-white" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white whitespace-nowrap overflow-hidden text-ellipsis">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-[#9CA3AF] whitespace-nowrap overflow-hidden text-ellipsis">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#2E2E2E]" />
        
        <DropdownMenuItem asChild className="focus:bg-[#2E2E2E] focus:text-[#E8640A] cursor-pointer py-3">
          <Link to="/profile" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-[#2E2E2E]" />
        
        <DropdownMenuItem 
          onClick={() => signOut()} 
          className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-400 py-3"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
