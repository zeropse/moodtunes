import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LoadingSpinner = ({
  size = "md",
  className,
  color = "primary",
  text,
  ...props
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-blue-500",
    secondary: "text-gray-500",
    white: "text-white",
    purple: "text-purple-500",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "border-2 border-transparent rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{
          borderTopColor: "currentColor",
          borderRightColor: "currentColor",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {text && (
        <motion.p
          className={cn("text-sm font-medium", colorClasses[color])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const PulsingDots = ({ className, color = "primary", size = "md" }) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const colorClasses = {
    primary: "bg-blue-500",
    secondary: "bg-gray-500",
    white: "bg-white",
    purple: "bg-purple-500",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn("rounded-full", sizeClasses[size], colorClasses[color])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const WaveLoader = ({ className, color = "primary", size = "md" }) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  const colorClasses = {
    primary: "bg-blue-500",
    secondary: "bg-gray-500",
    white: "bg-white",
    purple: "bg-purple-500",
  };

  return (
    <div className={cn("flex items-end gap-1", sizeClasses[size], className)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={cn("w-1 rounded-full", colorClasses[color])}
          animate={{
            height: ["20%", "100%", "20%"],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const BouncingBalls = ({
  className,
  color = "primary",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    primary: "bg-blue-500",
    secondary: "bg-gray-500",
    white: "bg-white",
    purple: "bg-purple-500",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn("rounded-full", sizeClasses[size], colorClasses[color])}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
