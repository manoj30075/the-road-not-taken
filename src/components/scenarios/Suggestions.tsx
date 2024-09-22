import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const SUGGESTIONS_CACHE_KEY = 'cachedSuggestions';
// const SUGGESTIONS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface SuggestionsProps {
    onSelect: (suggestion: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ onSelect }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number | null>(null);

    const fetchSuggestions = useCallback(async () => {
        // const cachedData = localStorage.getItem(SUGGESTIONS_CACHE_KEY);
        // if (cachedData) {
        //     const { suggestions, timestamp } = JSON.parse(cachedData);
        //     if (Date.now() - timestamp < SUGGESTIONS_CACHE_DURATION) {
        //         setSuggestions(suggestions);
        //         setIsLoading(false);
        //         return;
        //     }
        // }

        const tempSuggestions = {
            "queries": [
                "What if I move to San Francisco?",
                "What if humans colonize Mars?",
                "What if AI becomes sentient?",
                "What if fossil fuels run out?",
                "What if we cure cancer?",
                "What if China invades Taiwan?",
                "What if I start my own business?",
                "What if we discover alien life?",
                "What if global warming accelerates?",
                "What if I learn a new language?",
                "What if we achieve immortality?",
                "What if I change careers?",
                "What if we eliminate poverty?",
                "What if cryptocurrency replaces traditional money?",
                "What if I adopt a child?",
                "What if we develop teleportation?",
                "What if social media disappears?",
                "What if I go vegan?",
                "What if we make first contact with aliens?",
                "What if virtual reality becomes indistinguishable from reality?",
                "What if I could read minds?",
                "What if we could control the weather?",
                "What if I win the lottery?",
                "What if we reverse aging?",
                "What if I travel the world for a year?",
                "What if we achieve nuclear fusion?",
                "What if I lose my job?",
                "What if we colonize the ocean?",
                "What if I become famous overnight?",
                "What if we eliminate all diseases?",
                "What if I discover a new element?",
                "What if we harness unlimited clean energy?",
                "What if I run for political office?",
                "What if we create a global government?",
                "What if I invent time travel?",
                "What if we make contact with parallel universes?",
                "What if I go off the grid?",
                "What if we upload consciousness to computers?",
                "What if I never aged past 25?",
                "What if we terraform another planet?",
                "What if I could fly?",
                "What if we decode animal languages?",
                "What if I live to be 150?",
                "What if we create artificial organs?",
                "What if I wake up 100 years in the future?",
                "What if we achieve world peace?",
                "What if I become invisible at will?",
                "What if we eliminate the need for sleep?",
                "What if I could relive one day of my life?",
                "What if we discover the meaning of life?"
            ]
        }
        try {
            const data = tempSuggestions;
            setSuggestions(data.queries);
            localStorage.setItem(SUGGESTIONS_CACHE_KEY, JSON.stringify({
                suggestions: data.queries,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

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
            if (touchStartY.current === null) return;
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
        };

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
    }, [suggestions]);

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

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full my-10">
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
                                style={{ height: '100px' }}
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
            <div className="flex justify-center space-x-4 m-10">
                <motion.button
                    onClick={navigateDown}
                    className="bg-[#C4634F] text-white rounded-full p-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronUp size={20} />
                </motion.button>
                <motion.button
                    onClick={navigateUp}
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