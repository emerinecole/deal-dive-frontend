import { LucideIcon } from "lucide-react";

export default function SignupCoverItem({
  text,
  Icon,
}: {
  text: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="flex flex-row gap-3 items-center">
      <div className="bg-white bg-opacity-10 rounded-lg p-2">
        <Icon className="w-4 h-4 opacity-80" />
      </div>
      <p className="text-sm opacity-80">{text}</p>
    </div>
  );
}
