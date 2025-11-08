'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LocationPicker, FormData as LocationFormData } from './locationPicker';
import { createDeal } from '@/lib/services/deal-service';
import { CreateDealInput } from '@/lib/types/deals';
import { createClient } from '@/lib/supabase/client';
import { UUID } from 'crypto';
import {
  DollarSign,
  MapPin,
  FileText,
  Tag,
  CheckCircle2,
  Gift,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountedPrice: '',
    originalPrice: '',
  });

  const [location, setLocation] = useState<LocationFormData>({
    address: '',
    lat: 0,
    lng: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.title || !formData.description || !formData.discountedPrice) {
        throw new Error('Please fill in all required fields');
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const dealData: CreateDealInput = {
        created_by: user?.id as UUID,
        title: formData.title,
        description: formData.description,
        discounted_price: parseFloat(formData.discountedPrice),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        address: location.address,
        latitude: location.lat,
        longitude: location.lng,
      };

      await createDeal(dealData);
      setSuccess(true);
      setFormData({ title: '', description: '', discountedPrice: '', originalPrice: '' });
      setLocation({ address: '', lat: 0, lng: 0 });
      setCurrentStep(1);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Pricing', icon: DollarSign },
    { number: 3, title: 'Location', icon: MapPin },
  ];

  const calculateSavings = () => {
    if (formData.originalPrice && formData.discountedPrice) {
      const original = parseFloat(formData.originalPrice);
      const discounted = parseFloat(formData.discountedPrice);
      if (original > discounted && !isNaN(original) && !isNaN(discounted)) {
        return Math.round(((original - discounted) / original) * 100);
      }
    }
    return 0;
  };

  const savings = calculateSavings();
  const isStep1Complete = formData.title && formData.description;
  const isStep2Complete = formData.discountedPrice;

  const ContinueButton = ({ onClick, disabled, children, className = '' }: { onClick: () => void; disabled: boolean; children: React.ReactNode; className?: string }) => (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        !disabled
          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
          : 'bg-blue-600 text-white opacity-50',
        className
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
      <div className="relative z-0 max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 border border-blue-200 backdrop-blur-sm">
            <span className="text-sm font-semibold text-blue-600">Share a Deal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Create Your Deal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {"Help your community save money by sharing amazing local deals"}
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div key={step.number} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300',
                      isCompleted
                        ? 'bg-blue-200 text-blue-800 shadow-md'
                        : isCurrent
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg scale-110'
                        : 'bg-blue-100 text-gray-600'
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium text-gray-900',
                      isCurrent && 'font-bold'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'h-1 w-16 rounded-full transition-all duration-300',
                    isCompleted ? 'bg-blue-300' : 'bg-blue-100'
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Success */}
        {success && (
          <div className="bg-blue-100/40 border-2 border-blue-200 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-blue-600">{"Deal Created Successfully!"}</h3>
                <p className="text-sm text-gray-600">{"Your deal is now live and helping the community save money!"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-red-600">{"Oops!"}</h3>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-blue-200 shadow-2xl shadow-blue-100/20 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-blue-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Deal Details</h2>
                    <p className="text-sm text-gray-600">Tell us about this deal</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Tag className="h-4 w-4 text-blue-600" />
                      Deal Title <span className="text-red-600">*</span>
                    </label>
                    <Input
                      name="title"
                      placeholder="e.g., 50% Off All Pizzas at Joe's Pizzeria"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="h-12 text-base rounded-xl border-blue-200 focus-visible:ring-blue-200 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Description <span className="text-red-600">*</span>
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Describe the deal in detail. What makes it special? Any restrictions or terms?"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      rows={4}
                      className="text-base rounded-xl border-blue-200 focus-visible:ring-blue-200 transition-all resize-none"
                    />
                  </div>
                </div>
                <ContinueButton
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStep1Complete}
                  className="w-full"
                >
                  Continue to Pricing <ArrowRight className="ml-2 h-4 w-4" />
                </ContinueButton>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-blue-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Pricing Information</h2>
                    <p className="text-sm text-gray-600">Show everyone the savings</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Zap className="h-4 w-4 text-blue-600" />
                      Deal Price <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        name="discountedPrice"
                        placeholder="29.99"
                        value={formData.discountedPrice}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        type="number"
                        step="0.01"
                        className="h-12 pl-10 text-base rounded-xl border-blue-200 focus-visible:ring-blue-200 transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Tag className="h-4 w-4 text-gray-400" />
                      Original Price (optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        name="originalPrice"
                        placeholder="59.99"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        disabled={loading}
                        type="number"
                        step="0.01"
                        className="h-12 pl-10 text-base rounded-xl border-blue-200 focus-visible:ring-blue-200 transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-blue-50/50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Gift className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Savings</p>
                        <p className="text-2xl font-bold text-gray-900">{savings}% OFF</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl hover:bg-blue-100/50 transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <ContinueButton
                    onClick={() => setCurrentStep(3)}
                    disabled={!isStep2Complete}
                    className="flex-1"
                  >
                    Continue to Location <ArrowRight className="ml-2 h-4 w-4" />
                  </ContinueButton>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-blue-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Where&apos;s the Deal?</h2>
                    <p className="text-sm text-gray-600">Pin the exact location</p>
                  </div>
                </div>

                <LocationPicker formData={location} setFormData={setLocation} />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl hover:bg-blue-100/50 transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-200/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mr-2" />
                        Creating Deal...
                      </>
                    ) : (
                      <>Publish Deal</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
