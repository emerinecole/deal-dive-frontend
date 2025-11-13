import { Deal } from '@/lib/types/deals';
import { Button } from '@/components/ui/button';

interface DealHeaderProps {
  deal: Deal;
  saved: boolean;
  onSaveToggle: () => void;
}

export function DealHeader({ deal, saved, onSaveToggle }: DealHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-blue-900">{deal.title}</h1>
        {deal.address && <p className="text-sm text-blue-700/80">{deal.address}</p>}

        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {deal.categories && deal.categories.length > 0 && (
            deal.categories.map((cat, idx) => {
              const formattedCat = cat
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full border border-blue-200"
                >
                  {formattedCat}
                </span>
              );
            })
          )}

          {deal.tags && deal.tags.length > 0 && (
            deal.tags.map((tag, idx) => (
              <span
                key={`tag-${idx}`}
                className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full border border-green-200"
              >
                #{tag}
              </span>
            ))
          )}
        </div>
      </div>

      {/*Price & Save button */}
      <div className="text-right">
        <div className="text-3xl font-bold text-green-600">${deal.discounted_price}</div>
        {deal.original_price && (
          <div className="text-sm text-muted-foreground line-through">
            ${deal.original_price}
          </div>
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
