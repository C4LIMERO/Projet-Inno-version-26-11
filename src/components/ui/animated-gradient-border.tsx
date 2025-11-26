import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBorderProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  duration?: number;
  borderWidth?: number;
  animate?: boolean;
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  duration = 8,
  borderWidth = 2,
  animate = true,
}: AnimatedGradientBorderProps) {
  return (
    <div
      className={cn(
        "relative p-[2px] rounded-xl overflow-hidden",
        containerClassName
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary via-brand-secondary to-blue-600"
        style={{ 
          backgroundSize: "200% 200%" 
        }}
        animate={
          animate
            ? {
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }
            : undefined
        }
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <div
        className={cn(
          "relative z-10 bg-white dark:bg-gray-900 rounded-[calc(0.75rem-2px)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AnimatedGradientText({
  children,
  className,
  animate = true,
  duration = 8,
}: {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  duration?: number;
}) {
  return (
    <motion.div
      className={cn(
        "inline-block bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-secondary to-blue-600",
        className
      )}
      style={{ 
        backgroundSize: "200% 200%" 
      }}
      animate={
        animate
          ? {
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }
          : undefined
      }
      transition={{
        duration,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
} 