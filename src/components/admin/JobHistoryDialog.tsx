import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Clock, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  published: 'bg-green-500/10 text-green-500 border-green-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

interface JobHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
}

const JobHistoryDialog = ({ open, onOpenChange, job }: JobHistoryDialogProps) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['job_history', job?.id],
    queryFn: async () => {
      if (!job) return [];
      const { data, error } = await supabase
        .from('job_history')
        .select(`
          *,
          changed_by_profile:profiles!job_history_changed_by_fkey(full_name, email)
        `)
        .eq('job_id', job.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!job && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#1A1A1A] border-[#2E2E2E] text-white flex flex-col max-h-[90vh] mt-16 sm:mt-10 overflow-hidden">
        <DialogHeader className="pb-4 border-b border-[#2E2E2E]">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#E8640A]" />
            Status History for {job?.title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-[#E8640A] animate-spin" />
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh] pr-2 space-y-6 pt-4">
            {history?.length === 0 ? (
              <p className="text-center text-[#9CA3AF] text-sm py-4">No history records found for this job.</p>
            ) : (
              <div className="relative border-l border-[#2E2E2E] ml-4 pl-6 space-y-6">
                {history?.map((item: any) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[31px] mt-1.5 w-3 h-3 rounded-full bg-[#E8640A] border-2 border-[#1A1A1A]" />
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.old_status ? (
                          <>
                            <Badge className={`${statusColors[item.old_status]} text-[10px] uppercase font-bold`}>
                              {item.old_status.replace('_', ' ')}
                            </Badge>
                            <ArrowRight className="w-3 h-3 text-[#4B4B4B]" />
                          </>
                        ) : null}
                        <Badge className={`${statusColors[item.new_status]} text-[10px] uppercase font-bold`}>
                          {item.new_status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-sm text-white font-medium">{item.reason || 'No description'}</p>

                      <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#E8640A]" />
                          <span>{item.changed_by_profile?.full_name || 'System / Admin'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#E8640A]" />
                          <span>{format(new Date(item.created_at), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobHistoryDialog;
