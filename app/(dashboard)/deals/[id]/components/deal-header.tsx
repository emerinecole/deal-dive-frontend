import { Deal } from '@/lib/types/deals';
import { SaveButton } from './save-button';

interface DealHeaderProps {
  deal: Deal;
  saved: boolean;
  saveBusy: boolean;
  disabled: boolean;
  onSaveToggle: () => void;
}

export function DealHeader({ deal, saved, saveBusy, disabled, onSaveToggle }: DealHeaderProps) {
  return (
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
          <SaveButton
            saved={saved}
            busy={saveBusy}
            disabled={disabled}
            onToggle={onSaveToggle}
          />
        </div>
      </div>
    </div>
  );
}

