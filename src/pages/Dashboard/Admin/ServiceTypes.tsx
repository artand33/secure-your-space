import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Server, Plus, Loader2, Edit2, Trash2, Camera, Shield, Lock, Phone, Zap, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import ServiceTypeDialog from '@/components/admin/ServiceTypeDialog';

const iconMap: Record<string, React.ElementType> = {
  Camera, Shield, Lock, Phone, Server, Zap, HelpCircle
};

const ServiceTypes = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['service_types_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      const { data, error } = await supabase
        .from('service_types')
        .insert([newData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_types_admin'] });
      toast.success('Service type created successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create service type: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('service_types')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_types_admin'] });
      toast.success('Service type updated successfully');
      setIsDialogOpen(false);
      setEditingService(null);
    },
    onError: (error) => {
      toast.error('Failed to update service type: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_types_admin'] });
      toast.success('Service type deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete service type: ' + error.message);
    }
  });

  const handleSubmit = (data: any) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service type? This may affect existing jobs.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Server className="w-8 h-8 text-[#E8640A]" />
            Service Types
          </h1>
          <p className="text-[#9CA3AF] mt-2">Manage your security service categories here.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingService(null);
            setIsDialogOpen(true);
          }}
          className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full h-11 transition-all gap-2 px-6"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-12 h-12 text-[#E8640A] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service) => {
            const Icon = iconMap[service.icon_name] || Server;
            return (
              <div 
                key={service.id} 
                className="p-6 border border-[#2E2E2E] bg-[#1A1A1A] rounded-2xl flex flex-col hover:border-[#E8640A]/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#E8640A]/10 text-[#E8640A]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(service)}
                      className="text-white hover:text-primary h-8 w-8"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(service.id)}
                      className="text-white hover:text-red-500 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white line-clamp-1">{service.name}</h3>
                    {!service.is_active && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#9CA3AF] line-clamp-3 mb-4">
                    {service.description || 'No description available.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#2E2E2E] text-[12px] text-[#4B4B4B]">
                   <span>Order: {service.display_order}</span>
                   <span>ID: ...{service.id.slice(-6)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {services?.length === 0 && !isLoading && (
        <div className="p-12 border-2 border-dashed border-[#2E2E2E] rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
          <Server className="w-12 h-12 text-[#2E2E2E]" />
          <div>
            <h3 className="text-lg font-bold text-white">No services found</h3>
            <p className="text-[#9CA3AF]">Start by adding your first security service category.</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="border-[#2E2E2E] text-white rounded-full transition-all"
          >
            Add Service Now
          </Button>
        </div>
      )}

      <ServiceTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingService}
        title={editingService ? 'Edit Service Type' : 'Add New Service Type'}
      />
    </div>
  );
};

export default ServiceTypes;
