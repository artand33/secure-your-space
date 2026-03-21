import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Shield, 
  User, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    new: '',
    confirm: ''
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.new || passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      setPasswords({ new: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Account <span className="text-[#E8640A]">Settings</span>
        </h1>
        <p className="text-[#9CA3AF] text-lg font-medium leading-relaxed">
          Manage your security, preferences, and verified account data.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Account Quick Access */}
        <Card className="bg-[#1A1A1A] border-[#2E2E2E] overflow-hidden group hover:border-[#E8640A]/30 transition-all duration-500 shadow-2xl">
          <CardContent className="p-0">
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#E8640A]/10 flex items-center justify-center text-[#E8640A] group-hover:scale-110 transition-transform duration-500">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Personal Information</h3>
                  <p className="text-[#9CA3AF] text-sm">Update your name, address, and profile picture.</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/profile')}
                className="rounded-full bg-white/5 hover:bg-[#E8640A] text-white transition-all h-12 px-6 group/btn border border-white/10 hover:border-[#E8640A]"
              >
                Go to Profile
                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security / Password Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-red-500" />
             </div>
             <h2 className="text-lg font-bold text-white uppercase tracking-widest text-[11px]">Security & Authentication</h2>
          </div>

          <Card className="bg-[#1A1A1A] border-[#2E2E2E] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  Update Password
                </h3>
                <p className="text-sm text-[#9CA3AF]">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
                <div className="space-y-2">
                  <Label className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest ml-1">New Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="bg-[#2E2E2E] border-[#3E3E3E] text-white h-12 pr-12 focus:ring-[#E8640A] focus:border-[#E8640A] rounded-xl transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B4B4B] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest ml-1">Confirm Password</Label>
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="bg-[#2E2E2E] border-[#3E3E3E] text-white h-12 focus:ring-[#E8640A] focus:border-[#E8640A] rounded-xl transition-all"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto px-10 h-12 bg-white hover:bg-[#E8640A] text-black hover:text-white font-bold rounded-full transition-all group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Update Password
                      <CheckCircle2 className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Info Box */}
        <div className="p-6 rounded-2xl bg-[#E8640A]/5 border border-[#E8640A]/10 flex items-start gap-4">
           <AlertCircle className="w-6 h-6 text-[#E8640A] shrink-0 mt-0.5" />
           <div className="space-y-1">
              <p className="text-white font-bold">Two-Factor Authentication</p>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                2FA is currently managed via your registration email. For advanced security requirements, please contact our support team to enable hardware key authentication.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
