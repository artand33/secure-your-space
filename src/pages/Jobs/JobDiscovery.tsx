import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Camera, Shield, Lock, Phone, ArrowRight, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const JobDiscovery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: serviceTypes } = useQuery({
    queryKey: ['service_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          service_type:service_types(name, icon_name)
        `)
        .eq('status', 'published');
      
      if (selectedCategory !== 'all') {
        query = query.eq('service_type_id', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">Find Your Security Solution</h1>
          <p className="text-[#9CA3AF] text-lg">Browse our published job units and book professional protection in minutes.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4B4B4B] group-focus-within:text-[#E8640A] transition-colors" />
          <input 
            type="text"
            placeholder="Search security units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-[#4B4B4B] focus:outline-none focus:border-[#E8640A]/50 transition-all font-inter"
          />
        </div>
        <div className="flex gap-2 bg-[#1A1A1A] p-1.5 border border-[#2E2E2E] rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === 'all' 
              ? 'bg-[#E8640A] text-white shadow-lg' 
              : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
          >
            ALL
          </button>
          {serviceTypes?.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedCategory(type.id)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === type.id 
                ? 'bg-[#E8640A] text-white shadow-lg' 
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
              }`}
            >
              {type.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[420px] bg-[#1A1A1A] border border-[#2E2E2E] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs?.map((job) => (
            <div 
              key={job.id} 
              className="group flex flex-col bg-[#1A1A1A] border border-[#2E2E2E] rounded-3xl overflow-hidden hover:border-[#E8640A]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,100,10,0.1)]"
            >
              <div className="aspect-[4/3] bg-[#0D0D0D] relative overflow-hidden flex items-center justify-center">
                 <Camera className="w-16 h-16 text-[#E8640A]/10 group-hover:scale-110 transition-transform duration-500" />
                 
                {job.pricing_note && (
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-[#E8640A] text-white font-bold py-1.5 px-4 rounded-full border-none text-md shadow-xl">
                      {job.pricing_note}
                    </Badge>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                   <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest font-bold text-[#E8640A]">
                      {job.service_type?.name}
                   </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex flex-col gap-1 mb-4">
                   <h3 className="text-2xl font-bold text-white group-hover:text-[#E8640A] transition-colors line-clamp-1 italic">{job.title}</h3>
                   <div className="flex items-center gap-2 text-[#9CA3AF] text-sm">
                      <MapPin className="w-4 h-4 text-[#E8640A]" />
                      <span>{job.location || 'United Kingdom'}</span>
                   </div>
                </div>

                <p className="text-[#9CA3AF] text-sm leading-relaxed line-clamp-3 mb-8 flex-1 italic">
                  {job.description || "High-specification security solution tailored for your requirements. Professional deployment and 24/7 monitoring integration available."}
                </p>

                <Button 
                  onClick={() => navigate(`/jobs/${job.id}/book`)}
                  className="w-full bg-[#E8640A] hover:bg-[#D55C09] text-white rounded-full py-6 font-bold group-hover:shadow-[0_0_20px_rgba(232,100,10,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  Book This Unit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && jobs?.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-[#2E2E2E] rounded-3xl">
          <div className="p-6 rounded-full bg-[#1A1A1A] border border-[#2E2E2E]">
            <Search className="w-10 h-10 text-[#4B4B4B]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">No security units matching your search</h3>
            <p className="text-[#9CA3AF]">Try adjusting your filters or search keywords.</p>
          </div>
          <Button 
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            variant="ghost" 
            className="text-[#E8640A] hover:bg-[#E8640A]/10 rounded-full"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobDiscovery;
