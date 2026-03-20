import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, MapPin, Building, Loader2, Camera } from 'lucide-react';

const Profile = () => {
  const { profile, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    address: profile?.address || '',
    property_type: profile?.property_type || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        address: formData.address,
        property_type: formData.property_type,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved successfully.',
      });
    }
    setLoading(false);
  };

  if (authLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#E8640A]" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-[#2E2E2E]">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-[#E8640A]/10 border-2 border-[#E8640A]/20 flex items-center justify-center text-[#E8640A] text-4xl font-bold overflow-hidden shadow-2xl">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile?.full_name?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-[#E8640A] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">{profile?.full_name || 'Your Profile'}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {profile?.role} Account
              </span>
              <span className="px-3 py-1 bg-[#2E2E2E] text-[#9CA3AF] border border-[#3E3E3E] rounded-full text-[10px] font-bold uppercase tracking-widest">
                ID: {user?.id.slice(0, 8)}...
              </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-[#1A1A1A] border-[#2E2E2E] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-semibold text-[#9CA3AF]">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-[#4E4E4E]" />
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="bg-[#2E2E2E] border-[#3E3E3E] text-white pl-10 focus:ring-[#E8640A]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[#4E4E4E] opacity-50">Email Address (Read-only)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-[#4E4E4E] opacity-50" />
                    <Input
                      value={user?.email || ''}
                      readOnly
                      className="bg-[#141414] border-[#2E2E2E] text-[#4E4E4E] pl-10 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type" className="text-sm font-semibold text-[#9CA3AF]">Property Type</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-4 h-4 text-[#4E4E4E]" />
                    <Input
                      id="property_type"
                      placeholder="e.g. Residential, Commercial"
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                      className="bg-[#2E2E2E] border-[#3E3E3E] text-white pl-10 focus:ring-[#E8640A]"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-[#9CA3AF]">Installation Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#4E4E4E]" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-[#2E2E2E] border-[#3E3E3E] text-white pl-10 focus:ring-[#E8640A]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full px-12 h-12 font-bold shadow-lg shadow-[#E8640A]/20 transition-all"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-[#1A1A1A] border-[#2E2E2E] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[#9CA3AF]">Manage your password and security settings to keep your space secure.</p>
              <Button variant="outline" className="w-full border-[#2E2E2E] text-white hover:bg-[#2E2E2E] rounded-full">
                Change Password
              </Button>
              <Button variant="ghost" className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
