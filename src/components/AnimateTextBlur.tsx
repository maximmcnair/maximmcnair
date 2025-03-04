"use client";

import React from "react";
import { motion } from "motion/react";

const transition = { duration: 1, ease: [.25, .1, .25, 1] };
const variants = {
  hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
  visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

interface AnimateTextBlurProps {
  text: string
  delay?: number
}

export function AnimateTextBlur({ text, delay = 0 }: AnimateTextBlurProps) {
  const words = text.split(" ");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ staggerChildren: 0.22, delay }}
    >
      <h1 className="text-white z-90 text-sm lg:text-xl font-medium">
        {words.map((word, index) => (
          <React.Fragment key={index}>
            <motion.span className="inline-block" transition={transition} variants={variants}>
              {word}
            </motion.span>
            {index < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </h1>
    </motion.div>
  )
}
