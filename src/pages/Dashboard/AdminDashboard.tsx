import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar as CalendarIcon, Briefcase, AlertTriangle, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const StatCardSkeleton = () => (
  <Card className="bg-[#1A1A1A] border-[#2E2E2E] overflow-hidden shadow-lg p-6 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-20 bg-[#2A2A2A] rounded-full" />
      <Skeleton className="h-10 w-10 bg-[#2A2A2A] rounded-xl" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-8 w-14 bg-[#2A2A2A] rounded-md" />
      <Skeleton className="h-3 w-32 bg-[#2A2A2A] rounded-full" />
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // 📈 KPI Stats queries
  const { data: stats, isPending: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [{ count: users }, { count: activeJobs }, { count: pendingBookings }, { count: enquiries }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).in('status', ['published', 'in_progress']),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new')
      ]);
      return { users: users || 0, activeJobs: activeJobs || 0, pendingBookings: pendingBookings || 0, enquiries: enquiries || 0 };
    }
  });

  // 🗓️ Calendar Bookings Queries
  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-calendar-bookings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, jobs(title)')
        .order('preferred_date', { ascending: true });
      return data || [];
    }
  });

  // Modify calendar days carrying bookings
  const bookedDates = bookings
    .filter(b => b.preferred_date)
    .map(b => new Date(b.preferred_date));

  const selectedDateBookings = bookings.filter(b => 
    b.preferred_date && format(new Date(b.preferred_date), 'yyyy-MM-dd') === format(selectedDate || new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats?.users || 0} icon={<Users className="w-5 h-5" />} trend="Registered on system" />
          <StatCard title="Active Jobs" value={stats?.activeJobs || 0} icon={<Briefcase className="w-5 h-5" />} trend="Live vacancies right now" />
          <StatCard title="Pending Bookings" value={stats?.pendingBookings || 0} icon={<CalendarIcon className="w-5 h-5" />} trend="Requires action" highlight />
          <StatCard title="System Enquiries" value={stats?.enquiries || 0} icon={<AlertTriangle className="w-5 h-5" />} trend="New leads to handle" />
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#1A1A1A] border-[#2E2E2E] shadow-xl">
          <CardHeader className="border-b border-[#2E2E2E]">
            <CardTitle className="text-white text-base">Booking Schedule Calendar</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6">
            <div className="flex justify-center bg-[#1F1F1F] p-4 rounded-xl border border-[#2E2E2E]">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="text-white"
                modifiers={{ booked: bookedDates }}
                modifiersStyles={{
                  booked: { border: '2px solid #E8640A' }
                }}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-sm">Bookings for {selectedDate ? format(selectedDate, 'dd MMM yyyy') : 'Today'}</h3>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
                {selectedDateBookings.length === 0 ? (
                  <p className="text-[#9CA3AF] text-xs">No bookings scheduled for this date.</p>
                ) : (
                  selectedDateBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-bold text-sm truncate">{b.jobs?.title || 'Custom Service'}</p>
                        <Badge className={`${
                          b.status === 'confirmed' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                          b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          'bg-zinc-800 text-zinc-400'
                        } text-[10px] flex items-center gap-1`}>
                          <div className={`w-1 h-1 rounded-full ${
                            b.status === 'confirmed' ? 'bg-purple-500' :
                            b.status === 'pending' ? 'bg-yellow-500 animate-breathing' :
                            'bg-zinc-400'
                          }`} />
                          {b.status}
                        </Badge>

                      </div>
                      <p className="text-[11px] text-[#9CA3AF]">{b.property_address || 'No Address'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#2E2E2E] shadow-xl">
          <CardHeader className="border-b border-[#2E2E2E]">
            <CardTitle className="text-white text-base">Admin Privileges</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              As an admin, you have full access to manage service types, jobs, and user roles. You can grant or revoke access in the user management panel.
            </p>
            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 shadow-inner">
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <p className="text-sm text-white font-medium">Full Oversight Mode Active</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-[#2E2E2E] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-3/4" />
              </div>
              <p className="text-[10px] text-[#9CA3AF] uppercase text-right">Server Load: 75%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  highlight?: boolean;
}

const StatCard = ({ title, value, icon, trend, highlight }: StatCardProps) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <Card 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`bg-[#1A1A1A] border-[#2E2E2E] overflow-hidden group transition-all duration-300 hover:translate-y-[-4px] relative ${highlight ? 'ring-1 ring-[#E8640A]/50 shadow-[0_0_20px_rgba(232,100,10,0.1)]' : 'shadow-lg'}`}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(232, 100, 10, 0.05), transparent 70%)`
        }} 
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6 relative z-10">
        <CardTitle className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">{title}</CardTitle>
        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${highlight ? 'bg-[#E8640A] text-white' : 'bg-[#2E2E2E] text-[#9CA3AF] group-hover:bg-[#E8640A]/10 group-hover:text-[#E8640A]'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 relative z-10">
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        <p className={`text-xs font-medium ${highlight ? 'text-[#E8640A]' : 'text-[#9CA3AF]'}`}>{trend}</p>
      </CardContent>
    </Card>
  );
};


export default AdminDashboard;
