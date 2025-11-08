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

  // Get tab from URL (?tab=list or ?tab=map)
  const currentTab = searchParams.get("tab") || "list";

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const dealsData = await getDeals();
        setDeals(dealsData);
      } catch (err) {
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
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
        <div className="relative z-0 max-w-7xl mx-auto p-6 md:p-8">
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-foreground">Loading Deals</h3>
              <p className="text-muted-foreground">Finding the best offers for you...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
        <div className="relative z-0 max-w-7xl mx-auto p-6 md:p-8">
          <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-destructive">Oops!</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-0 max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm">
            <span className="text-sm font-semibold text-primary">
              {deals.length} Active Deals
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Discover Deals
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore amazing local offers and save money on your favorite places
              </p>
            </div>

            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-[240px] grid-cols-2 h-12 bg-background/80 backdrop-blur-xl border border-border/40 rounded-xl p-1">
                <TabsTrigger 
                  value="list" 
                  className="rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all hover:cursor-pointer"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger 
                  value="map"
                  className="rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all hover:cursor-pointer"
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