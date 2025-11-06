import {
  TrendingDown,
  MapPin,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import SignupCoverItem from "./signup-cover-item";

export default function SignupCover() {
  return (
    <div className="min-h-full bg-gradient-to-br from-white via-white to-blue-100 bg-cover bg-center py-8 px-10 text-gray-900 relative overflow-hidden">
      {/* Decorative blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      {/* Logos */}
      <div className="absolute top-8 left-8">
        <Image
          src="/images/deal-dive/iconLogo.png"
          alt="Icon Logo"
          width={80}
          height={80}
          className="drop-shadow-md"
        />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <Image
          src="/images/deal-dive/nameLogo.png"
          alt="Name Logo"
          width={320}   // Increased width
          height={60}   // Increased height
          className="drop-shadow-md"
        />
      </div>

      <div className="relative z-10 mt-48 flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-[42px] font-bold text-center leading-tight text-blue-900">
          Join the{" "}
          <span className="relative inline-block">
            <span className="relative z-10">savings community</span>
            <span
              className="absolute bottom-2 left-0 right-0 h-3 bg-blue-200 -rotate-1"
              style={{ zIndex: 0 }}
            />
          </span>
        </h1>
        <p className="text-center text-blue-700/80 mt-4 text-lg max-w-2xl mx-auto">
          Discover amazing local deals and help your community save money
        </p>

        {/* Features Grid */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <SignupCoverItem
              text="Share incredible deals you discover at local businesses"
              Icon={TrendingDown}
              textColor="text-blue-900"
              iconColor="text-blue-500"
            />
            <SignupCoverItem
              text="Find nearby discounts and special offers in real-time"
              Icon={MapPin}
              textColor="text-blue-900"
              iconColor="text-blue-500"
            />
            <SignupCoverItem
              text="Connect with fellow deal hunters in your area"
              Icon={Users}
              textColor="text-blue-900"
              iconColor="text-blue-500"
            />
            <SignupCoverItem
              text="Get instant notifications when new deals are posted"
              Icon={Zap}
              textColor="text-blue-900"
              iconColor="text-blue-500"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-md rounded-2xl px-8 py-6 border border-blue-200">
            <div>
              <div className="text-3xl font-bold text-blue-900">Free</div>
              <div className="text-sm text-blue-700 mt-1">No subscriptions</div>
            </div>
            <div className="w-px h-12 bg-blue-200" />
            <div>
              <div className="text-3xl font-bold text-blue-900">Live</div>
              <div className="text-sm text-blue-700 mt-1">Fresh deals daily</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
