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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
