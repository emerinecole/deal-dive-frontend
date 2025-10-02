import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-top justify-center">
      <div className="w-full md:max-w-xl">
        <div className="my-16 flex justify-center">
          <Image
            src="/images/deal-dive/logo.png"
            alt="Logo"
            width={200}
            height={100}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
