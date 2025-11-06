'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LocationPicker, FormData as LocationFormData } from "./locationPicker";
import { createDeal } from '@/lib/services/deal-service';
import { CreateDealInput } from '@/lib/types/deals';
//import { getUser } from '@/lib/supabase-auth';
import { createClient } from '@/lib/supabase/client';
import { UUID } from 'crypto';

export default function CreatePage() {
  // Main form data (everything except location)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    disountedPrice: '',
    originalPrice: '',
  });

  // Location state handled by LocationPicker
  const [location, setLocation] = useState<LocationFormData>({
    address: '',
    lat: 0,
    lng: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle regular input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.disountedPrice) {
        throw new Error('Please fill in all required fields');
      }

      // if (!location.address || location.lat === 0 || location.lng === 0) {
      //   throw new Error('Please select a valid location');
      // }

      // Read current user from Supabase (client-side)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Prepare deal data
      const dealData: CreateDealInput = {
        created_by: user?.id as UUID,
        title: formData.title,
        description: formData.description,
        discounted_price: parseFloat(formData.disountedPrice),
        original_price: parseFloat(formData.originalPrice),
        address: location.address,
        latitude: location.lat,
        longitude: location.lng,
      };

      // Create the deal
      await createDeal(dealData);
      
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        disountedPrice: '',
        originalPrice: '',
      });
      setLocation({ address: '', lat: 0, lng: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create</h1>
        <p className="text-muted-foreground">
          Create new deals, campaigns, and content.
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Deal created successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 max-w-md">
        <Input
          name="title"
          placeholder="Deal Title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <Input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <Input
          name="disountedPrice"
          placeholder="Discounted Price (e.g., $29.99)"
          value={formData.disountedPrice}
          onChange={handleChange}
          required
          disabled={loading}
          type="number"
        />
        <Input
          name="originalPrice"
          placeholder="Original Price (optional)"
          value={formData.originalPrice}
          onChange={handleChange}
          disabled={loading}
          type="number"
        />

        {/* Location Picker */}
        <LocationPicker formData={location} setFormData={setLocation} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Deal...' : 'Create Deal'}
        </Button>
      </form>

    </div>
  );
}
