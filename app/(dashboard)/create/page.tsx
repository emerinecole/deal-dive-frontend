'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LocationPicker, FormData as LocationFormData } from "./locationPicker";
import { createDeal } from '@/lib/services/deal-service';
import { CreateDealInput } from '@/lib/types/deals';
import { createClient } from '@/lib/supabase/client';
import { UUID } from 'crypto';
import { 
  Sparkles, 
  DollarSign, 
  MapPin, 
  FileText, 
  Tag, 
  CheckCircle2,
  Zap,
  Gift,
  ArrowRight,
  ArrowLeft,
  Check
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
        geom: null,
      };

      await createDeal(dealData);
      setSuccess(true);

      setFormData({
        title: '',
        description: '',
        discountedPrice: '',
        originalPrice: '',
      });

      setLocation({ address: '', lat: 0, lng: 0 });
      setCurrentStep(1);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  // Step configuration
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

  // Reusable continue button
  const ContinueButton = ({
    onClick,
    disabled,
    children,
    className = ''
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
          !disabled
            ? 'bg-black text-white shadow-md hover:bg-[#1a1a1a]'
            : 'bg-black text-white opacity-50',
          className
        )}
      >
        {children}
      </Button>
    );
  };

  // UI: Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-0 max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Share a Deal</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Create Your Deal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help your community save money by sharing amazing local deals
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
                        ? 'bg-muted text-foreground shadow-lg'
                        : isCurrent
                        ? 'bg-gradient-to-br from-primary to-primary/70 text-white shadow-lg shadow-primary/30 scale-110'
                        : 'bg-muted/50 text-foreground'
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium text-foreground',
                      isCurrent && 'font-bold'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-1 w-16 rounded-full transition-all duration-300',
                      isCompleted ? 'bg-muted' : 'bg-muted/50'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Success */}
        {success && (
          <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 border-2 border-secondary/30 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-secondary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-secondary">Deal Created Successfully! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  Your deal is now live and helping the community save money!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-destructive">Oops!</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/40 shadow-2xl shadow-primary/5 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* UI: Step 1 – Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Deal Details</h2>
                    <p className="text-sm text-muted-foreground">Tell us about this deal</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <Tag className="h-4 w-4 text-primary" />
                      Deal Title <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="title"
                      placeholder="e.g., 50% Off All Pizzas at Joe's Pizzeria"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="h-12 text-base rounded-xl border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4 text-primary" />
                      Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Describe the deal, restrictions, and what makes it special"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      rows={4}
                      className="text-base rounded-xl border-border/50 resize-none"
                    />
                  </div>
                </div>

                <ContinueButton
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStep1Complete}
                  className="w-full"
                >
                  Continue to Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ContinueButton>
              </div>
            )}

            {/* UI: Step 2 – Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Pricing Information</h2>
                    <p className="text-sm text-muted-foreground">Show everyone the savings</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Zap className="h-4 w-4 text-primary" />
                      Deal Price <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="discountedPrice"
                        placeholder="29.99"
                        value={formData.discountedPrice}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        type="number"
                        step="0.01"
                        className="h-12 pl-10 text-base rounded-xl border-border/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Original Price (optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="originalPrice"
                        placeholder="59.99"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        disabled={loading}
                        type="number"
                        step="0.01"
                        className="h-12 pl-10 text-base rounded-xl border-border/50"
                      />
                    </div>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="bg-muted/30 border-2 border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Gift className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
                        <p className="text-2xl font-bold text-foreground">{savings}% OFF</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <ContinueButton
                    onClick={() => setCurrentStep(3)}
                    disabled={!isStep2Complete}
                    className="flex-1"
                  >
                    Continue to Location
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ContinueButton>
                </div>
              </div>
            )}

            {/* UI: Step 3 – Location */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Where's the Deal?</h2>
                    <p className="text-sm text-muted-foreground">Pin the exact location</p>
                  </div>
                </div>

                <LocationPicker formData={location} setFormData={setLocation} />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Creating Deal...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Publish Deal
                      </>
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