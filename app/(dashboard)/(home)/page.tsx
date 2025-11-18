'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from './components/map-view';
import ListView from './components/list-view';
import { getDeals } from '@/lib/services/deal-service';
import { getSavedDeals } from '@/lib/services/saved-deal-service';
import { Deal } from '@/lib/types/deals';
import { MapIcon, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DealWithDistance extends Deal {
  distance: number;
}

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [savedOnly, setSavedOnly] = useState(false);
  const [savedDealIds, setSavedDealIds] = useState<number[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "list";

  const categories = [
    { label: 'Restaurant (Food)', value: 'restaurant' },
    { label: 'Bar (Drinks)', value: 'bar' },
    { label: 'Groceries', value: 'groceries' },
    { label: 'Department Store', value: 'department store' },
  ];

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => alert("Failed to get location:"),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Fetch all deals
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

  // Fetch saved deals IDs for the toggle
  useEffect(() => {
    const fetchSavedDealsIds = async () => {
      try {
        const savedDeals = await getSavedDeals();
        setSavedDealIds(savedDeals.map(d => d.id));
      } catch {
        alert('Failed to fetch saved deals');
      }
    };
    fetchSavedDealsIds();
  }, []);

  // Haversine formula to calculate distance in miles
  const getDistanceInMiles = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3958.8; // Radius of Earth in miles
    const toRad = (deg: number) => deg * (Math.PI / 180);

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Calculate distance for all deals as soon as we have user location
  useEffect(() => {
    if (!deals.length) return;

    const dealsWithDistance: DealWithDistance[] = deals.map((deal) => {
      const distance = userLocation
        ? getDistanceInMiles(
            userLocation.lat,
            userLocation.lng,
            deal.latitude,
            deal.longitude
          )
        : 0;
      return { ...deal, distance };
    });

    setFilteredDeals(dealsWithDistance);
  }, [deals, userLocation]);

  const [filtersApplied, setFiltersApplied] = useState(false);

  // Tag helpers
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags(prev => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Apply filters
  const applyFilters = () => {
    let result = deals.map((deal) => {
      const distance = userLocation
        ? getDistanceInMiles(
            userLocation.lat,
            userLocation.lng,
            deal.latitude,
            deal.longitude
          )
        : 0;
      return { ...deal, distance };
    });

    if (minPrice) result = result.filter(d => d.discounted_price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(d => d.discounted_price <= parseFloat(maxPrice));
    if (maxDistance) result = result.filter(d => d.distance <= parseFloat(maxDistance));
    if (selectedCategory) result = result.filter(d => d.categories?.includes(selectedCategory));
    if (selectedTags.length > 0) {
      result = result.filter(d =>
        selectedTags.every(tag => d.tags?.map(t => t.toLowerCase()).includes(tag))
      );
    }
    if (savedOnly) {
      result = result.filter(d => savedDealIds.includes(d.id));
    }

    setFilteredDeals(result);
    setFiltersApplied(true);
  };

  // Clear filters
  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMaxDistance('');
    setSelectedCategory('');
    setTagInput('');
    setSelectedTags([]);
    setSavedOnly(false);
    setFiltersApplied(false);

    const result = deals.map((deal) => {
      const distance = userLocation
        ? getDistanceInMiles(
            userLocation.lat,
            userLocation.lng,
            deal.latitude,
            deal.longitude
          )
        : 0;
      return { ...deal, distance };
    });

    setFilteredDeals(result);
  };

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
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 border border-blue-200 backdrop-blur-sm">
            <span className="text-sm font-semibold text-blue-600">
              {deals.length} Active Deals
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Discover Deals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Explore amazing local offers and save money on your favorite places
          </p>
        </div>

        {/* Main content: filters + deals */}
        <div className="flex gap-6 mt-4">
          {/* Filter panel */}
          <div className="w-64 bg-white rounded-2xl p-4 shadow-md h-fit flex flex-col gap-4">
            <h2 className="font-bold text-gray-900 text-lg">Filters</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Min Price</label>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Price</label>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Distance (mi)</label>
              <Input
                type="number"
                placeholder="e.g., 10"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="h-12 text-base rounded-xl border-blue-200 focus-visible:ring-blue-200 transition-all"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
                </Button>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Deals Only Toggle */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="savedOnly"
                checked={savedOnly}
                onChange={(e) => setSavedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="savedOnly" className="text-sm text-gray-700">
                Saved Deals Only
              </label>
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                onClick={applyFilters}
              >
                Apply
              </Button>

              <Button
                className={cn(
                  'flex-1 transition-colors',
                  filtersApplied
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                onClick={clearFilters}
                disabled={
                  !minPrice && !maxPrice && !maxDistance && !selectedCategory && selectedTags.length === 0 && !savedOnly
                }
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Deals list/map */}
          <div className="flex-1">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 h-12 bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-1 shadow-sm mb-4">
                <TabsTrigger value="list" className={cn(
                  'rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all hover:cursor-pointer'
                )}>
                  <List className="h-4 w-4 mr-2" /> List
                </TabsTrigger>
                <TabsTrigger value="map" className={cn(
                  'rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all hover:cursor-pointer'
                )}>
                  <MapIcon className="h-4 w-4 mr-2" /> Map
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                <ListView deals={filteredDeals} />
              </TabsContent>
              <TabsContent value="map">
                <MapView deals={filteredDeals} userLocation={userLocation} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
