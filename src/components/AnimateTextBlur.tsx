"use client";

import React from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { motion } from "motion/react";

const transition = { duration: 1, ease: [0.25, 0.1, 0.25, 1] };
const variants = {
  hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
  visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

interface AnimateTextBlurProps {
  text: string;
  delay?: number;
}

export function AnimateTextBlur({ text, delay = 0 }: AnimateTextBlurProps) {
  const words = text.split(" ");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ staggerChildren: 0.22, delay }}
    >
      <h1 className="mt-3 text-white z-90 text-sm lg:text-xl font-medium">
        {words.map((word, index) => (
          <React.Fragment key={index}>
            <motion.span
              className="inline-block"
              transition={transition}
              variants={variants}
            >
              {word}
            </motion.span>
            {index < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </h1>

      <Link href="/about">
        <motion.span
          className={clsx(
            "mt-3 inline-block px-4 py-2 text-xs font-medium rounded-full border ",
            "text-white/80 bg-white/10 border-white/20 hover:bg-white/25",
            "cursor-pointer",
          )}
          transition={transition}
          variants={variants}
        >
          Learn more
        </motion.span>
      </Link>
    </motion.div>
  );
}
