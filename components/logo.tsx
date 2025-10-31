import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image src="/logo.png" alt="Retífica Figueiredo" width={40} height={40} />
    </div>
  )
}
