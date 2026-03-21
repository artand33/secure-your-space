import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  MapPin, 
  Home, 
  Upload, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Camera,
  X,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BookingForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Form States
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [propertyAddress, setPropertyAddress] = useState(profile?.address || '');
  const [propertyType, setPropertyType] = useState(profile?.property_type || '');
  const [clientNotes, setClientNotes] = useState('');

  useEffect(() => {
    if (profile) {
      setPropertyAddress(profile.address || '');
      setPropertyType(profile.property_type || '');
    }
  }, [profile]);

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job_booking', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          service_type:service_types(name)
        `)
        .eq('id', jobId)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('bookings')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('bookings')
          .getPublicUrl(filePath);
        
        newUrls.push(publicUrl);
      }
      setPhotos(prev => [...prev, ...newUrls]);
      toast.success('Photos uploaded successfully');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !jobId) return;
    
    if (!preferredDate || !propertyAddress || !propertyType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          job_id: jobId,
          client_id: user.id,
          status: 'pending',
          preferred_date: preferredDate,
          property_address: propertyAddress,
          property_type: propertyType,
          client_notes: clientNotes,
          property_photo_urls: photos
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Log to history
      await supabase.from('booking_history').insert([{
        booking_id: booking.id,
        new_status: 'pending',
        changed_by: user.id,
        reason: 'Initial booking request'
      }]);

      toast.success('Booking request submitted! We will review it shortly.');
      navigate('/dashboard/user'); // Redirect to user dashboard
    } catch (err: any) {
      toast.error('Submission failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#E8640A] animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-white">Job not found</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/dashboard/jobs">Browse available jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        to="/dashboard/jobs" 
        className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#E8640A] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to units
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Job Info */}
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-3xl p-8 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E8640A]/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#E8640A]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#E8640A]">{job.service_type?.name}</span>
              <h1 className="text-3xl font-bold text-white italic">{job.title}</h1>
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-[#9CA3AF]">
                  <MapPin className="w-5 h-5 text-[#E8640A]" />
                  <span>{job.location || 'United Kingdom'}</span>
               </div>
               {job.pricing_note && (
                 <div className="flex items-center gap-3 text-[#9CA3AF]">
                    <div className="w-5 h-5 border border-[#E8640A] rounded-full flex items-center justify-center text-[10px] font-bold text-[#E8640A]">£</div>
                    <span className="text-white font-medium">{job.pricing_note}</span>
                 </div>
               )}
            </div>
            <p className="text-sm text-[#9CA3AF] italic leading-relaxed">
              {job.description || "Our elite security team will deploy specifically configured equipment and personnel for this unit."}
            </p>
          </div>

          <div className="bg-[#E8640A]/5 border border-[#E8640A]/20 rounded-2xl p-6 flex gap-4">
             <Info className="w-6 h-6 text-[#E8640A] shrink-0" />
             <div className="text-xs text-[#9CA3AF] leading-relaxed">
               <strong className="text-white block mb-1">What happens next?</strong>
               Once you submit this form, our team will review your requirements. You will receive a notification when your booking is confirmed or if we need more info.
             </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8640A]/10 blur-[60px] rounded-full -mr-16 -mt-16" />
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Booking Details
                  <div className="h-px flex-1 bg-[#2E2E2E]" />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#9CA3AF] flex items-center gap-2">
                       <Calendar className="w-4 h-4" /> Preferred Date
                    </Label>
                    <Input 
                      type="date" 
                      required 
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="bg-[#2E2E2E] border-[#3E3E3E] text-white h-12 rounded-xl focus:ring-[#E8640A]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#9CA3AF] flex items-center gap-2">
                       <Home className="w-4 h-4" /> Property Type
                    </Label>
                    <Select onValueChange={setPropertyType} defaultValue={propertyType}>
                      <SelectTrigger className="bg-[#2E2E2E] border-[#3E3E3E] text-white h-12 rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E] text-white">
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#9CA3AF] flex items-center gap-2">
                     <MapPin className="w-4 h-4" /> Property Address
                  </Label>
                  <Textarea 
                    required 
                    placeholder="Enter full address where security is required"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="bg-[#2E2E2E] border-[#3E3E3E] text-white min-h-[100px] rounded-xl focus:ring-[#E8640A]/50 resize-none italic"
                  />
                </div>

                <div className="space-y-2">
                   <Label className="text-[#9CA3AF]">Additional Notes</Label>
                   <Textarea 
                     placeholder="Access instructions, specific threats, or requirements..."
                     value={clientNotes}
                     onChange={(e) => setClientNotes(e.target.value)}
                     className="bg-[#2E2E2E] border-[#3E3E3E] text-white min-h-[120px] rounded-xl focus:ring-[#E8640A]/50 resize-none italic"
                   />
                </div>

                <div className="space-y-4">
                  <Label className="text-[#9CA3AF]">Property Photos (Helpful for assessment)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.map((url, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-[#2E2E2E] border border-[#3E3E3E] relative group overflow-hidden">
                        <img src={url} alt="Site" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <button 
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-[#2E2E2E] hover:border-[#E8640A]/30 flex flex-col items-center justify-center gap-2 text-[#4B4B4B] hover:text-[#E8640A] transition-all"
                    >
                      {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#E8640A]" /> : <Camera className="w-6 h-6" />}
                      <span className="text-[10px] font-bold uppercase tracking-tight">Upload</span>
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={uploadPhoto} 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || uploading}
                className="w-full bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full py-8 text-lg font-bold shadow-[0_0_30px_rgba(232,100,10,0.2)] hover:shadow-[0_0_40px_rgba(232,100,10,0.4)] transition-all"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                  <span className="flex items-center gap-3 italic">
                    CONFIRM BOOKING REQUEST <CheckCircle2 className="w-6 h-6" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
