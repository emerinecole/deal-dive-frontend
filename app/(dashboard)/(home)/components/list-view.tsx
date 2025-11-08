import Link from "next/link";
import { Deal } from "@/lib/types/deals";
import { 
  MapPin, 
  DollarSign, 
  TrendingDown, 
  ArrowRight,
  Sparkles,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ListViewProps {
  deals: Deal[];
}

export default function ListView({ deals }: ListViewProps) {
  if (deals.length === 0) {
    return (
      <div className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/40 shadow-2xl shadow-primary/5 p-12">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">No Deals Yet</h3>
            <p className="text-muted-foreground max-w-md">
              Be the first to share an amazing deal with the community!
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:scale-105 transition-transform shadow-lg shadow-primary/30"
          >
            <Sparkles className="h-4 w-4" />
            Create First Deal
          </Link>
        </div>
      </div>
    );
  }

  const calculateSavings = (original?: number, discounted?: number) => {
    if (original && discounted && original > discounted) {
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => {
        const savings = calculateSavings(deal.original_price, deal.discounted_price);
        
        return (
          <Link
            key={deal.id}
            href={`/deals/${deal.id}?from=list`}
            className="group"
          >
            <div className="h-full bg-background/80 backdrop-blur-xl rounded-2xl border border-border/40 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
              {/* Savings Badge */}
              {savings > 0 && (
                <div className="relative h-0">
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-br from-secondary/70 to-secondary/60 backdrop-blur-sm text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      {savings}% OFF
                    </div>
                  </div>
                </div>
              )}

              {/* Gradient Header */}
              <div className="h-2 bg-gradient-to-r from-primary via-primary to-secondary" />

              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <div className="h-[28px] mb-3 overflow-hidden">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {deal.title}
                  </h3>
                </div>
                
                {/* Location */}
                <div className="h-[20px] mb-4 overflow-hidden">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                    <span className="line-clamp-1">{deal.address}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="h-[42px] mb-4 overflow-hidden">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Pricing Section - Fixed height */}
                <div className="pt-4 border-t border-border/40 mb-3">
                  <div className="h-[60px] overflow-hidden">
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Deal Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-foreground flex items-start">
                            <DollarSign className="h-5 w-5 mt-1" />
                            {deal.discounted_price}
                          </span>
                        </div>
                      </div>

                      {deal.original_price && (
                        <div className="text-right space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Original</p>
                          <span className="text-lg text-muted-foreground line-through flex items-start">
                            <DollarSign className="h-3 w-3 mt-1" />
                            {deal.original_price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Details Button - Fixed height */}
                <div className="h-[44px]">
                  <div className={cn(
                    "flex items-center justify-center gap-2 w-full py-3 rounded-xl",
                    "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20",
                    "group-hover:from-primary group-hover:to-secondary group-hover:text-primary-foreground",
                    "transition-all duration-300 font-semibold text-sm"
                  )}>
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}