import clsx from "clsx";
import { Loader2 } from "lucide-react";

export const Loader = ({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return <Loader2 size={size} className={clsx("animate-spin", className)} />;
};
