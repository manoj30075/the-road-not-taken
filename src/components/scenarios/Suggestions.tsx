import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SuggestionsProps {
    onSelect: (suggestion: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Suggestions: React.FC<SuggestionsProps> = ({ onSelect }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleScroll);
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchmove', handleTouchMove);
            container.addEventListener('touchend', handleTouchEnd);
            return () => {
                container.removeEventListener('wheel', handleScroll);
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [suggestions]);

    const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/scenarios/suggestions`);
            const data = await response.json();
            setSuggestions(data.queries);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScroll = (event: WheelEvent) => {
        event.preventDefault();
        if (event.deltaY > 0) {
            navigateDown();
        } else {
            navigateUp();
        }
    };

    const handleTouchStart = (event: TouchEvent) => {
        touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
        event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
        if (touchStartY.current !== null) {
            const touchEndY = event.changedTouches[0].clientY;
            const deltaY = touchEndY - touchStartY.current;

            if (Math.abs(deltaY) > 20) { // Threshold for swipe
                if (deltaY > 0) {
                    navigateUp();
                } else {
                    navigateDown();
                }
            }
            touchStartY.current = null;
        }
    };

    const navigateUp = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
    };

    const navigateDown = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    };

    const cardVariants = {
        top: { y: '-50%', scale: 0.9, zIndex: 1, opacity: 0.5 },
        center: { y: 0, scale: 1, zIndex: 3, opacity: 1 },
        bottom: { y: '50%', scale: 0.9, zIndex: 1, opacity: 0.5 },
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C4634F]"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full my-8">
            <div
                ref={containerRef}
                className="relative w-full h-48 flex items-center justify-center overflow-hidden mb-2"
            >
                <AnimatePresence initial={false}>
                    {[-1, 0, 1].map((offset) => {
                        const index = (currentIndex + offset + suggestions.length) % suggestions.length;
                        return (
                            <motion.div
                                key={suggestions[index]}
                                className="absolute bg-white rounded-lg p-6 cursor-pointer flex items-center justify-center shadow-md w-full max-w-sm"
                                variants={cardVariants}
                                initial={offset === -1 ? "top" : offset === 1 ? "bottom" : "center"}
                                animate={offset === -1 ? "top" : offset === 1 ? "bottom" : "center"}
                                transition={{
                                    y: { type: "spring", stiffness: 300, damping: 30 },
                                    scale: { duration: 0.2 },
                                    opacity: { duration: 0.2 },
                                }}
                                style={{ height: '90px' }}
                                onClick={() => offset === 0 && onSelect(suggestions[index])}
                            >
                                <p className="text-center text-lg overflow-hidden overflow-ellipsis px-4">
                                    {suggestions[index]}
                                </p>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            <div className="flex justify-center space-x-4">
                <motion.button
                    onClick={navigateUp}
                    className="bg-[#C4634F] text-white rounded-full p-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronUp size={20} />
                </motion.button>
                <motion.button
                    onClick={navigateDown}
                    className="bg-[#C4634F] text-white rounded-full p-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronDown size={20} />
                </motion.button>
            </div>
        </div>
    );
};

export default Suggestions;