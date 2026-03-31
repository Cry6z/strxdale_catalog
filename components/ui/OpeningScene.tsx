'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpeningScene: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const steps = [
        "hello",
        "welcome to",
        "strxdale's catalog"
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hasSeenIntro = sessionStorage.getItem('hasSeenOpeningScene');

        if (!hasSeenIntro) {
            setShouldRender(true);
            setIsVisible(true);
            document.body.style.overflow = 'hidden';

            // Slower timing for a more relaxed feel
            const timer1 = setTimeout(() => setCurrentStep(1), 2000);
            const timer2 = setTimeout(() => setCurrentStep(2), 4000);
            const timer3 = setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('hasSeenOpeningScene', 'true');
                document.body.style.overflow = '';

                // Dispatch event to indicate the landing page can now show up
                window.dispatchEvent(new CustomEvent('finishOpeningScene'));

                setTimeout(() => setShouldRender(false), 1500);
            }, 6500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
            // Already seen, just let it be
            window.dispatchEvent(new CustomEvent('finishOpeningScene'));
        }
    }, []);

    if (!shouldRender) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-charcoal"
                >
                    <div className="text-center px-6">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentStep}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 1.02 }}
                                transition={{
                                    duration: 1.2,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="text-xl md:text-3xl font-serif font-light text-charcoal dark:text-white lowercase tracking-[0.05em] whitespace-nowrap"
                            >
                                {steps[currentStep]}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OpeningScene;
