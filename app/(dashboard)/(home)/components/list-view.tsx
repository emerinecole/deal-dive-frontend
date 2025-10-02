import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy data for deals
const dummyDeals = [
  {
    id: 1,
    title: "50% Off Electronics",
    description: "Amazing deals on laptops and phones at TechMart. Limited time offer on premium brands.",
    price: "$299",
    originalPrice: "$599",
    category: "Electronics",
    location: "New York, NY",
    expiresIn: "2 days",
  },
  {
    id: 2,
    title: "Restaurant Week Special",
    description: "3-course meal for $35 at Giovanni's Italian Restaurant. Includes appetizer, main course, and dessert.",
    price: "$35",
    originalPrice: "$65",
    category: "Food & Dining",
    location: "Times Square, NY",
    expiresIn: "5 days",
  },
  {
    id: 3,
    title: "Gym Membership Deal",
    description: "6 months for the price of 3 at FitLife Gym. Access to all equipment and group classes included.",
    price: "$150",
    originalPrice: "$300",
    category: "Health & Fitness",
    location: "Midtown, NY",
    expiresIn: "1 week",
  },
  {
    id: 4,
    title: "Fashion Sale",
    description: "Up to 70% off designer clothing at StyleHub. End of season clearance on premium brands.",
    price: "$89",
    originalPrice: "$299",
    category: "Fashion",
    location: "SoHo, NY",
    expiresIn: "3 days",
  },
  {
    id: 5,
    title: "Spa Package Deal",
    description: "Full day spa package including massage, facial, and access to all facilities at Serenity Spa.",
    price: "$199",
    originalPrice: "$350",
    category: "Beauty & Wellness",
    location: "Upper East Side, NY",
    expiresIn: "1 week",
  },
];

export default function ListView() {
  return (
    <div className="space-y-4">
      {dummyDeals.map((deal) => (
        <Card key={deal.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{deal.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {deal.category} • {deal.location}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{deal.price}</div>
                <div className="text-sm text-muted-foreground line-through">
                  {deal.originalPrice}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">{deal.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Expires in {deal.expiresIn}
              </span>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details →
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
