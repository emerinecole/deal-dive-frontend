'use client';

import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Deal } from "@/lib/types/deals";
import Link from "next/link";

interface MapViewProps {
  deals: Deal[];
}

interface DealWithCoords extends Deal {
  lat: number;
  lng: number;
}

export default function MapView({ deals }: MapViewProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const UF_COORDS = { lat: 29.6535, lng: -82.3388 };
  const [mapCenter, setMapCenter] = useState(UF_COORDS);
  const [mapZoom, setMapZoom] = useState(13);
  const [markers, setMarkers] = useState<DealWithCoords[]>([]);
  const [selectedDealGroup, setSelectedDealGroup] = useState<DealWithCoords[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);

  // Try to center map on user's current location
  useEffect(() => {
    if (!navigator.geolocation || !navigator.permissions) return;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      if (status.state === "granted" || status.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          () => {
            alert("Permission denied or unable to get location. Using default center.");
          }
        );
      }
    });
  }, []);

  // Reverse geocoding helper
  const geocodeAddress = (address: string): Promise<google.maps.GeocoderResult[]> => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results) resolve(results);
        else reject(status);
      });
    });
  };

  // Prepare markers — prefer lat/lng, fallback to geocode, skip if both missing
  useEffect(() => {
    if (!isLoaded || !deals.length) return;

    const resolveDeals = async () => {
      const resolved: DealWithCoords[] = [];

      for (const deal of deals) {
        if (deal.latitude && deal.longitude) {
          resolved.push({ ...deal, lat: deal.latitude, lng: deal.longitude });
          continue;
        }

        if (deal.address?.trim()) {
          try {
            const results = await geocodeAddress(deal.address);
            if (results.length > 0) {
              const loc = results[0].geometry.location;
              resolved.push({ ...deal, lat: loc.lat(), lng: loc.lng() });
            }
          } catch {
            alert(`Failed to geocode ${deal.title}:`);
          }
        }
      }

      setMarkers(resolved);
    };

    resolveDeals();
  }, [isLoaded, deals]);

  // Group deals by same location
  const groupedMarkers = markers.reduce((groups, deal) => {
    const key = `${deal.lat.toFixed(6)},${deal.lng.toFixed(6)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(deal);
    return groups;
  }, {} as Record<string, DealWithCoords[]>);

  // Search location by address
  const handleSearch = async () => {
    if (!searchQuery.trim() || !isLoaded) return;

    try {
      const results = await geocodeAddress(searchQuery);
      if (results.length > 0) {
        const loc = results[0].geometry.location;
        const newCenter = { lat: loc.lat(), lng: loc.lng() };
        setMapCenter(newCenter);
        setMapZoom(14);
        mapRef.current?.panTo(newCenter);
      } else {
        alert("Location not found.");
      }
    } catch {
      alert("Error searching location.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} size="sm" className="px-4">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Google Map */}
      <div className="w-full h-[600px] rounded-lg overflow-hidden border">
        <GoogleMap
          onLoad={handleMapLoad}
          center={mapCenter}
          zoom={mapZoom}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {/* Render grouped markers */}
          {Object.entries(groupedMarkers).map(([key, dealsAtLocation]) => {
            const { lat, lng } = dealsAtLocation[0];
            return (
              <Marker
                key={key}
                position={{ lat, lng }}
                onClick={() => setSelectedDealGroup(dealsAtLocation)}
              />
            );
          })}

          {/* InfoWindow with list of all deals */}
          {selectedDealGroup && (
            <InfoWindow
              position={{
                lat: selectedDealGroup[0].lat,
                lng: selectedDealGroup[0].lng,
              }}
              onCloseClick={() => setSelectedDealGroup(null)}
            >
              <div className="p-2 space-y-2 max-w-[240px]">
                {selectedDealGroup.map((deal) => (
                  <div
                    key={deal.id}
                    className="border-b pb-1 last:border-none last:pb-0"
                  >
                    <h4 className="font-medium text-sm">{deal.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {deal.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="font-bold text-green-600 text-sm">
                        ${deal.discounted_price}
                      </p>
                      {deal.original_price && (
                        <p className="text-xs text-muted-foreground line-through">
                          ${deal.original_price}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/deals/${deal.id}?from=map`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 inline-block"
                    >
                      More Details →
                    </Link>
                  </div>
                ))}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
