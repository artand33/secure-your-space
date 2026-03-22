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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  service_type_id: z.string().min(1, 'Please select a service type'),
  description: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['draft', 'published', 'in_progress', 'completed', 'cancelled']).default('draft'),
  pricing_note: z.string().optional(),
});

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema> & { id?: string };
  title: string;
}

const JobDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}: JobDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      service_type_id: '',
      description: '',
      location: '',
      status: 'draft',
      pricing_note: '',
    },
  });

  const queryClient = useQueryClient();
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [isSavingService, setIsSavingService] = useState(false);

  const handleCreateService = async () => {
    if (!newServiceName.trim()) {
      toast.error('Service category name is required');
      return;
    }
    setIsSavingService(true);
    try {
      const { data, error } = await supabase
        .from('service_types')
        .insert([{ 
          name: newServiceName.trim(), 
          description: newServiceDesc.trim() || undefined, 
          icon_name: 'Server', 
          is_active: true, 
          display_order: 99 
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ['service_types_list'] });
      form.setValue('service_type_id', data.id);
      setIsCreatingService(false);
      setNewServiceName('');
      setNewServiceDesc('');
      toast.success('Category created & auto-selected!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setIsSavingService(false);
    }
  };

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

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        slug: initialData.slug,
        service_type_id: initialData.service_type_id,
        description: initialData.description || '',
        location: initialData.location || '',
        status: initialData.status,
        pricing_note: initialData.pricing_note || '',
      });
    } else {
      form.reset({
        title: '',
        slug: '',
        service_type_id: '',
        description: '',
        location: '',
        status: 'draft',
        pricing_note: '',
      });
    }
  }, [initialData, form, open]);

  // Slug generation logic
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('title', value);
    if (!initialData) {
      const slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#1A1A1A] border-[#2E2E2E] text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 24/7 Security Patrol" 
                        {...field} 
                        onChange={handleTitleChange}
                        className="bg-[#0D0D0D] border-[#2E2E2E]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. security-patrol" 
                        {...field} 
                        className="bg-[#0D0D0D] border-[#2E2E2E]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="service_type_id"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Service Category</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        if (val === 'create_new') {
                          setIsCreatingService(!isCreatingService);
                        } else {
                          field.onChange(val);
                          setIsCreatingService(false);
                        }
                      }} 
                      value={isCreatingService ? 'create_new' : field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E]">
                        {serviceTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id} className="text-white">
                            {type.name}
                          </SelectItem>
                        ))}
                        <div className="h-px bg-[#2E2E2E] my-1" />
                        <SelectItem value="create_new" className="text-[#E8640A] focus:bg-[#E8640A]/10 focus:text-[#E8640A]">
                          <span className="flex items-center font-bold relative z-10 pointer-events-none">
                            <Plus className="w-4 h-4 mr-2" />
                            {isCreatingService ? 'Cancel Creation' : 'Create New Category +'}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />

                    {isCreatingService && (
                      <div className="absolute z-50 top-full left-0 w-full mt-2 bg-[#202020] border border-[#E8640A]/30 rounded-xl p-3 shadow-2xl animate-in slide-in-from-top-2">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-[#E8640A] uppercase tracking-widest">New Category Inline</span>
                            <button type="button" onClick={() => setIsCreatingService(false)} className="text-[#9CA3AF] hover:text-white transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <Input 
                            placeholder="Category Name (e.g. Access Control)" 
                            className="h-9 bg-[#1A1A1A] border-[#2E2E2E] text-white focus:border-[#E8640A]/50 text-sm"
                            value={newServiceName}
                            onChange={(e) => setNewServiceName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateService(); } }}
                            autoFocus
                          />
                          <Textarea 
                            placeholder="Short description (optional)..." 
                            className="min-h-[60px] bg-[#1A1A1A] border-[#2E2E2E] text-white focus:border-[#E8640A]/50 text-sm resize-none"
                            value={newServiceDesc}
                            onChange={(e) => setNewServiceDesc(e.target.value)}
                          />
                          <Button 
                            type="button" 
                            onClick={handleCreateService} 
                            disabled={isSavingService}
                            className="w-full h-9 bg-[#E8640A] hover:bg-[#D55C09] text-white font-bold"
                          >
                            {isSavingService ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {isSavingService ? 'Saving...' : 'Save & Select'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E]">
                        <SelectItem value="draft" className="text-white">Draft</SelectItem>
                        <SelectItem value="published" className="text-white text-green-500">Published</SelectItem>
                        <SelectItem value="in_progress" className="text-white text-blue-500">In Progress</SelectItem>
                        <SelectItem value="completed" className="text-white text-gray-500">Completed</SelectItem>
                        <SelectItem value="cancelled" className="text-white text-red-500">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location / Region</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. London Metro Area" 
                      {...field} 
                      className="bg-[#0D0D0D] border-[#2E2E2E]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List details of the job..."
                      className="resize-none bg-[#0D0D0D] border-[#2E2E2E] h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Note (Visible to Clients)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. £45/hr or Contact for Quote" 
                      {...field} 
                      className="bg-[#0D0D0D] border-[#2E2E2E]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" className="bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full transition-all px-8">
                {initialData ? 'Update Job Unit' : 'Create Job Unit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JobDialog;
