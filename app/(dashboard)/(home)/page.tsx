'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from './components/map-view';
import ListView from './components/list-view';
import { getDeals } from '@/lib/services/deal-service';
import { Deal } from '@/lib/types/deals';

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
        alert('Error fetching deals: ' + err);
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
      <div className="flex flex-col space-y-6 p-6">
        <p className="text-muted-foreground">Loading deals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Deal Dive</h1>
            <p className="text-muted-foreground">
              Discover amazing deals and manage your favorite offers all in one place.
            </p>
          </div>

          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="map" className="mt-6">
          <MapView deals={deals} />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <ListView deals={deals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
