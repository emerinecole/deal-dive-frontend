import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  saved: boolean;
  busy: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export function SaveButton({ saved, busy, disabled, onToggle }: SaveButtonProps) {
  return (
    <Button
      variant={saved ? 'default' : 'secondary'}
      size="sm"
      onClick={onToggle}
      disabled={busy || disabled}
    >
      {busy ? 'Saving...' : saved ? 'Saved' : 'Save'}
    </Button>
  );
}

