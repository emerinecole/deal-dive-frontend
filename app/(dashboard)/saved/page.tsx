'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSavedDeals } from '@/lib/services/saved-deal-service';
import { Deal } from '@/lib/types/deals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SavedPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedDeals = async () => {
      try {
        setLoading(true);
        const data = await getSavedDeals();
        setDeals(data);
      } catch (err) {
        throw new Error('Failed to load saved deals:' + err);
        setError('Failed to load saved deals');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDeals();
  }, []);

  const handleDealClick = (dealId: number) => {
    router.push(`/deals/${dealId}?from=saved`);
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Saved Deals</h1>
          <p className="text-muted-foreground">Loading your saved deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Saved Deals</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Saved Deals</h1>
        <p className="text-muted-foreground">
          {deals.length === 0 
            ? "You haven't saved any deals yet."
            : `You have ${deals.length} saved ${deals.length === 1 ? 'deal' : 'deals'}.`
          }
        </p>
      </div>

      {deals.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <Card
              key={deal.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleDealClick(deal.id)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{deal.title}</CardTitle>
                <CardDescription className="line-clamp-1">{deal.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {deal.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">
                        ${deal.discounted_price}
                      </div>
                      {deal.original_price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${deal.original_price}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Deal
                    </Button>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>👍 {deal.upvotes}</span>
                    <span>👎 {deal.downvotes}</span>
                    <span>💬 {deal.comment_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

