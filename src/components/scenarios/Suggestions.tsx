import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface SuggestionsProps {
    onSelect: (suggestion: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ onSelect }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/scenarios/suggestions`);
            const data = await response.json();
            setSuggestions(data.queries);
            setIsVisible(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollPosition = containerRef.current.scrollTop;
            const itemHeight = containerRef.current.scrollHeight / suggestions.length;
            const newIndex = Math.round(scrollPosition / itemHeight);
            setCurrentIndex(newIndex);
        }
    };

    const variants = {
        top: { opacity: 0.5, scale: 0.8, y: '-100%', rotateX: 45 },
        center: { opacity: 1, scale: 1, y: 0, rotateX: 0 },
        bottom: { opacity: 0.5, scale: 0.8, y: '100%', rotateX: -45 },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{ perspective: '1000px', height: '300px' }}
                >
                    <div className="sticky top-0 flex justify-between items-center bg-white p-2 border-b z-10">
                        <span className="text-sm font-semibold text-gray-700">Suggestions</span>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div
                        ref={containerRef}
                        className="overflow-y-auto h-full"
                        onScroll={handleScroll}
                        style={{ scrollSnapType: 'y mandatory' }}
                    >
                        {suggestions.map((suggestion, index) => (
                            <motion.div
                                key={index}
                                variants={variants}
                                initial="center"
                                animate={
                                    index === currentIndex
                                        ? 'center'
                                        : index < currentIndex
                                            ? 'top'
                                            : 'bottom'
                                }
                                transition={{ duration: 0.3 }}
                                className="p-4 cursor-pointer text-center"
                                style={{
                                    scrollSnapAlign: 'center',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={() => {
                                    onSelect(suggestion);
                                    setIsVisible(false);
                                }}
                            >
                                {suggestion}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Suggestions;