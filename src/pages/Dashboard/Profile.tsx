import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Loader2, ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { profile, user, loading: authLoading, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || '');

  useEffect(() => {
    if (profile) setFullName(profile.full_name || '');
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated', description: 'Changes saved successfully.' });
      await refreshProfile();
    }
    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;

      toast({ title: 'Success', description: 'Avatar updated!' });
      await refreshProfile();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center"><Loader2 className="animate-spin text-[#E8640A] w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link to="/" className="text-[#9CA3AF] hover:text-[#E8640A] flex items-center"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        <div className="flex flex-col items-center gap-6 pb-8 border-b border-[#2E2E2E]">
          <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-full bg-[#2E2E2E] border-2 border-[#E8640A]/20 flex items-center justify-center text-[#E8640A] text-4xl font-bold overflow-hidden shadow-2xl">
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : fullName?.[0] || 'U'}
              {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-white" /></div>}
            </div>
            <div className="absolute bottom-0 right-0 p-2 bg-[#E8640A] rounded-full text-white shadow-lg group-hover:scale-110 transition-transform"><Camera className="w-4 h-4" /></div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">{profile?.full_name || 'SecureGuard User'}</h2>
            <p className="text-[#9CA3AF] text-sm">{user?.email}</p>
          </div>
        </div>
        <Card className="bg-[#1A1A1A] border-[#2E2E2E]">
          <CardHeader><CardTitle className="text-white text-lg">Profile Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[#9CA3AF]">Display Name</Label>
                <div className="relative"><User className="absolute left-3 top-3.5 w-4 h-4 text-[#4E4E4E]" /><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#2E2E2E] border-[#3E3E3E] text-white pl-10 h-12" /></div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#9CA3AF]">Registry Email Address</Label>
                <div className="relative opacity-60"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#4E4E4E]" /><Input value={user?.email || ''} readOnly className="bg-[#141414] border-[#2E2E2E] text-[#6E6E6E] pl-10 h-12" /></div>
                <p className="text-[11px] text-[#9CA3AF]/40">🔒 Locked for security.</p>
              </div>
              <Button type="submit" className="w-full bg-[#E8640A] hover:bg-[#F97316] text-white rounded-full h-12 font-bold" disabled={loading || uploading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
