import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  CalendarCheck, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  MoreVertical,
  MapPin,
  Clock,
  User as UserIcon,
  Home,
  FileText,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Eye,
  Camera,
  MessageSquare,
  Briefcase,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';

interface Booking {
  id: string;
  created_at: string;
  status: BookingStatus;
  client_id: string;
  job_id: string;
  preferred_date: string;
  property_address: string;
  property_type: string;
  client_notes: string;
  property_photo_urls: string[];
  rejection_reason?: string;
  cancel_reason?: string;
  profiles: {
    full_name: string;
    avatar_url: string;
    email?: string;
    phone_number?: string;
  };
  jobs: {
    title: string;
    location: string;
  };
}

const AllBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reason, setReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [actionType, setActionType] = useState<'reject' | 'cancel' | 'reschedule' | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:client_id (full_name, avatar_url, email, phone_number),
          jobs:job_id (title, location)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Booking[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, reason, newDate }: { id: string, status?: BookingStatus, reason?: string, newDate?: string }) => {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (status === 'rejected') updateData.rejection_reason = reason;
      if (status === 'cancelled') updateData.cancel_reason = reason;
      if (newDate) updateData.preferred_date = newDate;

      const { error: updateError } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Extract original status fallback in case of reschedule
      const finalStatus = status || selectedBooking?.status || 'pending';

      if (user?.id) {
        let logReason = reason;
        if (!logReason && newDate) {
          logReason = `Admin rescheduled date to ${format(new Date(newDate), 'PPP')}`;
        }
        
        await supabase.from('booking_history').insert([{
           booking_id: id,
           new_status: finalStatus,
           changed_by: user.id,
           reason: logReason || `Status updated to ${finalStatus}`
        }]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking updated successfully');
      setIsActionDialogOpen(false);
      setReason('');
      setNewDate('');
      setActionType(null);
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleAction = (status: BookingStatus | 'reschedule') => {
    if (!selectedBooking) return;

    if (status === 'confirmed') {
      updateStatusMutation.mutate({ id: selectedBooking.id, status: 'confirmed' });
    } else {
      setActionType(status === 'rejected' ? 'reject' : status === 'cancelled' ? 'cancel' : 'reschedule');
      if (status === 'reschedule') setNewDate(selectedBooking.preferred_date || '');
      setIsActionDialogOpen(true);
    }
  };

  const confirmAction = () => {
    if (!selectedBooking || !actionType) return;
    
    if (actionType !== 'reschedule' && !reason.trim()) {
      toast.error('A reason is required for rejects or cancellations');
      return;
    }
    
    if (actionType === 'reschedule' && !newDate) {
      toast.error('A new date is required for rescheduling');
      return;
    }

    updateStatusMutation.mutate({ 
      id: selectedBooking.id, 
      status: actionType === 'reject' ? 'rejected' : actionType === 'cancel' ? 'cancelled' : undefined,
      reason,
      newDate: actionType === 'reschedule' ? newDate : undefined
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'confirmed': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Confirmed</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Completed</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Rejected</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#E8640A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8640A]/10 flex items-center justify-center border border-[#E8640A]/20">
              <CalendarCheck className="w-6 h-6 text-[#E8640A]" />
            </div>
            All Bookings
          </h1>
          <p className="text-[#9CA3AF] mt-2">Oversee and manage client bookings across the entire system.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bookings?.length === 0 ? (
          <div className="p-16 border border-[#2E2E2E] bg-[#1A1A1A] rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#202020] flex items-center justify-center mx-auto text-[#4B4B4B]">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <p className="text-[#9CA3AF] text-lg">No bookings found in the system yet.</p>
          </div>
        ) : (
          bookings?.map((booking) => (
            <Card key={booking.id} className="bg-[#1A1A1A] border-[#2E2E2E] overflow-hidden group hover:border-[#E8640A]/30 transition-all duration-300">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                {/* User Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#202020] border border-[#2E2E2E] shrink-0">
                    {booking.profiles.avatar_url ? (
                      <img src={booking.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#4B4B4B]">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-none mb-1">{booking.profiles.full_name}</h3>
                    <p className="text-xs text-[#9CA3AF]">Status: {getStatusBadge(booking.status)}</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Job Details */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#4B4B4B] uppercase tracking-widest">Selected Job</p>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Briefcase className="w-4 h-4 text-[#E8640A]/60" />
                      {booking.jobs.title}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#4B4B4B] uppercase tracking-widest">Preferred Date</p>
                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                      <Clock className="w-4 h-4 text-[#E8640A]/60" />
                      {booking.preferred_date ? format(new Date(booking.preferred_date), 'PPP') : 'Not scheduled'}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#4B4B4B] uppercase tracking-widest">Location</p>
                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                      <MapPin className="w-4 h-4 text-[#E8640A]/60" />
                      <span className="truncate max-w-[150px]">{booking.property_address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 px-4 text-[#9CA3AF] hover:text-white hover:bg-white/5 rounded-full" onClick={() => setSelectedBooking(booking)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-[#1A1A1A] border-[#2E2E2E] text-white flex flex-col max-h-[90vh] overflow-hidden">
                      <DialogHeader className="shrink-0">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                          Booking Details
                          {booking.status && getStatusBadge(booking.status)}
                        </DialogTitle>
                        <DialogDescription className="text-[#9CA3AF]">
                          Review the full information for this booking request.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-6 border-y border-[#2E2E2E] overflow-y-auto min-h-0 pr-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[#4B4B4B] font-bold uppercase text-[10px] tracking-widest">Property Type</Label>
                            <div className="flex items-center gap-2 text-white font-medium bg-[#202020] p-3 rounded-xl border border-[#2E2E2E]">
                              <Home className="w-4 h-4 text-[#E8640A]" />
                              {booking.property_type || 'Residential'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#4B4B4B] font-bold uppercase text-[10px] tracking-widest">Preferred Schedule</Label>
                            <div className="flex items-center gap-2 text-white font-medium bg-[#202020] p-3 rounded-xl border border-[#2E2E2E]">
                              <Clock className="w-4 h-4 text-[#E8640A]" />
                              {booking.preferred_date ? format(new Date(booking.preferred_date), 'PPP') : 'TBD'}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#4B4B4B] font-bold uppercase text-[10px] tracking-widest">Full Address</Label>
                          <div className="flex items-start gap-2 text-white font-medium bg-[#202020] p-3 rounded-xl border border-[#2E2E2E]">
                            <MapPin className="w-4 h-4 text-[#E8640A] mt-1 shrink-0" />
                            {booking.property_address || 'Address not specified'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[#4B4B4B] font-bold uppercase text-[10px] tracking-widest">Client Email</Label>
                            <div className="flex items-center gap-2 text-white font-medium bg-[#202020] p-3 rounded-xl border border-[#2E2E2E] overflow-hidden">
                              <Mail className="w-4 h-4 text-[#E8640A] shrink-0" />
                              <span className="truncate">{booking.profiles?.email || 'No email provided'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#4B4B4B] font-bold uppercase text-[10px] tracking-widest">Client Phone</Label>
                            <div className="flex items-center gap-2 text-white font-medium bg-[#202020] p-3 rounded-xl border border-[#2E2E2E]">
                              <Phone className="w-4 h-4 text-[#E8640A] shrink-0" />
                              {booking.profiles?.phone_number || 'No phone provided'}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#4B4B4B] font-bold uppercase text-[10px] tracking-widest">Client Notes</Label>
                          <div className="flex items-start gap-2 text-[#9CA3AF] italic bg-[#202020] p-4 rounded-xl border border-[#2E2E2E] text-sm min-h-[80px]">
                            <MessageSquare className="w-4 h-4 text-[#E8640A] mt-1 shrink-0" />
                            {booking.client_notes || 'No notes provided by client.'}
                          </div>
                        </div>

                        {booking.property_photo_urls && booking.property_photo_urls.length > 0 && (
                          <div className="space-y-3">
                            <Label className="text-[#4B4B4B] font-bold uppercase text-[10px] tracking-widest">Property Photos</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {booking.property_photo_urls.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="group/photo relative aspect-square rounded-xl overflow-hidden border border-[#2E2E2E] hover:border-[#E8640A] transition-all">
                                  <img src={url} alt={`Upload ${i+1}`} className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {(booking.rejection_reason || booking.cancel_reason) && (
                          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                              <AlertTriangle className="w-4 h-4" />
                              {booking.status === 'rejected' ? 'Rejection Reason' : 'Cancellation Reason'}
                            </div>
                            <p className="text-red-400 text-sm italic">{booking.rejection_reason || booking.cancel_reason}</p>
                          </div>
                        )}
                      </div>

                      <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 shrink-0">
                        {booking.status === 'pending' && (
                          <div className="flex w-full gap-2 flex-wrap sm:flex-nowrap">
                            <Button
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 flex-1"
                              onClick={() => { setSelectedBooking(booking); handleAction('confirmed'); }}
                              disabled={updateStatusMutation.isPending}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              className="border-[#E8640A]/50 text-[#E8640A] hover:bg-[#E8640A]/10 rounded-full px-4 flex-1"
                              onClick={() => { setSelectedBooking(booking); handleAction('reschedule'); }}
                              disabled={updateStatusMutation.isPending}
                            >
                              Reschedule
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-full px-4 flex-1"
                              onClick={() => { setSelectedBooking(booking); handleAction('rejected'); }}
                              disabled={updateStatusMutation.isPending}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <div className="flex w-full gap-2 flex-wrap sm:flex-nowrap">
                            <Button
                              variant="outline"
                              className="border-[#E8640A]/50 text-[#E8640A] hover:bg-[#E8640A]/10 rounded-full px-6 flex-1"
                              onClick={() => { setSelectedBooking(booking); handleAction('reschedule'); }}
                              disabled={updateStatusMutation.isPending}
                            >
                              Reschedule
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 rounded-full px-6 flex-1"
                              onClick={() => { setSelectedBooking(booking); handleAction('cancelled'); }}
                              disabled={updateStatusMutation.isPending}
                            >
                              Cancel Job
                            </Button>
                          </div>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-[#4B4B4B] hover:text-white hover:bg-white/5 rounded-full">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1A1A1A] border border-[#2E2E2E] text-white p-2">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {booking.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(booking); updateStatusMutation.mutate({ id: booking.id, status: 'confirmed' }); }} className="focus:bg-green-500/10 focus:text-green-500 cursor-pointer">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(booking); handleAction('reschedule'); }} className="focus:bg-[#E8640A]/10 focus:text-[#E8640A] cursor-pointer">
                            <Clock className="w-4 h-4 mr-2" /> Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(booking); setActionType('reject'); setIsActionDialogOpen(true); }} className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(booking); handleAction('reschedule'); }} className="focus:bg-[#E8640A]/10 focus:text-[#E8640A] cursor-pointer">
                            <Clock className="w-4 h-4 mr-2" /> Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(booking); setActionType('cancel'); setIsActionDialogOpen(true); }} className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                            <XCircle className="w-4 h-4 mr-2" /> Cancel Job
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reject/Cancel/Reschedule Reason Modal */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2E2E2E] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'reschedule' ? (
                 <><CalendarCheck className="w-5 h-5 text-[#E8640A]" /> Reschedule Booking</>
              ) : (
                 <><AlertTriangle className="w-5 h-5 text-red-500" /> {actionType === 'reject' ? 'Reject Booking' : 'Cancel Booking'}</>
              )}
            </DialogTitle>
            <DialogDescription className="text-[#9CA3AF]">
              {actionType === 'reschedule' 
                ? 'Select a new date/time and optionally provide a reason for the client.'
                : `Please provide a reason for this ${actionType === 'reject' ? 'rejection' : 'cancellation'}. This will be visible to the client.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {actionType === 'reschedule' && (
              <div className="space-y-2">
                <Label htmlFor="newDate">New Date (Required)</Label>
                <Input 
                  id="newDate"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="bg-[#202020] border-[#2E2E2E] focus:ring-[#E8640A] h-12 text-white"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reason">{actionType === 'reschedule' ? 'Message to Client (Optional)' : 'Reason (Required)'}</Label>
              <Textarea
                id="reason"
                placeholder={actionType === 'reschedule' ? 'Add a note about why it was rescheduled...' : `Tell the client why this was ${actionType === 'reject' ? 'rejected' : 'cancelled'}...`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-[#202020] border-[#2E2E2E] focus:ring-[#E8640A] min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setIsActionDialogOpen(false); setReason(''); setNewDate(''); }} className="text-[#9CA3AF] hover:bg-white/5">
              Cancel
            </Button>
            <Button 
              className={actionType === 'reschedule' ? "bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full px-6" : "bg-red-600 hover:bg-red-700 text-white rounded-full px-6"}
              onClick={confirmAction}
              disabled={updateStatusMutation.isPending || (actionType !== 'reschedule' && !reason.trim()) || (actionType === 'reschedule' && !newDate)}
            >
              Confirm {actionType === 'reject' ? 'Rejection' : actionType === 'cancel' ? 'Cancellation' : 'Reschedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllBookings;
