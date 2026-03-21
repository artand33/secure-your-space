import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';

const Enquiries = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-[#E8640A]" />
            Client Enquiries
          </h1>
          <p className="text-[#9CA3AF] mt-2">Manage all incoming web leads and enquiries.</p>
        </div>
      </div>

      <div className="p-8 border border-[#2E2E2E] bg-[#1A1A1A] rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#4B4B4B] animate-spin" />
        <p className="text-[#9CA3AF]">Lead tracking and management features are currently defined.</p>
      </div>
    </div>
  );
};

export default Enquiries;
