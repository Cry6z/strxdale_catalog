'use client';
import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  scrub?: boolean | number;
}

const ScrollFloat: React.FC<ScrollFloatProps & { as?: React.ElementType }> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'power3.out',
  scrollStart = 'top 90%',
  scrollEnd = 'top 60%',
  stagger = 0.02,
  scrub = 1,
  as: Component = 'h2'
}) => {
  const containerRef = useRef<HTMLElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string'
      ? children
      : React.Children.toArray(children).join('');

    if (!text) return null;

    return text.split(' ').map((word, wordIndex, words) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap">
        {word.split('').map((char, charIndex) => (
          <span className="inline-block word-char" key={charIndex}>
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    if (!containerRef.current || !splitText) return;

    const el = containerRef.current;

    const ctx = gsap.context(() => {
      const charElements = el.querySelectorAll('.word-char');
      if (charElements.length === 0) return;

      // Set initial state via GSAP instead of CSS to prevent permanent invisibility
      gsap.set(charElements, {
        opacity: 0,
        y: 40,
        rotateX: -45,
        scale: 0.9,
        transformOrigin: '50% 100%'
      });

      gsap.to(
        charElements,
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: stagger,
          scrollTrigger: {
            trigger: el,
            start: scrollStart,
            end: scrollEnd,
            scrub: scrub,
            toggleActions: scrub ? undefined : 'play none none reverse'
          }
        }
      );
    }, el);

    // Refresh ScrollTrigger after a short delay to account for layout shifts/image loading
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, splitText, scrub]);

  return (
    <Component ref={containerRef} className={`relative overflow-visible text-center ${containerClassName}`}>
      <span className={`inline-block leading-[1.3] ${textClassName}`}>{splitText}</span>
    </Component>
  );
};

export default ScrollFloat;
