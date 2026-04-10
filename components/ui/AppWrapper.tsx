'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const [isFinished, setIsFinished] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const handleFinish = () => {
            setIsFinished(true);
            // Slight delay before fading in for maximum smoothness
            setTimeout(() => setShouldShow(true), 200);
        };

        // Check if finished on mount
        if (sessionStorage.getItem('hasSeenOpeningScene')) {
            setIsFinished(true);
            setShouldShow(true);
        }

        window.addEventListener('finishOpeningScene', handleFinish);
        return () => window.removeEventListener('finishOpeningScene', handleFinish);
    }, []);

    return (
        <div className="relative">
            {/* Pure white cover while loading intro */}
            {!isFinished && (
                <div className="fixed inset-0 z-9997 bg-white dark:bg-charcoal" />
            )}
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: shouldShow ? 1 : 0
                }}
                transition={{ 
                    duration: 1.5, 
                    ease: [0.22, 1, 0.36, 1],
                    opacity: { duration: 1.2 }
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
