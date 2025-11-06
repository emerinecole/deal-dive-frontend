import { LucideIcon } from "lucide-react";

export default function SignupCoverItem({
  text,
  Icon,
}: {
  text: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="flex flex-row gap-4 items-start group hover:bg-white/5 p-4 rounded-xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-white/90 leading-relaxed pt-1">{text}</p>
    </div>
  );
}