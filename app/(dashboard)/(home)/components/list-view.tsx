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
      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-blue-200 shadow-xl p-12 text-blue-900">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-200/40 to-blue-300/30 flex items-center justify-center">
            <Package className="h-10 w-10 text-blue-700" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-blue-900">No Deals Yet</h3>
            <p className="text-blue-700/80 max-w-md">
              Be the first to share an amazing deal with the community!
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-blue-300/50"
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const savings = calculateSavings(deal.original_price, deal.discounted_price);

          return (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}?from=list`}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-200 shadow-md hover:shadow-lg hover:shadow-blue-200/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
                {/* Savings Badge */}
                {savings > 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      {savings}% OFF
                    </div>
                  </div>
                )}

                {/* Gradient Header Line */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300" />

                <div className="p-5 flex flex-col flex-1 text-blue-900">
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {deal.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm text-blue-700/80 mb-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                    <span className="line-clamp-1">{deal.address}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-blue-800/70 line-clamp-3 mb-4 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Pricing */}
                  <div className="pt-3 border-t border-blue-200 mt-auto">
                    <div className="flex items-end justify-between mt-3">
                      <div className="space-y-1">
                        <p className="text-xs text-blue-700/70 font-medium">Deal Price</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-blue-900 flex items-start">
                            <DollarSign className="h-4 w-4 mt-1" />
                            {deal.discounted_price}
                          </span>
                        </div>
                      </div>

                      {deal.original_price && (
                        <div className="text-right space-y-1">
                          <p className="text-xs text-blue-700/70 font-medium">Original</p>
                          <span className="text-sm text-blue-700/60 line-through flex items-start">
                            <DollarSign className="h-3 w-3 mt-1" />
                            {deal.original_price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4">
                    <div
                      className={cn(
                        "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl",
                        "bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300",
                        "group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white",
                        "transition-all duration-300 font-semibold text-sm"
                      )}
                    >
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
    </div>
  );
}
