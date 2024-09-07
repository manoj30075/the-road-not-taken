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
        try {
            const response = await fetch(`${API_BASE_URL}/api/scenarios/suggestions`);
            const data = await response.json();
            setSuggestions(data.queries);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
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
        top: { y: '-30%', scale: 0.9, zIndex: 1, filter: "blur(2px)", width: '70%' },
        center: { y: 0, scale: 1, zIndex: 3, filter: "blur(0px)", width: '80%' },
        bottom: { y: '30%', scale: 0.9, zIndex: 1, filter: "blur(2px)", width: '70%' },
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div
                ref={containerRef}
                className="relative w-full h-80 flex items-center justify-center overflow-hidden mb-4"
            >
                <AnimatePresence initial={false}>
                    {[-1, 0, 1].map((offset) => {
                        const index = (currentIndex + offset + suggestions.length) % suggestions.length;
                        return (
                            <motion.div
                                key={suggestions[index]}
                                className="absolute bg-green-500 rounded-lg p-4 cursor-pointer flex items-center justify-center"
                                variants={cardVariants}
                                initial={offset === -1 ? "top" : offset === 1 ? "bottom" : "center"}
                                animate={offset === -1 ? "top" : offset === 1 ? "bottom" : "center"}
                                transition={{
                                    y: { type: "spring", stiffness: 300, damping: 30 },
                                    scale: { duration: 0.2 },
                                    filter: { duration: 0.2 },
                                    width: { duration: 0.2 },
                                }}
                                style={{
                                    height: '33%',
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                }}
                                onClick={() => offset === 0 && onSelect(suggestions[index])}
                            >
                                <p className="text-white text-center text-xl overflow-hidden overflow-ellipsis">
                                    {suggestions[index]}
                                </p>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            <div className="flex justify-center space-x-4 w-full px-4">
                <button
                    onClick={navigateUp}
                    className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors duration-200 flex-grow"
                >
                    <ChevronUp size={24} className="mx-auto" />
                </button>
                <button
                    onClick={navigateDown}
                    className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors duration-200 flex-grow"
                >
                    <ChevronDown size={24} className="mx-auto" />
                </button>
            </div>
        </div>
    );
};

export default Suggestions;