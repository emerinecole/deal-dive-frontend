'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Deal type for the form
type Deal = {
  id: number;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  category: string;
  location: string;
  expiresIn?: string;
};

//dummy deals, only storing locally currently
const dummyDeals: Deal[] = [
  {
    id: 1,
    title: '50% Off Electronics',
    description: 'Amazing deals on laptops and phones',
    price: '$299',
    originalPrice: '$599',
    category: 'Electronics',
    location: 'New York, NY',
    expiresIn: '2 days',
  },
];

export default function CreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    location: '',
    expiresIn: '',
  });

  const [deals, setDeals] = useState<Deal[]>(dummyDeals);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal: Deal = {
      id: deals.length + 1,
      ...formData,
    };
    setDeals(prev => [...prev, newDeal]);

    alert('Deal created!');

    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      location: '',
      expiresIn: '',
    });
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create</h1>
        <p className="text-muted-foreground">
          Create new deals, campaigns, and content.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 max-w-md">
        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <Input
          name="originalPrice"
          placeholder="Original Price"
          value={formData.originalPrice}
          onChange={handleChange}
        />
        <Input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <Input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <Input
          name="expiresIn"
          placeholder="Expires In"
          value={formData.expiresIn}
          onChange={handleChange}
        />

        <Button type="submit" className="w-full">
          Create Deal
        </Button>
      </form>

      {/* Display current deals */}
      <div className="mt-6 max-w-md">
        <h2 className="text-xl font-semibold">Current Deals</h2>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          {deals.map((deal) => (
            <li key={deal.id}>
              {deal.title} — {deal.price} ({deal.category})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
