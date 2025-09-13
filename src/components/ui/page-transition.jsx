import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const PageTransition = ({
  children,
  className,
  variant = "fade",
  duration = 0.3,
  ...props
}) => {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
    blur: {
      initial: { opacity: 0, filter: "blur(4px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(4px)" },
    },
  };

  const selectedVariant = variants[variant] || variants.fade;

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={{
        duration,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredList = ({
  children,
  className,
  staggerDelay = 0.1,
  ...props
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("w-full", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const FadeInWhenVisible = ({
  children,
  className,
  threshold = 0.1,
  triggerOnce = true,
  ...props
}) => {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      }}
      viewport={{
        threshold,
        once: triggerOnce,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const ScaleOnHover = ({
  children,
  className,
  scale = 1.05,
  duration = 0.2,
  ...props
}) => {
  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      whileHover={{
        scale,
        transition: { duration },
      }}
      whileTap={{
        scale: scale * 0.95,
        transition: { duration: 0.1 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FloatingElement = ({
  children,
  className,
  amplitude = 10,
  duration = 3,
  ...props
}) => {
  return (
    <motion.div
      className={cn("w-full", className)}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const PulseOnMount = ({
  children,
  className,
  scale = 1.1,
  duration = 0.6,
  ...props
}) => {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{ scale: 1 }}
      animate={{
        scale: [1, scale, 1],
        transition: {
          duration,
          ease: "easeInOut",
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SlideInFromSide = ({
  children,
  className,
  direction = "left",
  distance = 100,
  duration = 0.5,
  delay = 0,
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "left":
        return { x: -distance };
      case "right":
        return { x: distance };
      case "top":
        return { y: -distance };
      case "bottom":
        return { y: distance };
      default:
        return { x: -distance };
    }
  };

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{
        opacity: 0,
        ...getInitialPosition(),
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const TypewriterText = ({
  text,
  className,
  speed = 50,
  cursor = true,
  ...props
}) => {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <motion.span className={cn("inline-block", className)} {...props}>
      {displayText}
      {cursor && currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
};
