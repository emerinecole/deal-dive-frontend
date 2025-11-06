import { useState } from 'react';
import { addReport } from '@/lib/services/report-service';
import { UUID } from 'crypto';

export function useReporting(dealId: string | undefined, userId: UUID | null) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportBusy, setReportBusy] = useState(false);

  const handleReport = async () => {
    if (!dealId || !userId || !reportReason.trim()) return;
    
    setReportBusy(true);
    try {
      await addReport(dealId, {
        userId,
        reason: reportReason.trim()
      });
      setShowReportDialog(false);
      setReportReason('');
      alert('Report submitted successfully.');
    } catch (err) {
      console.error('Failed to report deal:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setReportBusy(false);
    }
  };

  return {
    showReportDialog,
    setShowReportDialog,
    reportReason,
    setReportReason,
    reportBusy,
    handleReport,
  };
}

