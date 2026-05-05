"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight checkbox built on the native input — easier to integrate with
 * react-hook-form's `register` than the Radix primitive (which needs Controller).
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3 text-sm">
        <span className="relative mt-0.5 inline-flex h-5 w-5 items-center justify-center">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            className={cn(
              "peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-input bg-background",
              "checked:border-primary checked:bg-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute h-3.5 w-3.5 stroke-[3] text-primary-foreground opacity-0 peer-checked:opacity-100" />
        </span>
        {label && <span className="leading-snug text-foreground">{label}</span>}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
