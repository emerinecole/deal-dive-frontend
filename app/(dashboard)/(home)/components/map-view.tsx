'use client';

import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Deal } from "@/lib/types/deals";

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
    libraries: ["places"] as ("places")[],
  });

  // University of Florida default location
  const UF_COORDS = { lat: 29.6535, lng: -82.3388 };

  const [mapCenter, setMapCenter] = useState(UF_COORDS);
  const [mapZoom, setMapZoom] = useState(13);
  const [markers, setMarkers] = useState<DealWithCoords[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<DealWithCoords | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);

  // Set initial map center based on user's location if permission is granted
  useEffect(() => {
    if (!navigator.geolocation || !navigator.permissions) return;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      if (status.state === "granted" || status.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setMapCenter({ lat, lng });
          },
          () => {
            alert("Permission denied or unable to get location. Using default (UF).")
          }
        );
      }
    });
  }, []);

  // Helper function to geocode an address
  const geocodeAddress = (address: string): Promise<google.maps.GeocoderResult[]> => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results) resolve(results);
        else reject(status);
      });
    });
  };

  // Geocode deals (ignore empty addresses)
  useEffect(() => {
    if (!isLoaded || !deals.length) return;

    const geocodeDeals = async () => {
      const resolvedDeals: DealWithCoords[] = [];

      for (const deal of deals) {
        if (!deal.address?.trim()) continue;

        if (deal.geom?.lat && deal.geom?.lng) {
          resolvedDeals.push({ ...deal, lat: deal.geom.lat, lng: deal.geom.lng });
        } else {
          try {
            const results = await geocodeAddress(deal.address);
            if (results.length > 0) {
              const loc = results[0].geometry.location;
              resolvedDeals.push({ ...deal, lat: loc.lat(), lng: loc.lng() });
            }
          } catch {
            alert("Failed to geocode deal");
          }
        }
      }

      setMarkers(resolvedDeals);
    };

    geocodeDeals();
  }, [isLoaded, deals]);

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim() || !isLoaded) return;

    try {
      const results = await geocodeAddress(searchQuery);
      if (results.length > 0) {
        const loc = results[0].geometry.location;
        setMapCenter({ lat: loc.lat(), lng: loc.lng() });
        setMapZoom(14);
        mapRef.current?.panTo({ lat: loc.lat(), lng: loc.lng() });
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
          {markers.map((deal) => (
            <Marker
              key={deal.id}
              position={{ lat: deal.lat, lng: deal.lng }}
              onClick={() => setSelectedDeal(deal)}
            />
          ))}

          {selectedDeal && (
            <InfoWindow
              position={{ lat: selectedDeal.lat, lng: selectedDeal.lng }}
              onCloseClick={() => setSelectedDeal(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedDeal.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedDeal.description}</p>
                <p className="font-bold text-green-600">${selectedDeal.discounted_price}</p>
                {selectedDeal.original_price && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${selectedDeal.original_price}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{selectedDeal.address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
