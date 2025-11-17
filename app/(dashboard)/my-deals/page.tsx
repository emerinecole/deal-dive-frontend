'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/app/providers/supabase-provider';
import { Deal } from '@/lib/types/deals';
import { getDeals } from '@/lib/services/deal-service';
import Link from 'next/link';
import {
  MapPin,
  DollarSign,
  TrendingDown,
  ArrowRight,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyDealsPage() {
  const { supabase } = useSupabase();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDeals = async () => {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      if (!user?.id) {
        setDeals([]);
        setLoading(false);
        return;
      }

      try {
        const allDeals = await getDeals();

        const userDeals = allDeals.filter(deal => deal.created_by === user.id);

        setDeals(userDeals);
      } catch (error) {
        alert('Error fetching deals');
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDeals();
  }, [supabase]);

  const calculateSavings = (original?: number, discounted?: number) => {
    if (original && discounted && original > discounted) {
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  };

  const capitalizeWords = (str: string) =>
    str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  if (loading) return <div className="p-12 text-blue-700">Loading your deals...</div>;

  if (!userId) {
    return (
      <div className="p-12 text-red-500">
        You must be logged in to view your deals.
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-blue-200 shadow-xl p-12 text-blue-900 text-center">
        <Package className="h-10 w-10 mx-auto mb-4 text-blue-700" />
        <h3 className="text-2xl font-bold mb-2">No Deals Yet</h3>
        <p className="text-blue-700/80 max-w-md mx-auto mb-6">
          You haven’t created any deals yet. Share an amazing deal with the community!
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-blue-300/50"
        >
          Create First Deal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">My Deals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const savings = calculateSavings(deal.original_price, deal.discounted_price);
          const visibleTags = deal.tags?.slice(0, 3) || [];
          const hasMoreTags = deal.tags && deal.tags.length > 3;

          return (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}?from=my-deals`}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200 shadow-md hover:shadow-lg hover:shadow-blue-200/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full relative">

                {savings > 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      {savings}% OFF
                    </div>
                  </div>
                )}

                <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300" />

                <div className="p-5 flex flex-col flex-1 text-blue-900">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {deal.title}
                  </h3>

                  <div className="flex items-start gap-2 text-sm text-blue-700/80 mb-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                    <span className="line-clamp-1">{deal.address || 'No address'}</span>
                  </div>

                  <p className="text-sm text-blue-800/70 line-clamp-3 mb-3 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Categories & Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {deal.categories?.map((cat, idx) => (
                      <span
                        key={`cat-${idx}`}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full border border-blue-200"
                      >
                        {capitalizeWords(cat)}
                      </span>
                    ))}

                    {visibleTags.map((tag, idx) => (
                      <span
                        key={`tag-${idx}`}
                        className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full border border-green-200"
                      >
                        #{tag}
                      </span>
                    ))}

                    {hasMoreTags && (
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full border border-gray-200">
                        …
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-blue-200 mt-auto">
                    <div className="flex items-end justify-between mt-3">
                      <div className="space-y-1">
                        <p className="text-xs text-blue-700/70 font-medium">Deal Price</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-blue-900 flex items-start">
                            <DollarSign className="h-4 w-4 mt-1" />
                            {deal.discounted_price}
                          </span>
                        </div>
                      </div>

                      {deal.original_price && (
                        <div className="text-right space-y-1">
                          <p className="text-xs text-blue-700/70 font-medium">Original</p>
                          <span className="text-sm text-blue-700/60 line-through flex items-start">
                            <DollarSign className="h-3 w-3 mt-1" />
                            {deal.original_price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div
                      className={cn(
                        'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl',
                        'bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300',
                        'group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white',
                        'transition-all duration-300 font-semibold text-sm'
                      )}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
