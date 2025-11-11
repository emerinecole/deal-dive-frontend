'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDeal, updateDeal, deleteDeal } from '@/lib/services/deal-service';
import { Deal } from '@/lib/types/deals';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { LocationPicker, FormData as LocationFormData } from '../../../create/locationPicker';
import { Input } from '@/components/ui/input';

export default function EditDealPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [deal, setDeal] = useState<Deal | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    discountedPrice: '',
    originalPrice: '',
  });

  const [location, setLocation] = useState<LocationFormData>({
    address: '',
    lat: 29.6535,
    lng: -82.3388,
  });

  // Fetch current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // Fetch deal data
  useEffect(() => {
    if (!id) return;
    const fetchDeal = async () => {
      setLoading(true);
      try {
        const data = await getDeal(id);
        setDeal(data);

        setForm({
          title: data.title,
          description: data.description,
          discountedPrice: data.discounted_price.toString(),
          originalPrice: data.original_price?.toString() || '',
        });

        setLocation({
          address: data.address,
          lat: data.latitude,
          lng: data.longitude,
        });
      } catch (err) {
        setError('Failed to load deal: ' + err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!deal) return;
    setSaving(true);
    try {
      await updateDeal(deal.id.toString(), {
        title: form.title,
        description: form.description,
        discounted_price: Number(form.discountedPrice),
        original_price: form.originalPrice ? Number(form.originalPrice) : undefined,
        address: location.address,
        latitude: location.lat,
        longitude: location.lng,
      });
      router.push(`/deals/${deal.id}`);
    } catch (err) {
      setError('Failed to save deal: ' + err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deal) return;
    const confirmed = confirm('Are you sure you want to delete this deal? This action cannot be undone.');
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteDeal(deal.id.toString());
      router.push('/my-deals');
    } catch (err) {
      setError('Failed to delete deal: ' + err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-6 text-blue-700">Loading deal...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!deal) return <div className="p-6 text-red-500">Deal not found</div>;
  if (deal.created_by !== userId)
    return <div className="p-6 text-red-500">You are not authorized to edit this deal.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Edit Deal</h1>

      {/* Two-column layout: Form on left, map on right */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-md space-y-6">
          <div className="space-y-4">
            <div>
              <label className="font-medium text-blue-900">Title</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Deal title"
              />
            </div>

            <div>
              <label className="font-medium text-blue-900">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 rounded-md border border-blue-200"
                placeholder="Deal description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-blue-900">Discounted Price</label>
                <Input
                  name="discountedPrice"
                  value={form.discountedPrice}
                  onChange={handleChange}
                  type="number"
                  placeholder="Discounted price"
                />
              </div>
              <div>
                <label className="font-medium text-blue-900">Original Price</label>
                <Input
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleChange}
                  type="number"
                  placeholder="Original price (optional)"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                className="flex-1 bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700 border border-red-600"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                className="flex-1 bg-white text-blue-700 hover:bg-blue-50 border border-blue-200"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 bg-white rounded-3xl p-6 shadow-md">
          <LocationPicker formData={location} setFormData={setLocation} />
        </div>
      </div>
    </div>
  );
}
