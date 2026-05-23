// @ts-nocheck
import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const TextReveal = ({ body, className, scrollRange = ["start 0.7", "end 0.3"] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollRange
  });

  const words = useMemo(() => body.split(' '), [body]);

  return (
    <div ref={containerRef} className={className}>
      <div className="sticky top-0 h-screen flex items-center">
        <p className="flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[1] tracking-tighter uppercase text-csi-pale">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = (i + 1) / words.length;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
            
            return (
              <motion.span 
                key={i} 
                style={{ opacity }}
              >
                {word}
              </motion.span>
            );
          })}
        </p>
      </div>
    </div>
  );
};

export default TextReveal;
