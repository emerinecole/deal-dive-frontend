'use client';

import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, TrendingDown, ArrowRight, Loader2 } from "lucide-react";
import { Deal } from "@/lib/types/deals";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MapViewProps {
  deals: Deal[];
}

interface DealWithCoords extends Deal {
  lat: number;
  lng: number;
}

export default function MapView({ deals }: MapViewProps) {
  const UF_COORDS = { lat: 29.6535, lng: -82.3388 };
  const [mapCenter, setMapCenter] = useState(UF_COORDS);
  const [mapZoom, setMapZoom] = useState(13);
  const [markers, setMarkers] = useState<DealWithCoords[]>([]);
  const [selectedDealGroup, setSelectedDealGroup] = useState<DealWithCoords[] | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Center map on user location if possible
  useEffect(() => {
    if (!navigator.geolocation || !navigator.permissions) return;

    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      if (status.state === "granted" || status.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (pos) => setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {} // fallback to default
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

  // Prepare markers
  useEffect(() => {
    if (!(window as Window & { google?: typeof google })?.google || !deals.length) return;

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
          } catch {}
        }
      }

      setMarkers(resolved);
    };

    resolveDeals();
  }, [deals]);

  // Group deals at same coordinates
  const groupedMarkers = markers.reduce((groups, deal) => {
    const key = `${deal.lat.toFixed(6)},${deal.lng.toFixed(6)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(deal);
    return groups;
  }, {} as Record<string, DealWithCoords[]>);

  // Search location
  const handleSearch = async () => {
    if (!searchQuery.trim() || !(window as Window & { google?: typeof google })?.google) return;

    setIsSearching(true);
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
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const calculateSavings = (original?: number, discounted?: number) => {
    if (original && discounted && original > discounted) {
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  };

  const getMarkerIcon = (key: string) => {
    const isActive =
      hoveredKey === key ||
      selectedDealGroup?.[0]?.lat.toFixed(6) + "," + selectedDealGroup?.[0]?.lng.toFixed(6) === key;
    const fillColor = isActive ? "#991b1b" : "#dc2626";
    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor,
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 1.5,
      anchor: new google.maps.Point(12, 22),
    };
  };

  if (!(window as Window & { google?: typeof google })?.google) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-700">Loading Map...</p>
      </div>
    );
  }  

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 space-y-6 p-6">
      {/* 🔍 Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-lg p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
            <Input
              type="text"
              placeholder="Search for a location (e.g., Gainesville, FL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
              className="h-12 pl-10 text-base rounded-xl border-blue-200 focus-visible:ring-blue-300 transition-all"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className={cn(
              "h-12 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
              "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-300/40 opacity-90 disabled:opacity-60"
            )}
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 🗺️ Map Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-100 shadow-2xl overflow-hidden">
        <div className="w-full h-[600px]">
          <GoogleMap
            onLoad={handleMapLoad}
            center={mapCenter}
            zoom={mapZoom}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
            }}
          >
            {Object.entries(groupedMarkers).map(([key, dealsAtLocation]) => {
              const { lat, lng } = dealsAtLocation[0];
              const dealCount = dealsAtLocation.length;

              return (
                <Marker
                  key={key}
                  position={{ lat, lng }}
                  onClick={() => setSelectedDealGroup(dealsAtLocation)}
                  onMouseOver={() => setHoveredKey(key)}
                  onMouseOut={() => setHoveredKey(null)}
                  icon={getMarkerIcon(key)}
                  label={
                    dealCount > 1
                      ? {
                          text: String(dealCount),
                          color: "#ffffff",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }
                      : undefined
                  }
                />
              );
            })}

            {selectedDealGroup && (
              <InfoWindow
                position={{
                  lat: selectedDealGroup[0].lat,
                  lng: selectedDealGroup[0].lng,
                }}
                onCloseClick={() => setSelectedDealGroup(null)}
                options={{ pixelOffset: new google.maps.Size(0, -40) }}
              >
                <div className="p-1 max-w-[320px] max-h-[400px] overflow-y-auto">
                  <div className="space-y-3">
                    {selectedDealGroup.map((deal, index) => {
                      const savings = calculateSavings(deal.original_price, deal.discounted_price);

                      return (
                        <div
                          key={deal.id}
                          className={cn(
                            "pb-3",
                            index < selectedDealGroup.length - 1 && "border-b border-blue-100"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2 min-h-[40px]">
                            <h4 className="font-bold text-sm text-blue-900 leading-tight flex-1 line-clamp-2">
                              {deal.title}
                            </h4>
                            {savings > 0 && (
                              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 flex-shrink-0 shadow-sm h-fit">
                                <TrendingDown className="h-3 w-3" />
                                {savings}%
                              </div>
                            )}
                          </div>

                          <div className="h-[18px] mb-2 overflow-hidden">
                            <div className="flex items-start gap-2 text-xs text-blue-600">
                              <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{deal.address}</span>
                            </div>
                          </div>

                          <div className="h-[48px] mb-3 overflow-hidden">
                            <p className="text-xs text-blue-800 line-clamp-3 leading-relaxed">
                              {deal.description}
                            </p>
                          </div>

                          <div className="h-[20px]">
                            <Link
                              href={`/deals/${deal.id}?from=map`}
                              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
                            >
                              View Full Details
                              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}
