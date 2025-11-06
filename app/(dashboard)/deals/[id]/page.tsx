'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getDeal, updateDeal } from '@/lib/services/deal-service';
import { Deal } from '@/lib/types/deals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteBusy, setVoteBusy] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const from = searchParams.get('from') || 'list';

  useEffect(() => {
    if (!id) return;
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const data = await getDeal(id);
        setDeal(data);
      } catch (err) {
        setError('Failed to load deal: ' + err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const handleBack = () => {
    if (from === 'map') router.push('/?tab=map');
    else router.push('/?tab=list');
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading deal...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-500">{error ?? 'Deal not found'}</p>
        <Button variant="secondary" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  // Determine map location (lat/lng first, then address)
  const position = deal.latitude && deal.longitude
    ? { lat: deal.latitude, lng: deal.longitude }
    : null;

  const directionsUrl = position
    ? `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`
    : deal.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(deal.address)}`
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Title + price */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{deal.title}</h1>
          <p className="text-muted-foreground">{deal.address}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">${deal.discounted_price}</div>
          {deal.original_price && (
            <div className="text-sm text-muted-foreground line-through">${deal.original_price}</div>
          )}
          <div className="mt-2">
            <Button
              variant={saved ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSaved((s) => !s)}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{deal.description}</p>

      {/* Votes + comments */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase text-muted-foreground">Votes</div>
          <div className="flex items-center gap-3">
            <Button
              variant={userVote === 'up' ? 'default' : 'secondary'}
              size="sm"
              disabled={voteBusy}
              onClick={async () => {
                if (!deal) return;
                setVoteBusy(true);
                try {
                  let up = deal.upvotes;
                  let down = deal.downvotes;
                  if (userVote === 'up') {
                    up = Math.max(0, up - 1);
                    await updateDeal(String(deal.id), { upvotes: up });
                    setUserVote(null);
                  } else if (userVote === 'down') {
                    down = Math.max(0, down - 1);
                    up += 1;
                    await updateDeal(String(deal.id), { upvotes: up, downvotes: down });
                    setUserVote('up');
                  } else {
                    up += 1;
                    await updateDeal(String(deal.id), { upvotes: up });
                    setUserVote('up');
                  }
                  setDeal({ ...deal, upvotes: up, downvotes: down });
                } finally {
                  setVoteBusy(false);
                }
              }}
            >
              👍 {deal.upvotes}
            </Button>

            <Button
              variant={userVote === 'down' ? 'default' : 'secondary'}
              size="sm"
              disabled={voteBusy}
              onClick={async () => {
                if (!deal) return;
                setVoteBusy(true);
                try {
                  let up = deal.upvotes;
                  let down = deal.downvotes;
                  if (userVote === 'down') {
                    down = Math.max(0, down - 1);
                    await updateDeal(String(deal.id), { downvotes: down });
                    setUserVote(null);
                  } else if (userVote === 'up') {
                    up = Math.max(0, up - 1);
                    down += 1;
                    await updateDeal(String(deal.id), { upvotes: up, downvotes: down });
                    setUserVote('down');
                  } else {
                    down += 1;
                    await updateDeal(String(deal.id), { downvotes: down });
                    setUserVote('down');
                  }
                  setDeal({ ...deal, upvotes: up, downvotes: down });
                } finally {
                  setVoteBusy(false);
                }
              }}
            >
              👎 {deal.downvotes}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">Comments</div>
          <div className="text-sm">{deal.comment_count}</div>
        </div>
      </div>

      {/* Comment input */}
      <div className="space-y-2">
        <div className="text-xs uppercase text-muted-foreground">Add a comment</div>
        <div className="flex gap-2">
          <Input
            placeholder="Write a comment (not yet functional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setComment('');
            }}
          >
            Post
          </Button>
        </div>
      </div>

      {/* Map with deal location/directions link */}
      {isLoaded && (position || deal.address) ? (
        <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={position ?? { lat: 0, lng: 0 }}
            zoom={position ? 15 : 2}
          >
            {position && (
              <>
                <Marker position={position} onClick={() => setShowInfo(true)} />
                {showInfo && (
                  <InfoWindow position={position} onCloseClick={() => setShowInfo(false)}>
                    <div className="text-sm space-y-1">
                      <div className="font-semibold">{deal.title}</div>
                      <div>{deal.address}</div>
                      {directionsUrl && (
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Get Directions
                        </a>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </>
            )}
          </GoogleMap>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No map location available</p>
      )}

      {/* Back button */}
      <div>
        <Button variant="secondary" onClick={handleBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
