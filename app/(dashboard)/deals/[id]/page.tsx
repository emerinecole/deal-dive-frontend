'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getDeal } from '@/lib/services/deal-service';
import { getVotes } from '@/lib/services/vote-service';
import { getComments } from '@/lib/services/comment-service';
import { Deal } from '@/lib/types/deals';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { UUID } from 'crypto';

import { useVoting } from './hooks/use-voting';
import { useComments } from './hooks/use-comments';
import { useReporting } from './hooks/use-reporting';
import { DealHeader } from './components/deal-header';
import { VotingSection } from './components/voting-section';
import { CommentSection } from './components/comment-section';
import { ReportDialog } from './components/report-dialog';

import Link from "next/link";

import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);
  const from = searchParams.get('from') || 'list';

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<UUID | null>(null);

  const [commentCount, setCommentCount] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const voting = useVoting(deal, userId);
  const commentsHook = useComments(id, userId);
  const reporting = useReporting(id, userId);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id as UUID);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const data = await getDeal(id);
        setDeal(data);

        if (data.latitude && data.longitude) {
          setPosition({ lat: data.latitude, lng: data.longitude });
        } else if (data.address) {
          const geocodeRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              data.address
            )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const geocodeData = await geocodeRes.json();
          if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
            const loc = geocodeData.results[0].geometry.location;
            setPosition({ lat: loc.lat, lng: loc.lng });
          } else {
            setPosition(null);
          }
        } else {
          setPosition(null);
        }
      } catch (err) {
        setError('Failed to load deal: ' + err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        if (Array.isArray(commentsData)) {
          commentsHook.setComments(commentsData);
          setCommentCount(commentsData.length);
        } else {
          commentsHook.setComments([]);
          setCommentCount(0);
        }
      } catch {
        commentsHook.setComments([]);
        setCommentCount(0);
      }
    };

    fetchComments();
  }, [id, commentsHook]);

  useEffect(() => {
    if (!id) return;

    const fetchVotes = async () => {
      try {
        const votesData = await getVotes(id);
        if (votesData?.votes && Array.isArray(votesData.votes)) {
          const upvotes = votesData.votes.filter(v => v.vote_type === 1).length;
          const downvotes = votesData.votes.filter(v => v.vote_type === -1).length;
          setUpvoteCount(upvotes);
          setDownvoteCount(downvotes);

          if (userId) {
            const myVote = votesData.votes.find(v => v.user_id === userId);
            if (myVote) voting.setUserVote(myVote.vote_type);
          }
        }
      } catch {}
    };

    fetchVotes();
  }, [id, userId, voting]);

  const handleBack = () => {
    if (from === 'my-deals') router.push('/my-deals');     
    else if (from === 'map') router.push('/?tab=map');      
    else router.push('/?tab=list');                         
  };

  if (loading)
    return (
      <div className="p-6">
        <p className="text-blue-700">Loading deal...</p>
      </div>
    );

  if (error || !deal)
    return (
      <div className="p-6 space-y-4">
        <p className="text-red-500">{error ?? 'Deal not found'}</p>
        <Button
          className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
          onClick={handleBack}
        >
          Go Back
        </Button>
      </div>
    );

  const directionsUrl = position
    ? `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`
    : deal.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(deal.address)}`
    : null;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-blue-50 to-blue-100 min-h-screen">
      <DealHeader deal={deal} saved={saved} onSaveToggle={() => setSaved((s) => !s)} />

      <p className="text-sm text-blue-900">{deal.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <VotingSection
          upvotes={upvoteCount}
          downvotes={downvoteCount}
          userVote={voting.userVote}
          voteBusy={voting.voteBusy}
          disabled={!userId}
          onVote={(voteType) => {
            voting.handleVote(voteType, upvoteCount, downvoteCount, (up, down) => {
              setUpvoteCount(up);
              setDownvoteCount(down);
            });
          }}
        />
        <div className="space-y-1">
          <div className="text-xs uppercase text-blue-700/70">Comments</div>
          <div className="text-sm text-blue-900">{commentCount}</div>
        </div>
      </div>

      <CommentSection
        comments={commentsHook.comments}
        comment={commentsHook.comment}
        commentsBusy={commentsHook.commentsBusy}
        userId={userId}
        onCommentChange={commentsHook.setComment}
        onAddComment={() => commentsHook.handleAddComment((count) => setCommentCount(count))}
        onDeleteComment={(commentId) => commentsHook.handleDeleteComment(commentId, (count) => setCommentCount(count))}
      />
      <div className="flex justify-between mt-4 gap-3">
        {/* Left side buttons */}
        <div className="flex gap-3">
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
            onClick={() => reporting.setShowReportDialog(true)}
            disabled={!userId}
          >
            Report Deal
          </Button>
        </div>

        {/* Right side button */}
        {userId === deal.created_by && (
          <Button
            className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
            asChild
          >
            <Link href={`/deals/${deal.id}/edit`}>Edit Deal</Link>
          </Button>
        )}
      </div>
      <ReportDialog
        isOpen={reporting.showReportDialog}
        reportReason={reporting.reportReason}
        reportBusy={reporting.reportBusy}
        onReasonChange={reporting.setReportReason}
        onSubmit={reporting.handleReport}
        onClose={() => {
          reporting.setShowReportDialog(false);
          reporting.setReportReason('');
        }}
      />
      {position ? (
        <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md mt-6">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={position}
            zoom={15}
          >
            <Marker position={position} onClick={() => setShowInfo(true)} />
            {showInfo && (
              <InfoWindow position={position} onCloseClick={() => setShowInfo(false)}>
                <div className="text-sm space-y-1">
                  <div className="font-semibold text-blue-900">{deal.title}</div>
                  {deal.address && <div className="text-blue-700">{deal.address}</div>}
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
          </GoogleMap>
        </div>
      ) : (
        <p className="text-blue-700 text-sm mt-2">No map location available</p>
      )}
    </div>
  );
}