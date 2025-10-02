import {
  MessageSquareMore,
  MousePointer,
  PlayIcon,
  WandSparkles,
} from "lucide-react";
import Image from "next/image";
import SignupCoverItem from "./signup-cover-item";

export default function SignupCover() {
  return (
    <div className="min-h-full bg-[url('/images/sign-up/sign-up-cover.webp')] bg-cover bg-center py-6 px-7 text-white">
      <Image
        src="/images/deal-dive/logo.png"
        alt="Sign up cover"
        width={112}
        height={21}
      />
      <div className="mt-[70px] flex flex-col">
        <h1 className="text-[38px] font-medium text-center">
          Unlock your{" "}
          <span
            className="underline decoration-wavy decoration-[#407EEF] decoration-4 underline-offset-8"
            style={{
              textDecorationSkipInk: "none",
            }}
          >
            full potential
          </span>
        </h1>
      </div>
      <div className="mt-14 flex justify-center">
        <div className=" grid grid-cols-2 gap-6 max-w-2xl">
          <SignupCoverItem
            text="Provides insights around user intent and software UI"
            Icon={PlayIcon}
          />
          <SignupCoverItem
            text="Powers customer-facing chatbots and co-pilots by predicting intent"
            Icon={MessageSquareMore}
          />
          <SignupCoverItem
            text="Predictive AI guidance that provides visual overlays and walkthroughs"
            Icon={MousePointer}
          />
          <SignupCoverItem
            text="AI interacts with the UI on the user's behalf to execute workflows"
            Icon={WandSparkles}
          />
        </div>
      </div>
    </div>
  );
}
