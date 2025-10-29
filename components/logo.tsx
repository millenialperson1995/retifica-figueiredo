import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/logo.png" alt="Retífica Figueiredo" width={40} height={40} />
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-none">Retífica Figueiredo</span>
      </div>
    </div>
  )
}
