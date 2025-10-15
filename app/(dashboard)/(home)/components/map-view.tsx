'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Map as LeafletMap } from 'leaflet';

// Dynamically import the map to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Dummy data for deals
const dummyDeals = [
  {
    id: 1,
    title: "50% Off Electronics",
    description: "Amazing deals on laptops and phones",
    position: [40.7128, -74.0060] as [number, number], // New York
    price: "$299",
  },
  {
    id: 2,
    title: "Restaurant Week Special",
    description: "3-course meal for $35",
    position: [40.7589, -73.9851] as [number, number], // Times Square
    price: "$35",
  },
  {
    id: 3,
    title: "Gym Membership Deal",
    description: "6 months for the price of 3",
    position: [40.7505, -73.9934] as [number, number], // Midtown
    price: "$150",
  },
];

export default function MapView() {
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(13);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // Using Nominatim (OpenStreetMap's geocoding service) for location search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
        setMapZoom(14);
        
        // If map is loaded, fly to the new location
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lon], 14);
        }
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('Error searching for location. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isClient) {
    return (
      <div className="w-full space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-muted rounded-md animate-pulse"></div>
          <div className="w-20 h-10 bg-muted rounded-md animate-pulse"></div>
        </div>
        <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a location (e.g., Times Square, New York)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} size="sm" className="px-4">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div className="w-full h-[600px] rounded-lg overflow-hidden border">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {dummyDeals.map((deal) => (
            <Marker key={deal.id} position={deal.position}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground">{deal.description}</p>
                  <p className="font-bold text-green-600">{deal.price}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
