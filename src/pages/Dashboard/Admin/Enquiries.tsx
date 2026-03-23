import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { 
  MessageSquare, 
  Loader2, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ExternalLink, 
  MoreVertical, 
  CheckCircle2, 
  User,
  Filter,
  RefreshCcw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  conversion_tracking?: any;
  created_at: string;
}

const statusConfig = {
  new: { label: 'New', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  contacted: { label: 'Contacted', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  converted: { label: 'Converted', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  closed: { label: 'Closed', className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' }
};

const Enquiries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const queryClient = useQueryClient();

  const { data: enquiries, isLoading, isFetching } = useQuery({
    queryKey: ['admin-enquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch enquiries');
        throw error;
      }
      return data as Enquiry[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Enquiry['status'] }) => {
      const { error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] });
      toast.success(`Enquiry marked as ${variables.status}`);
      if (selectedEnquiry && selectedEnquiry.id === variables.id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: variables.status });
      }
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const handleStatusChange = (id: string, status: Enquiry['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  const filteredEnquiries = enquiries?.filter(enquiry => {
    const matchesSearch = 
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enquiry.phone && enquiry.phone.includes(searchQuery));
    
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countByStatus = (status: string) => {
    return enquiries?.filter(e => e.status === status).length || 0;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#2E2E2E]">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
            <MessageSquare className="w-8 h-8 text-[#E8640A] drop-shadow-[0_0_15px_rgba(232,100,10,0.3)]" />
            Client Enquiries & Leads
          </h1>
          <p className="text-[#9CA3AF]">Manage and track all incoming web leads and messages.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-xl border border-[#2E2E2E]">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#9CA3AF] hover:text-white"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-enquiries'] })}
            disabled={isFetching}
          >
            <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Summary overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Leads" count={enquiries?.length || 0} active />
        <StatsCard title="New" count={countByStatus('new')} color="yellow" />
        <StatsCard title="Contacted" count={countByStatus('contacted')} color="blue" />
        <StatsCard title="Converted" count={countByStatus('converted')} color="green" />
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#141414] p-4 rounded-2xl border border-[#2E2E2E] shadow-inner">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B4B4B]" />
          <Input 
            placeholder="Search leads by name, email, phone..." 
            className="pl-10 bg-[#1A1A1A] border-[#2E2E2E] text-white placeholder:text-[#4B4B4B] rounded-xl focus-visible:ring-[#E8640A]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
          <FilterButton label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} count={enquiries?.length || 0} />
          <FilterButton label="New" active={statusFilter === 'new'} onClick={() => setStatusFilter('new')} count={countByStatus('new')} color="yellow" />
          <FilterButton label="Contacted" active={statusFilter === 'contacted'} onClick={() => setStatusFilter('contacted')} count={countByStatus('contacted')} color="blue" />
          <FilterButton label="Converted" active={statusFilter === 'converted'} onClick={() => setStatusFilter('converted')} count={countByStatus('converted')} color="red" />
          <FilterButton label="Closed" active={statusFilter === 'closed'} onClick={() => setStatusFilter('closed')} count={countByStatus('closed')} color="gray" />
        </div>
      </div>

      {/* Inquiries list content */}
      {isLoading ? (
        <div className="p-16 border border-[#2E2E2E] bg-[#1A1A1A] rounded-3xl flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#E8640A] animate-spin" />
          <p className="text-[#9CA3AF] text-sm animate-pulse">Loading leads dashboard...</p>
        </div>
      ) : !filteredEnquiries || filteredEnquiries.length === 0 ? (
        <div className="p-20 border border-[#2E2E2E] bg-[#1A1A1A] rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#202020] flex items-center justify-center mx-auto text-[#4B4B4B]">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold text-lg">No leads found</p>
            <p className="text-[#9CA3AF] text-sm max-w-sm mx-auto">There are no inquiries matching your current filters or search query.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnquiries.map((enquiry) => {
            const config = statusConfig[enquiry.status];
            return (
              <Card 
                key={enquiry.id} 
                className="bg-[#1A1A1A] border-[#2E2E2E] shadow-xl hover:border-[#E8640A]/30 transition-all duration-300 group overflow-hidden cursor-pointer flex flex-col h-full"
                onClick={() => setSelectedEnquiry(enquiry)}
              >
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Card Header information */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-1 flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#E8640A] transition-colors line-clamp-1">{enquiry.name}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-[#4B4B4B] font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(enquiry.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <Badge variant="outline" className={`${config.className} rounded-full px-2 py-0 border capitalize shrink-0`}>
                      {config.label}
                    </Badge>
                  </div>

                  {/* Quick Contacts details */}
                  <div className="space-y-2 mb-4 text-[#9CA3AF] text-sm flex-1">
                    <div className="flex items-center gap-2 truncate" title={enquiry.email}>
                      <Mail className="w-4 h-4 text-[#E8640A] shrink-0" />
                      <span className="truncate">{enquiry.email}</span>
                    </div>
                    {enquiry.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#E8640A] shrink-0" />
                        <span>{enquiry.phone}</span>
                      </div>
                    )}
                    
                    {enquiry.message && (
                      <div className="mt-3 p-3 rounded-lg bg-[#222222] border border-white/5 text-xs text-[#BCBCBC] italic line-clamp-3">
                        "{enquiry.message}"
                      </div>
                    )}
                  </div>

                  {/* Actions footer component */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#2E2E2E] mt-auto">
                    <Button 
                      variant="link" 
                      className="text-[#E8640A] p-0 h-auto font-bold uppercase text-[10px] tracking-widest flex items-center gap-1 group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnquiry(enquiry);
                      }}
                    >
                      View Full Lead
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>

                    {/* Quick status cycle trigger */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#4B4B4B] hover:text-[#E8640A] hover:bg-white/5 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1A1A1A] border border-[#2E2E2E] text-white rounded-xl shadow-2xl">
                          <DropdownMenuLabel className="text-[#4B4B4B] text-[10px] font-bold uppercase tracking-widest">Update status</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                          <DropdownMenuItem onClick={() => handleStatusChange(enquiry.id, 'new')} className="text-yellow-500 gap-2 focus:bg-yellow-500/10 focus:text-yellow-500 cursor-pointer">
                            Mark as New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(enquiry.id, 'contacted')} className="text-blue-500 gap-2 focus:bg-blue-500/10 focus:text-blue-500 cursor-pointer">
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(enquiry.id, 'converted')} className="text-green-500 gap-2 focus:bg-green-500/10 focus:text-green-500 cursor-pointer">
                            Mark as Converted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(enquiry.id, 'closed')} className="text-gray-400 gap-2 focus:bg-white/5 focus:text-white cursor-pointer">
                            Close Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Details View Dialog/Modal */}
      <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
        <DialogContent className="bg-[#131313] border-[#2E2E2E] text-white max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
          {selectedEnquiry && (
            <>
              <DialogHeader className="p-6 pb-0">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`${statusConfig[selectedEnquiry.status].className} rounded-full capitalize`}>
                    {statusConfig[selectedEnquiry.status].label}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-bold font-display text-white mt-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#E8640A]" />
                  {selectedEnquiry.name}
                </DialogTitle>
                <DialogDescription className="text-[#9CA3AF] text-xs">
                  Inquiry submitted on {format(new Date(selectedEnquiry.created_at), 'MMM dd, yyyy `at` HH:mm')}
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* Contact information sections */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1A1A1A] rounded-xl border border-white/5 space-y-1">
                    <p className="text-[10px] text-[#4B4B4B] uppercase tracking-widest font-black">Email</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-white text-sm font-semibold hover:text-[#E8640A] truncate block">{selectedEnquiry.email}</a>
                  </div>
                  <div className="p-4 bg-[#1A1A1A] rounded-xl border border-white/5 space-y-1">
                    <p className="text-[10px] text-[#4B4B4B] uppercase tracking-widest font-black">Phone</p>
                    {selectedEnquiry.phone ? (
                      <a href={`tel:${selectedEnquiry.phone}`} className="text-white text-sm font-semibold hover:text-[#E8640A] block">{selectedEnquiry.phone}</a>
                    ) : (
                      <p className="text-[#4B4B4B] text-sm">N/A</p>
                    )}
                  </div>
                </div>

                {/* Message descriptions cards */}
                <div className="space-y-1">
                  <p className="text-[10px] text-[#4B4B4B] uppercase tracking-widest font-black">Client Message</p>
                  <div className="p-5 bg-[#141414] rounded-xl border border-[#2E2E2E] text-sm text-[#E2E2E2] leading-relaxed max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                    {selectedEnquiry.message || "No message left."}
                  </div>
                </div>

                {/* Tracking / Internal Notes if present */}
                {selectedEnquiry.conversion_tracking && Object.keys(selectedEnquiry.conversion_tracking).length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#4B4B4B] uppercase tracking-widest font-black">Conversion Tracking Info</p>
                    <pre className="p-4 bg-[#1A1A1A] rounded-xl border border-white/5 text-xs text-[#9CA3AF] overflow-x-auto">
                      {JSON.stringify(selectedEnquiry.conversion_tracking, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Speed status dialer layout */}
                <div className="flex gap-2 pt-2">
                  {['new', 'contacted', 'converted', 'closed'].map((status) => {
                    const active = selectedEnquiry.status === status;
                    return (
                      <Button 
                        key={status}
                        variant="outline" 
                        size="sm"
                        className={`flex-1 rounded-xl capitalize font-bold text-xs ${active ? 'bg-[#E8640A] text-white border-transparent' : 'border-[#2E2E2E] text-[#9CA3AF] hover:bg-white/5'}`}
                        onClick={() => handleStatusChange(selectedEnquiry.id, status as any)}
                        disabled={updateStatusMutation.isPending}
                      >
                        {status === 'converted' && <CheckCircle2 className="w-4 h-4 mr-1 hidden sm:inline" />}
                        {status}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* Micro-Components for Layout definitions */
const StatsCard = ({ title, count, active, color }: { title: string; count: number; active?: boolean; color?: string }) => {
  let colorClass = 'border-[#2E2E2E] bg-[#1A1A1A] text-white';
  if (color === 'yellow') colorClass = 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500';
  if (color === 'blue') colorClass = 'border-blue-500/20 bg-blue-500/5 text-blue-500';
  if (color === 'green') colorClass = 'border-green-500/20 bg-green-500/5 text-green-500';

  return (
    <div className={`p-5 rounded-2xl border ${colorClass} shadow-md overflow-hidden relative group transition-all hover:scale-[1.02] duration-300`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />
      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</p>
      <p className="text-3xl font-extrabold mt-2 tracking-tighter">{count}</p>
    </div>
  );
};

const FilterButton = ({ label, active, onClick, count, color }: { label: string; active: boolean; onClick: () => void; count: number; color?: string }) => {
  const base = "rounded-xl text-xs font-bold gap-2 px-4 h-9 flex items-center transition-all";
  let activeStyle = "bg-[#202020] text-[#E8640A] border-[#E8640A]/30 border shadow-[0_0_15px_rgba(232,100,10,0.1)]";
  let inactiveStyle = "bg-[#1A1A1A] border border-[#2E2E2E] text-[#9CA3AF] hover:bg-[#202020] hover:text-white";

  if (active) {
    if (color === 'yellow') activeStyle = "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
    if (color === 'blue') activeStyle = "bg-blue-500/10 text-blue-500 border-blue-500/30";
    if (color === 'green') activeStyle = "bg-green-500/10 text-green-500 border-green-500/30";
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`${base} ${active ? activeStyle : inactiveStyle} shrink-0`}
      onClick={onClick}
    >
      {label}
      <span className={`text-[10px] items-center justify-center flex font-black h-5 w-5 rounded-full ${active ? 'bg-current text-white scale-110' : 'bg-[#2E2E2E] text-[#4B4B4B]'} flex items-center justify-center transition-all`}>
        {count}
      </span>
    </Button>
  );
};

export default Enquiries;
