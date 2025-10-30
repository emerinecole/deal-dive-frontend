import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Deal } from "@/lib/types/deals";

interface ListViewProps {
  deals: Deal[];
}

export default function ListView({ deals }: ListViewProps) {
  if (deals.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No deals found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <Card key={deal.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{deal.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {deal.address}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">${deal.discounted_price}</div>
                {deal.original_price && (
                  <div className="text-sm text-muted-foreground line-through">
                    ${deal.original_price}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">{deal.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {deal.upvotes} upvotes
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {deal.comment_count} comments
                </span>
              </div>
              <Link
                href={`/deals/${deal.id}?from=list`}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
