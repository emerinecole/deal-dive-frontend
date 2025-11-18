import { useState, useEffect } from 'react';
import { saveDeal, unsaveDeal, getSavedDeals } from '@/lib/services/saved-deal-service';
import { UUID } from 'crypto';

export function useSaveDeal(dealId: string | undefined, userId: UUID | null) {
  const [saved, setSaved] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);

  // Check if deal is already saved on mount
  useEffect(() => {
    if (!dealId || !userId) return;

    const checkSavedStatus = async () => {
      try {
        const savedDeals = await getSavedDeals();
        const isSaved = savedDeals.some(deal => String(deal.id) === dealId);
        setSaved(isSaved);
      } catch (err) {
        console.error('Failed to check saved status:', err);
      }
    };

    checkSavedStatus();
  }, [dealId, userId]);

  const handleToggleSave = async () => {
    if (!dealId || !userId) return;
    
    setSaveBusy(true);
    try {
      if (saved) {
        await unsaveDeal(dealId);
        setSaved(false);
      } else {
        await saveDeal(dealId);
        setSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
      alert('Failed to save deal. Please try again.');
    } finally {
      setSaveBusy(false);
    }
  };

  return {
    saved,
    setSaved,
    saveBusy,
    handleToggleSave,
  };
}

