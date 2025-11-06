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
    <div className="min-h-full bg-gradient-to-br from-primary via-primary/90 to-secondary bg-cover bg-center py-8 px-10 text-white relative overflow-hidden">
      {/* Decorative blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Image
          src="/images/deal-dive/logo-white.png"
          alt="Logo"
          width={112}
          height={21}
          className="drop-shadow-lg"
        />
        
        <div className="mt-20 flex flex-col">
          <h1 className="text-[42px] font-bold text-center leading-tight">
            Join the{" "}
            <span className="relative inline-block">
              <span className="relative z-10">savings community</span>
              <span 
                className="absolute bottom-2 left-0 right-0 h-3 bg-white/20 -rotate-1"
                style={{ zIndex: 0 }}
              />
            </span>
          </h1>
          <p className="text-center text-white/80 mt-4 text-lg max-w-2xl mx-auto">
            Discover amazing local deals and help your community save money
          </p>
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <SignupCoverItem
              text="Share incredible deals you discover at local businesses"
              Icon={TrendingDown}
            />
            <SignupCoverItem
              text="Find nearby discounts and special offers in real-time"
              Icon={MapPin}
            />
            <SignupCoverItem
              text="Connect with fellow deal hunters in your area"
              Icon={Users}
            />
            <SignupCoverItem
              text="Get instant notifications when new deals are posted"
              Icon={Zap}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20">
            <div>
              <div className="text-3xl font-bold">Free</div>
              <div className="text-sm text-white/70 mt-1">No subscriptions</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-bold">Live</div>
              <div className="text-sm text-white/70 mt-1">Fresh deals daily</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}