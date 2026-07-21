import { cn } from "@/core/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col gap-4 p-4 md:max-w-2xl md:gap-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
