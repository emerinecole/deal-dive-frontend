'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from './components/map-view';
import ListView from './components/list-view';

export default function Home() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <Tabs defaultValue="list" className="w-full">
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
          <MapView />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <ListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
