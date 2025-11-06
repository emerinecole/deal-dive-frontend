import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ReportDialogProps {
  isOpen: boolean;
  reportReason: string;
  reportBusy: boolean;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function ReportDialog({
  isOpen,
  reportReason,
  reportBusy,
  onReasonChange,
  onSubmit,
  onClose,
}: ReportDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
        <h2 className="text-xl font-bold">Report Deal</h2>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Reason for reporting:</label>
          <Input
            placeholder="Enter reason..."
            value={reportReason}
            onChange={(e) => onReasonChange(e.target.value)}
            disabled={reportBusy}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={reportBusy}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={reportBusy || !reportReason.trim()}
          >
            {reportBusy ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </div>
    </div>
  );
}

