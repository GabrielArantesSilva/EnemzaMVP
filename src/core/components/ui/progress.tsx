import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/core/lib/utils";

function Progress({
  className,
  value,
  indicatorColor,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** Cor do preenchimento — ex: cor fixa de um Modulo. Default: bg-primary (azul). */
  indicatorColor?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out",
          !indicatorColor && "bg-primary",
        )}
        style={{
          transform: `translateX(-${100 - (value ?? 0)}%)`,
          backgroundColor: indicatorColor,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
