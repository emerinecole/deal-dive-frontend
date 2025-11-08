'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from './components/map-view';
import ListView from './components/list-view';
import { getDeals } from '@/lib/services/deal-service';
import { Deal } from '@/lib/types/deals';
import { MapIcon, List, Loader2 } from 'lucide-react';

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "list";

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const dealsData = await getDeals();
        setDeals(dealsData);
      } catch {
        setError('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleTabChange = (value: string) => {
    router.push(`/?tab=${value}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-300/40">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading deals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm text-center max-w-md">
          <h3 className="font-semibold text-red-600 mb-1">Oops!</h3>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
      <div className="relative z-0 max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 border border-blue-200 backdrop-blur-sm">
            <span className="text-sm font-semibold text-blue-600">
              {deals.length} Active Deals
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Discover Deals
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Explore amazing local offers and save money on your favorite places
              </p>
            </div>

            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-[240px] grid-cols-2 h-12 bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-1 shadow-sm">
                <TabsTrigger 
                  value="list" 
                  className="rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all hover:cursor-pointer"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger 
                  value="map"
                  className="rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all hover:cursor-pointer"
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content */}
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsContent value="list" className="mt-0">
            <ListView deals={deals} />
          </TabsContent>
          <TabsContent value="map" className="mt-0">
            <MapView deals={deals} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
