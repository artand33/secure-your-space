import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnquiryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnquiryFormDialog = ({ open, onOpenChange }: EnquiryFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const mutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const { error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: payload.name,
            email: payload.email,
            phone: payload.phone || null,
            status: 'new'
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Your enquiry has been submitted successfully!', {
        description: "Our security layout team will be in touch with you shortly."
      });
      setFormData({ name: '', email: '', phone: '' });
      setErrors({});
      onOpenChange(false); // Close modal
    },
    onError: (error) => {
      console.error('Enquiry Submission Error:', error);
      toast.error('Failed to submit enquiry. Please try again or contact us directly.');
    }
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#131313] border-[#2E2E2E] text-white max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] mt-24 sm:mt-20 z-[200]">
        <DialogHeader className="p-6 pb-2">
          <div className="w-12 h-12 rounded-xl bg-[#E8640A]/10 border border-[#E8640A]/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-[#E8640A] drop-shadow-[0_0_10px_rgba(232,100,10,0.3)]" />
          </div>
          <DialogTitle className="text-2xl font-bold font-display text-white mt-1">
            Free Security Assessment
          </DialogTitle>
          <DialogDescription className="text-[#9CA3AF] text-sm leading-relaxed">
            Fill out the details below, and our experts will contact you to discuss standard options tailored to your property. No commitments or pressure.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 pt-4">
          <div className="overflow-y-auto max-h-[65vh] p-2 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-bold text-[#BCBCBC] uppercase tracking-wider">Full Name *</Label>
            <Input 
              id="name" 
              placeholder="Your name" 
              className={`bg-[#1A1A1A] border-[#2E2E2E] text-white placeholder:text-[#4B4B4B] rounded-xl focus-visible:ring-[#E8640A] ${errors.name ? 'border-red-500/50' : ''}`}
              value={formData.name}
              onChange={handleChange}
              disabled={mutation.isPending}
            />
            {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-bold text-[#BCBCBC] uppercase tracking-wider">Email ADDRESS *</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="your@email.com" 
                className={`bg-[#1A1A1A] border-[#2E2E2E] text-white placeholder:text-[#4B4B4B] rounded-xl focus-visible:ring-[#E8640A] ${errors.email ? 'border-red-500/50' : ''}`}
                value={formData.email}
                onChange={handleChange}
                disabled={mutation.isPending}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-bold text-[#BCBCBC] uppercase tracking-wider">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel"
                placeholder="01234 567890" 
                className="bg-[#1A1A1A] border-[#2E2E2E] text-white placeholder:text-[#4B4B4B] rounded-xl focus-visible:ring-[#E8640A]"
                value={formData.phone}
                onChange={handleChange}
                disabled={mutation.isPending}
              />
            </div>
          </div>

          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-[#E8640A] hover:bg-[#D55C09] text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-[#E8640A]/20 flex items-center justify-center gap-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                'Submit Assessment Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryFormDialog;
