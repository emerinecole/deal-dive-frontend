import { LucideIcon } from "lucide-react";

interface SignupCoverItemProps {
  text: string;
  Icon: LucideIcon;
  textColor?: string; 
  iconColor?: string;   
}

export default function SignupCoverItem({
  text,
  Icon,
  textColor = "text-white",
  iconColor = "text-white",
}: SignupCoverItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`h-6 w-6 ${iconColor}`} />
      <span className={`text-sm font-medium ${textColor}`}>{text}</span>
    </div>
  );
}