import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar, Briefcase, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="128" icon={<Users className="w-5 h-5" />} trend="+12% from last month" />
        <StatCard title="Active Jobs" value="24" icon={<Briefcase className="w-5 h-5" />} trend="+3 ongoing today" />
        <StatCard title="Pending Bookings" value="7" icon={<Calendar className="w-5 h-5" />} trend="Requires action" highlight />
        <StatCard title="System Alerts" value="2" icon={<AlertTriangle className="w-5 h-5" />} trend="Check logs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#1A1A1A] border-[#2E2E2E] shadow-xl overflow-hidden">
          <CardHeader className="border-b border-[#2E2E2E] h-14 flex items-center justify-center">
            <CardTitle className="text-white text-base">Recent Activity Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#2E2E2E]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 p-6 hover:bg-[#202020] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#E8640A]/10 flex items-center justify-center text-[#E8640A] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">New user signed up: John Smith</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">2 hours ago • user_role: user • IP: 192.168.1.1</p>
                  </div>
                </div>
              ))}
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

const StatCard = ({ title, value, icon, trend, highlight }: any) => (
  <Card className={`bg-[#1A1A1A] border-[#2E2E2E] overflow-hidden group transition-all duration-300 hover:translate-y-[-4px] ${highlight ? 'ring-1 ring-[#E8640A]/50 shadow-[0_0_20px_rgba(232,100,10,0.1)]' : 'shadow-lg'}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
      <CardTitle className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">{title}</CardTitle>
      <div className={`p-2.5 rounded-xl transition-colors duration-300 ${highlight ? 'bg-[#E8640A] text-white' : 'bg-[#2E2E2E] text-[#9CA3AF] group-hover:bg-[#E8640A]/10 group-hover:text-[#E8640A]'}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent className="px-6 pb-6">
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <p className={`text-xs font-medium ${highlight ? 'text-[#E8640A]' : 'text-[#9CA3AF]'}`}>{trend}</p>
    </CardContent>
  </Card>
);

export default AdminDashboard;
