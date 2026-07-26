"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FlowingContentProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
}

const variants = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
};

export default function FlowingContent({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
}: FlowingContentProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      variants={variants[direction]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
