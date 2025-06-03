import { cn } from "@/lib/utils";

interface CircularLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function CircularLoader({
  size = "md",
  className,
}: CircularLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={cn(
          "animate-spin rounded-full border-gray-200 border-t-blue-600",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}
