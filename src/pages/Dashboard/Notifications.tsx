import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Loader2, 
  Trash2,
  CalendarCheck,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Circle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  metadata: any;
}

const Notifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast.success('All notifications marked as read');
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Optional: Navigate based on metadata
    if (notification.metadata?.booking_id) {
       // Logic to go to booking detail or similar
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#E8640A] animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8640A]/10 flex items-center justify-center border border-[#E8640A]/20">
              <Bell className="w-6 h-6 text-[#E8640A]" />
            </div>
            Notifications
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-[#E8640A] text-white rounded-full px-2 py-0.5 text-xs animate-pulse">
                {unreadCount} New
              </Badge>
            )}
          </h1>
          <p className="text-[#9CA3AF] mt-2">Stay updated on your booking status and account activity.</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#9CA3AF] hover:text-white hover:bg-white/5 rounded-full"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications?.length === 0 ? (
          <div className="p-16 border border-[#2E2E2E] bg-[#1A1A1A] rounded-3xl text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#202020] flex items-center justify-center mx-auto text-[#4B4B4B]">
              <Bell className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold text-lg">No notifications yet</p>
              <p className="text-[#9CA3AF]">When you get updates about your bookings, they'll show up here.</p>
            </div>
          </div>
        ) : (
          notifications?.map((notification) => (
            <Card 
              key={notification.id} 
              className={`relative bg-[#1A1A1A] border-[#2E2E2E] p-5 overflow-hidden group transition-all duration-300 hover:border-[#E8640A]/30 cursor-pointer ${!notification.is_read ? 'border-l-4 border-l-[#E8640A]' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-emerald-500/10' :
                  notification.type === 'warning' ? 'bg-yellow-500/10' :
                  notification.type === 'error' ? 'bg-red-500/10' : 'bg-blue-500/10'
                }`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 space-y-1 pr-8">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold ${!notification.is_read ? 'text-white' : 'text-[#9CA3AF]'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] text-[#4B4B4B] font-medium flex items-center gap-1 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {notification.metadata?.booking_id && (
                     <div className="pt-3">
                        <Button variant="outline" size="sm" className="h-8 border-[#2E2E2E] text-xs hover:border-[#E8640A]/50 hover:bg-[#E8640A]/5 rounded-full" onClick={(e) => {
                          e.stopPropagation();
                          navigate('/dashboard/user'); // Or appropriate path
                        }}>
                          View Booking Details
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                     </div>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
                  {!notification.is_read && (
                    <Circle className="w-2 h-2 fill-[#E8640A] text-[#E8640A]" />
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-[#4B4B4B] hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotificationMutation.mutate(notification.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Simple dummy Clock component to satisfy icons
const Clock = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Notifications;
