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
          <span className="inline-block word-char opacity-0" key={charIndex}>
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

      gsap.fromTo(
        charElements,
        {
          willChange: 'opacity, transform',
          opacity: 0,
          y: 40,
          rotateX: -45,
          scale: 0.9,
          transformOrigin: '50% 100%'
        },
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
            scrub: 1, // Smooth scrubbing
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, splitText]);

  return (
    <Component ref={containerRef} className={`relative overflow-visible text-center ${containerClassName}`}>
      <span className={`inline-block leading-[1.3] ${textClassName}`}>{splitText}</span>
    </Component>
  );
};

export default ScrollFloat;
