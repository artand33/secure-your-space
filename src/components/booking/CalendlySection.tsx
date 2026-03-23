import React from 'react';
import { InlineWidget } from 'react-calendly';
import { Loader2 } from 'lucide-react';

const CalendlySection = () => {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
  const primaryColor = import.meta.env.VITE_CALENDLY_PRIMARY || 'E8640A';
  const bgColor = import.meta.env.VITE_CALENDLY_BG || '0D0D0D';
  const textColor = 'FFFFFF'; // default white text

  if (!calendlyUrl) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-2xl mx-auto">
        Calendly URL not configured in environment variables.
      </div>
    );
  }

  return (
    <section className="relative w-full py-12 flex items-center justify-center">
      <div className="w-full max-w-5xl px-4">
        <div className="rounded-3xl bg-[#1A1A1A] border border-[#2E2E2E] shadow-2xl overflow-hidden min-h-[700px] relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10 bg-[#141414]">
            <Loader2 className="w-10 h-10 text-[#E8640A] animate-spin" />
            <span className="ml-3 text-[#9CA3AF] text-sm">Loading Schedule...</span>
          </div>
          <InlineWidget
            url={calendlyUrl}
            styles={{
              height: '700px',
              width: '100%',
            }}
            pageSettings={{
              backgroundColor: bgColor,
              hideGdprBanner: true,
              primaryColor: primaryColor,
              textColor: textColor,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default CalendlySection;
