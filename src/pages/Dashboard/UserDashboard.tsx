import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Package, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  preferred_date: string;
  property_address: string;
  property_type: string;
  cancel_reason?: string;
  rejection_reason?: string;
  jobs: {
    title: string;
    location: string;
    service_types?: {
      name: string;
    }
  };
}

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          jobs:job_id (
            title, 
            location,
            service_types:service_type_id (name)
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'confirmed': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Confirmed</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Completed</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Rejected</Badge>;
    }
  };

  const activeBookings = bookings?.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status)) || [];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#2E2E2E]">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white tracking-tight">Hello, {profile?.full_name?.split(' ')[0] ?? 'User'}!</h2>
          <p className="text-[#9CA3AF]">
            {activeBookings.length > 0 
              ? `You have ${activeBookings.length} active service bookings.` 
              : "Welcome to your personal dashboard."}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/jobs')}
          className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-[#E8640A]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Book New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#E8640A]" />
              Your Service History
            </h3>
            
            {isLoading ? (
              <div className="p-12 border border-[#2E2E2E] bg-[#1A1A1A] rounded-3xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#E8640A] animate-spin" />
              </div>
            ) : bookings?.length === 0 ? (
              <div className="p-16 border border-[#2E2E2E] bg-[#1A1A1A] rounded-3xl text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-[#202020] flex items-center justify-center mx-auto text-[#4B4B4B]">
                  <Package className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold text-lg">No bookings yet</p>
                  <p className="text-[#9CA3AF]">Your scheduled services and history will appear here.</p>
                </div>
                <Button variant="outline" className="rounded-full border-[#E8640A]/20 text-[#E8640A] hover:bg-[#E8640A]/5 mt-4" onClick={() => navigate('/dashboard/jobs')}>
                  Browse Public Catalog
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings?.map((booking) => (
                  <Card key={booking.id} className="bg-[#1A1A1A] border-[#2E2E2E] shadow-xl hover:border-[#E8640A]/30 transition-all group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="text-lg font-bold text-white group-hover:text-[#E8640A] transition-colors">{booking.jobs.title}</h4>
                              <p className="text-[10px] text-[#4B4B4B] font-bold uppercase tracking-widest">Job ID: {booking.id.slice(0, 8)}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#2E2E2E] pt-4">
                            <InfoItem 
                              icon={<Calendar className="w-4 h-4" />} 
                              label="Date" 
                              value={booking.preferred_date ? format(new Date(booking.preferred_date), 'MMM dd, yyyy') : 'TBD'} 
                            />
                            <InfoItem 
                              icon={<MapPin className="w-4 h-4" />} 
                              label="Property" 
                              value={booking.property_address || 'Not specified'} 
                            />
                            <InfoItem 
                              icon={<ShieldCheck className="w-4 h-4" />} 
                              label="Service" 
                              value={booking.jobs.service_types?.name || 'Standard'} 
                            />
                          </div>

                          {(booking.status === 'rejected' || booking.status === 'cancelled') && (booking.rejection_reason || booking.cancel_reason) && (
                            <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-3">
                              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Note from Admin</p>
                                <p className="text-sm text-red-400 italic">"{booking.rejection_reason || booking.cancel_reason}"</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="w-full md:w-12 bg-[#202020] border-l border-[#2E2E2E] flex items-center justify-center group-hover:bg-[#E8640A]/5 transition-colors cursor-pointer" title="View details">
                          <ChevronRight className="w-5 h-5 text-[#4B4B4B] group-hover:text-[#E8640A] transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#1A1A1A] border-[#2E2E2E] shadow-2xl sticky top-28 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8640A]/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <CardHeader className="relative">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E8640A]" />
                Profile Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-2 space-y-6">
              <div className="p-5 rounded-2xl bg-[#E8640A]/10 border border-[#E8640A]/20 shadow-inner group">
                <p className="text-[10px] font-bold text-[#E8640A] uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">Account Level</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E8640A] animate-pulse" />
                  <p className="text-sm text-white font-black capitalize tracking-tight">{profile?.role}</p>
                </div>
              </div>
              
              <div className="space-y-4 px-1">
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {profile?.role === 'user' 
                    ? "Complete your first booking to be upgraded to a Client role and unlock prioritized scheduling." 
                    : "You are a registered Client. You have access to detailed reports and historical property data."}
                </p>
                
                <div className="pt-4 border-t border-[#2E2E2E]">
                  <div className="flex items-center justify-between mb-2">
                     <p className="text-[10px] text-[#4B4B4B] uppercase tracking-widest font-black">Membership Tier</p>
                     <span className="text-[10px] text-[#E8640A] font-bold">
                        {profile?.role === 'user' ? 'Lvl 1' : 'Lvl 2'}
                     </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#2E2E2E] rounded-full overflow-hidden p-[2px]">
                    <div className={`h-full rounded-full bg-gradient-to-r from-[#E8640A] to-[#FF8C3A] transition-all duration-1000 glass-glow ${profile?.role === 'user' ? 'w-1/3 shadow-[0_0_10px_rgba(232,100,10,0.5)]' : 'w-full shadow-[0_0_15px_rgba(232,100,10,0.8)]'}`} />
                  </div>
                  <div className="flex justify-between mt-3 px-0.5">
                    <span className={`text-[10px] font-black tracking-tighter ${profile?.role === 'user' ? 'text-white' : 'text-[#4B4B4B]'}`}>STANDARD USER</span>
                    <span className={`text-[10px] font-black tracking-tighter ${profile?.role === 'client' ? 'text-[#E8640A]' : 'text-[#4B4B4B]'}`}>VERIFIED CLIENT</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-[#4B4B4B]">
      {icon}
      <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
    </div>
    <p className="text-sm text-white font-medium truncate max-w-[140px]">{value}</p>
  </div>
);

export default UserDashboard;
