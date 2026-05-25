// @ts-nocheck
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ScrambledText.css';

// Simple SplitText replacement
const splitText = (el) => {
  const text = el.textContent;
  el.textContent = '';
  const chars = text.split('').map(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.className = 'char';
    el.appendChild(span);
    return span;
  });
  return {
    chars,
    revert: () => {
      el.textContent = text;
    }
  };
};

// Simple Scramble effect
const scramble = (target, text, scrambleChars, duration, speed) => {
  const obj = { value: 0 };
  const rolls = Math.floor(duration * 20 * speed);
  
  gsap.to(obj, {
    value: 1,
    duration: duration,
    ease: "none",
    onUpdate: () => {
      if (obj.value < 1) {
        const progress = obj.value;
        const currentText = text.split('').map((char, i) => {
          if (Math.random() > progress) {
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
          return char;
        }).join('');
        target.textContent = currentText === ' ' ? '\u00A0' : currentText;
      } else {
        target.textContent = text === ' ' ? '\u00A0' : text;
      }
    }
  });
};

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    if (!rootRef.current) return;

    const p = rootRef.current.querySelector('p');
    if (!p) return;

    const split = splitText(p);
    charsRef.current = split.chars;

    charsRef.current.forEach(c => {
      gsap.set(c, {
        display: 'inline-block',
      });
      c.dataset.content = c.textContent === '\u00A0' ? ' ' : c.textContent;
    });

    const handleMove = e => {
      charsRef.current.forEach(c => {
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          // If already animating, skip or overwrite
          if (!c.dataset.animating) {
            c.dataset.animating = 'true';
            scramble(c, c.dataset.content, scrambleChars, duration * (1 - dist / radius), speed);
            setTimeout(() => {
              delete c.dataset.animating;
            }, duration * 1000);
          }
        }
      });
    };

    const el = rootRef.current;
    el.addEventListener('pointermove', handleMove);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{children}</p>
    </div>
  );
};

export default ScrambledText;
