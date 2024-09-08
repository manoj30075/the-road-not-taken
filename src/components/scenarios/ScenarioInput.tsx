import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ScenarioInputProps {
    onSubmit: (scenario: string) => void;
    onChange: (value: string) => void;
    value: string;
}

const ScenarioInput: React.FC<ScenarioInputProps> = ({ onSubmit, onChange, value }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="What if..."
                    className="w-full bg-white border border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#C4634F] focus:border-transparent"
                />
                <motion.button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C4634F] text-white rounded-full p-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowRight size={20} />
                </motion.button>
            </form>
        </motion.div>
    );
};

export default ScenarioInput;