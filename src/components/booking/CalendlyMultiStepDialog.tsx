import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InlineWidget } from 'react-calendly';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

interface CalendlyMultiStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CalendlyMultiStepDialog = ({ open, onOpenChange }: CalendlyMultiStepDialogProps) => {
  const [step, setStep] = useState(1);
  const [loadingCalendly, setLoadingCalendly] = useState(true);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    propertyType: '',
    serviceNeed: '',
    urgency: ''
  });

  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
  const primaryColor = import.meta.env.VITE_CALENDLY_PRIMARY || 'E8640A';
  const bgColor = import.meta.env.VITE_CALENDLY_BG || '0D0D0D';

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStep1Valid = formData.name.trim() !== '' && formData.email.trim() !== '';
  const isStep2Valid = formData.propertyType !== '' && formData.serviceNeed !== '' && formData.urgency !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full bg-[#141414] border-[#2E2E2E] p-0 overflow-hidden text-white shadow-2xl fixed top-[90px] bottom-[25px] left-1/2 -translate-x-1/2 translate-y-0 flex flex-col">
        <div className="p-6 border-b border-[#2E2E2E]/50 shrink-0">
          <DialogHeader className="relative">
            {step === 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white flex items-center gap-1 hover:bg-transparent px-0"
              >
                <ArrowLeft className="w-4 h-4" /> Home
              </Button>
            )}
            <DialogTitle className="text-white font-bold text-center">
              {step === 1 && "Step 1: Contact Information"}
              {step === 2 && "Step 2: Assessment Details"}
              {step === 3 && "Step 3: Pick a Date & Time"}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full bg-[#2E2E2E] h-1 rounded-full mt-4">
            <div 
              className="bg-[#E8640A] h-1 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col justify-center overflow-y-auto">
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6 max-w-lg mx-auto w-full">
              <div className="space-y-2">
                <Label className="text-[#9CA3AF]">Full Name</Label>
                <Input 
                  placeholder="John Smith" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-[#1F1F1F] border-[#2E2E2E] text-white h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#9CA3AF]">Email Address</Label>
                <Input 
                  type="email"
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-[#1F1F1F] border-[#2E2E2E] text-white h-12"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={!isStep1Valid}
                className="w-full bg-[#E8640A] hover:bg-[#F97316] text-white rounded-full h-12 font-bold flex items-center justify-center gap-2 mt-4"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6 max-w-lg mx-auto w-full">
              <div className="space-y-2">
                <Label className="text-[#9CA3AF]">1. What type of property needs protecting?</Label>
                <Select value={formData.propertyType} onValueChange={(val) => setFormData({...formData, propertyType: val})}>
                  <SelectTrigger className="bg-[#1F1F1F] border-[#2E2E2E] text-white h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E] text-white">
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#9CA3AF]">2. Which security system interests you most?</Label>
                <Select value={formData.serviceNeed} onValueChange={(val) => setFormData({...formData, serviceNeed: val})}>
                  <SelectTrigger className="bg-[#1F1F1F] border-[#2E2E2E] text-white h-12">
                    <SelectValue placeholder="Select solution" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E] text-white">
                    <SelectItem value="CCTV Systems">CCTV Systems</SelectItem>
                    <SelectItem value="Intruder Alarms">Intruder Alarms</SelectItem>
                    <SelectItem value="Access Control">Access Control</SelectItem>
                    <SelectItem value="Gates & Barriers">Gates & Barriers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#9CA3AF]">3. How soon do you need the assessment?</Label>
                <Select value={formData.urgency} onValueChange={(val) => setFormData({...formData, urgency: val})}>
                  <SelectTrigger className="bg-[#1F1F1F] border-[#2E2E2E] text-white h-12">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E] text-white">
                    <SelectItem value="ASAP">ASAP</SelectItem>
                    <SelectItem value="1-6 months">1-6 months</SelectItem>
                    <SelectItem value="Just researching">Just researching</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleBack}
                  className="flex-1 border border-[#2E2E2E] hover:bg-white/5 text-white h-12 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button 
                  type="button" 
                  disabled={!isStep2Valid}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#E8640A] hover:bg-[#F97316] text-white rounded-full h-12 font-bold flex items-center justify-center gap-2"
                >
                  Schedule Call <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 w-full h-full overflow-hidden">
                <InlineWidget
                  url={calendlyUrl!}
                  styles={{ height: '100%', width: '100%' }}
                  pageSettings={{
                    backgroundColor: bgColor,
                    hideGdprBanner: true,
                    primaryColor: primaryColor,
                    textColor: 'FFFFFF',
                  }}
                  prefill={{
                    email: formData.email,
                    name: formData.name,
                    customAnswers: {
                      a1: formData.propertyType,
                      a2: formData.serviceNeed,
                      a3: formData.urgency
                    }
                  }}
                />
              </div>
              <div className="flex gap-4 pt-4 border-t border-[#2E2E2E]/50 mt-2 shrink-0">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleBack}
                  className="flex-1 max-w-[150px] border border-[#2E2E2E] hover:bg-white/5 text-white h-12 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => { /* placeholder - to be connected later */ }}
                  className="flex-1 max-w-[150px] bg-[#E8640A] hover:bg-[#F97316] text-white h-12 rounded-full font-bold flex items-center justify-center gap-2 ml-auto"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyMultiStepDialog;
