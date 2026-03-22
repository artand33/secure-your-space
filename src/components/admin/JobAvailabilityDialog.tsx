import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Plus, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const formSchema = z.object({
  is_ongoing: z.boolean().default(true),
  available_from: z.string().optional(),
  available_until: z.string().optional(),
  exception_dates: z.array(z.string()).default([]),
});

interface JobAvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
}

const JobAvailabilityDialog = ({ open, onOpenChange, job }: JobAvailabilityDialogProps) => {
  const queryClient = useQueryClient();
  const [newExceptionDate, setNewExceptionDate] = useState('');

  const { data: availability, isLoading } = useQuery({
    queryKey: ['job_availability', job?.id],
    queryFn: async () => {
      if (!job) return null;
      const { data, error } = await supabase
        .from('job_availability')
        .select('*')
        .eq('job_id', job.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!job && open,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_ongoing: true,
      available_from: '',
      available_until: '',
      exception_dates: [],
    },
  });

  useEffect(() => {
    if (availability) {
      form.reset({
        is_ongoing: availability.is_ongoing ?? true,
        available_from: availability.available_from ? availability.available_from.split('T')[0] : '',
        available_until: availability.available_until ? availability.available_until.split('T')[0] : '',
        exception_dates: availability.exception_dates || [],
      });
    } else {
      form.reset({
        is_ongoing: true,
        available_from: '',
        available_until: '',
        exception_dates: [],
      });
    }
  }, [availability, form, open]);

  const upsertMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!job) return;

      const payload = {
        job_id: job.id,
        is_ongoing: values.is_ongoing,
        available_from: values.available_from ? new Date(values.available_from).toISOString() : null,
        available_until: values.available_until ? new Date(values.available_until).toISOString() : null,
        exception_dates: values.exception_dates,
      };

      if (availability?.id) {
        const { error } = await supabase
          .from('job_availability')
          .update(payload)
          .eq('id', availability.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('job_availability')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_availability', job?.id] });
      toast.success('Availability rules updated successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error('Failed to update availability: ' + error.message);
    }
  });

  const handleAddException = () => {
    if (!newExceptionDate) return;
    const current = form.getValues('exception_dates');
    if (!current.includes(newExceptionDate)) {
      form.setValue('exception_dates', [...current, newExceptionDate].sort());
    }
    setNewExceptionDate('');
  };

  const handleRemoveException = (dateToRemove: string) => {
    const current = form.getValues('exception_dates');
    form.setValue('exception_dates', current.filter(d => d !== dateToRemove));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertMutation.mutate(values);
  };

  const isOngoing = form.watch('is_ongoing');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#1A1A1A] border-[#2E2E2E] text-white flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E8640A]" />
            Manage Schedule for {job?.title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-[#E8640A] animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col min-h-0">
              
              <div className="overflow-y-auto pr-4 space-y-6 min-h-0">
                <div className="p-4 rounded-xl bg-[#202020] border border-[#2E2E2E] flex items-center justify-between">
                <div>
                  <FormLabel className="text-white font-bold text-base">Ongoing Subscriptions</FormLabel>
                  <p className="text-xs text-[#9CA3AF] mt-1">Leaves the job continuously bookable without an end date.</p>
                </div>
                <FormField
                  control={form.control}
                  name="is_ongoing"
                  render={({ field }) => (
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#E8640A]"
                      />
                    </FormControl>
                  )}
                />
              </div>

              {!isOngoing && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                  <FormField
                    control={form.control}
                    name="available_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available From</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-[#0D0D0D] border-[#2E2E2E] text-white" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="available_until"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Until</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-[#0D0D0D] border-[#2E2E2E] text-white" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-[#2E2E2E]">
                <div className="flex justify-between items-end">
                  <div className="space-y-1 w-full">
                    <FormLabel>Exception Dates (Blackouts)</FormLabel>
                    <FormDescription className="text-xs text-[#9CA3AF]">Select dates when teams cannot accept bookings.</FormDescription>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        type="date" 
                        value={newExceptionDate} 
                        onChange={(e) => setNewExceptionDate(e.target.value)} 
                        className="bg-[#0D0D0D] border-[#2E2E2E] text-white" 
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleAddException}
                        className="bg-[#2E2E2E] hover:bg-[#3E3E3E] text-white shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.watch('exception_dates').map((dateStr) => (
                    <div key={dateStr} className="flex items-center gap-2 bg-[#E8640A]/10 text-[#E8640A] px-3 py-1.5 rounded-full text-sm font-medium border border-[#E8640A]/20 transition-all hover:bg-[#E8640A]/20">
                      <span>{dateStr}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveException(dateStr)}
                        className="hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {form.watch('exception_dates').length === 0 && (
                     <p className="text-xs text-[#4B4B4B] italic">No blackout dates added.</p>
                  )}
                </div>
              </div>
              </div>

              <DialogFooter className="pt-4 border-t border-[#2E2E2E] shrink-0">
                <Button 
                  type="submit" 
                  disabled={upsertMutation.isPending} 
                  className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full w-full font-bold"
                >
                  {upsertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Availability Rules
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobAvailabilityDialog;
