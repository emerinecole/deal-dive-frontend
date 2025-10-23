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
  address: string;
  city: string;
  state: string;
  zipCode: string;
  expiresIn?: string;
  tags: string[];
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
    address: "123 Manhattan Ave",
    city: "New York City",
    state: "NY",
    zipCode: "12345",
    expiresIn: '2 days',
    tags: [],
  },
];

export default function CreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    expiresIn: '',
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const [deals, setDeals] = useState<Deal[]>(dummyDeals);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      address: '',
      city: '',
      state: '',
      zipCode: '',
      expiresIn: '',
      tags: [],
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
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="border rounded-md p-2 text-sm text-gray-700"
        >
          <option value="">Select Category</option>
          <option value="Restaurant/Bar">Restaurant/Bar</option>
          <option value="Retail">Retail</option>
          <option value="Grocery">Grocery</option>
        </select>
        <Input
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Input
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <Input
          name="zipCode"
          placeholder="Zip Code"
          value={formData.zipCode}
          onChange={handleChange}
          required
        />
        <Input
          name="expiresIn"
          placeholder="Expires In"
          value={formData.expiresIn}
          onChange={handleChange}
        />

        <div className="flex flex-col space-y-2">
          <label className="font-medium">Tags</label>

          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add a tag (e.g., Happy Hour, Outdoor Seating)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => {
                if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
                  setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()],
                  }));
                  setTagInput('');
                }
              }}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== index),
                    }))
                  }
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Deal
        </Button>
      </form>

      {/* Display current deals */}
      <div className="mt-6 max-w-md">
        <h2 className="text-xl font-semibold">Current Deals</h2>
        <ul className="list-disc ml-5 mt-2 space-y-3">
          {deals.map((deal) => (
            <li key={deal.id} className="border p-3 rounded-lg">
              <div className="font-semibold">{deal.title}</div>
              <div className="text-sm text-gray-600">{deal.price} — {deal.category}</div>
              <div className="text-xs text-gray-500">
                {deal.address}, {deal.city}, {deal.state} {deal.zipCode}
              </div>
              {deal.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {deal.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
