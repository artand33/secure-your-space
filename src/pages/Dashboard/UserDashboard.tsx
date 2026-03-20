import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#2E2E2E]">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white tracking-tight">Hello, {profile?.full_name?.split(' ')[0] ?? 'User'}!</h2>
          <p className="text-[#9CA3AF]">You have 2 upcoming service visits scheduled.</p>
        </div>
        <Button className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-[#E8640A]/20 transition-all hover:scale-105 active:scale-95">
          Book New Service
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Active Service Bookings</h3>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="bg-[#1A1A1A] border-[#2E2E2E] shadow-xl hover:border-[#3E3E3E] transition-colors group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-32 h-32 rounded-2xl bg-[#2E2E2E] flex items-center justify-center text-[#E8640A] shrink-0 group-hover:bg-[#E8640A]/10 transition-colors">
                        <Package className="w-10 h-10" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="text-lg font-bold text-white">CCTV Annual Maintenance</h4>
                            <p className="text-sm text-[#9CA3AF]">Booking ID: #BK-1002{i}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            Confirmed
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date" value="Oct 24, 2026" />
                          <InfoItem icon={<Clock className="w-4 h-4" />} label="Time" value="10:00 AM" />
                          <InfoItem icon={<MapPin className="w-4 h-4" />} label="Location" value="Main Office" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#1A1A1A] border-[#2E2E2E] shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-white text-base">Your Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-6">
              <div className="p-5 rounded-2xl bg-[#E8640A]/10 border border-[#E8640A]/20 shadow-inner">
                <p className="text-[10px] font-bold text-[#E8640A] uppercase tracking-widest mb-2">Account Role</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E8640A] animate-pulse" />
                  <p className="text-sm text-white font-bold capitalize">{profile?.role}</p>
                </div>
              </div>
              <div className="space-y-4 px-1">
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {profile?.role === 'user' 
                    ? "Welcome! Complete your first booking to become a registered Client and unlock more features." 
                    : "You are a registered Client. Enjoy prioritized support and detailed property analytics."}
                </p>
                <div className="pt-4 border-t border-[#2E2E2E]">
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest mb-4">Membership Progress</p>
                  <div className="h-1.5 w-full bg-[#2E2E2E] rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-[#E8640A] to-[#FF8C3A] transition-all duration-1000 ${profile?.role === 'user' ? 'w-1/3' : 'w-full'}`} />
                  </div>
                  <div className="flex justify-between mt-2 px-0.5">
                    <span className={`text-[10px] font-bold ${profile?.role === 'user' ? 'text-white' : 'text-[#9CA3AF]'}`}>User</span>
                    <span className={`text-[10px] font-bold ${profile?.role !== 'admin' && profile?.role !== 'user' ? 'text-white' : 'text-[#9CA3AF]'}`}>Client</span>
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
    <div className="flex items-center gap-1.5 text-[#9CA3AF]">
      {icon}
      <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
    </div>
    <p className="text-sm text-white font-medium">{value}</p>
  </div>
);

export default UserDashboard;
