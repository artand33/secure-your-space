import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Loader2, Edit2, Trash2, MapPin, Tag, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import JobDialog from '@/components/admin/JobDialog';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  published: 'bg-green-500/10 text-green-500 border-green-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const JobUnits = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['job_units_admin', statusFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          service_type:service_types(name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: serviceTypes } = useQuery({
    queryKey: ['service_types_list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_types')
        .select('id, name')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      const { data, error } = await supabase
        .from('jobs')
        .insert([newData])
        .select()
        .single();
      if (error) throw error;
      
      // Log creation
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase.from('job_history').insert([{
          job_id: data.id,
          new_status: data.status,
          changed_by: userData.user.id,
          reason: 'Initial job creation'
        }]);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_units_admin'] });
      toast.success('Job unit created successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create job unit: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, oldStatus, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      // Log status change if status changed
      if (oldStatus !== updateData.status) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.from('job_history').insert([{
            job_id: id,
            old_status: oldStatus,
            new_status: updateData.status,
            changed_by: userData.user.id,
            reason: 'Administrative update'
          }]);
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_units_admin'] });
      toast.success('Job unit updated successfully');
      setIsDialogOpen(false);
      setEditingJob(null);
    },
    onError: (error) => {
      toast.error('Failed to update job unit: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_units_admin'] });
      toast.success('Job unit deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete job unit: ' + error.message);
    }
  });

  const handleSubmit = (data: any) => {
    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, oldStatus: editingJob.status, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job unit? All associated data will be removed.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-[#E8640A]" />
            Job Units
          </h1>
          <p className="text-[#9CA3AF] mt-2">Manage your active and upcoming security service jobs.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingJob(null);
            setIsDialogOpen(true);
          }}
          className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full h-11 transition-all gap-2 px-6"
        >
          <Plus className="w-5 h-5" />
          Create Job
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1">
            <input 
              type="text"
              placeholder="Search jobs by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-2 text-white placeholder:text-[#4B4B4B] focus:outline-none focus:border-[#E8640A]/50 transition-all font-inter"
            />
         </div>
         <div className="flex gap-2 bg-[#1A1A1A] p-1 border border-[#2E2E2E] rounded-xl overflow-x-auto whitespace-nowrap scrollbar-hide">
            {['all', 'draft', 'published', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status 
                  ? 'bg-[#E8640A] text-white shadow-lg' 
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                }`}
              >
                {status.toUpperCase().replace('_', ' ')}
              </button>
            ))}
         </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-12 h-12 text-[#E8640A] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <div 
              key={job.id} 
              className="p-6 border border-[#2E2E2E] bg-[#1A1A1A] rounded-2xl flex flex-col hover:border-[#E8640A]/30 transition-all group overflow-hidden relative"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className={`${statusColors[job.status]} font-bold px-3 py-1 border`}>
                  {job.status.toUpperCase().replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(job)}
                    className="text-white hover:text-primary h-8 w-8"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(job.id)}
                    className="text-white hover:text-red-500 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-white line-clamp-1">{job.title}</h3>
                
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <Tag className="w-4 h-4 text-[#E8640A]" />
                      <span>{job.service_type?.name || 'Uncategorized'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                      <MapPin className="w-4 h-4 text-[#E8640A]" />
                      <span>{job.location || 'Site TBD'}</span>
                   </div>
                   {job.pricing_note && (
                     <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                        <Clock className="w-4 h-4 text-[#E8640A]" />
                        <span className="text-white font-medium">{job.pricing_note}</span>
                     </div>
                   )}
                </div>

                <p className="text-sm text-[#9CA3AF] line-clamp-2 mt-4">
                  {job.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E2E2E] flex justify-between items-center bg-[#1A1A1A]">
                <span className="text-[10px] text-[#4B4B4B] uppercase tracking-wider">
                  Slug: {job.slug}
                </span>
                <span className="text-[10px] text-[#4B4B4B]">
                   ID: ...{job.id.slice(-6)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {jobs?.length === 0 && !isLoading && (
        <div className="p-12 border-2 border-dashed border-[#2E2E2E] rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
          <Briefcase className="w-12 h-12 text-[#2E2E2E]" />
          <div>
            <h3 className="text-lg font-bold text-white">No jobs found</h3>
            <p className="text-[#9CA3AF]">Ready to secure spaces? Create your first job unit.</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="border-[#2E2E2E] text-white rounded-full transition-all"
          >
            Create Job Now
          </Button>
        </div>
      )}

      <JobDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingJob}
        title={editingJob ? 'Edit Job Unit' : 'Create New Job Unit'}
      />
    </div>
  );
};

export default JobUnits;
