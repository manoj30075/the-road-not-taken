import React from 'react';
import { motion } from 'framer-motion';
import { SendIcon } from 'lucide-react';

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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto mt-8 mb-4 relative"
        >
            <form onSubmit={handleSubmit} className="relative">
                <motion.input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="What if..."
                    className="w-full py-3 px-4 pr-12 rounded-full bg-white bg-opacity-80 backdrop-blur-sm border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700 leading-8 transition-colors duration-200 ease-in-out"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                />
                <motion.button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ height: '40px', width: '40px' }}
                >
                    <SendIcon size={20} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </motion.button>
            </form>
        </motion.div>
    );
};

export default ScenarioInput;