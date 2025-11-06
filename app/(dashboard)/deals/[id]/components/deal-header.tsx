import { Deal } from '@/lib/types/deals';
import { Button } from '@/components/ui/button';

interface DealHeaderProps {
  deal: Deal;
  saved: boolean;
  onSaveToggle: () => void;
}

export function DealHeader({ deal, saved, onSaveToggle }: DealHeaderProps) {
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
          <Button
            variant={saved ? 'default' : 'secondary'}
            size="sm"
            onClick={onSaveToggle}
          >
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

