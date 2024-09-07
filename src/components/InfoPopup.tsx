import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';

const InfoPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                className="fixed bottom-4 right-4 bg-[#C4634F] text-white rounded-full p-2 shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
            >
                <HelpCircle size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-white rounded-lg p-6 max-w-md relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-[#3D3B38]">About This App</h2>
                            <p className="text-[#3D3B38]">
                                This app helps you explore different scenarios by asking "What if" questions.
                                It generates related scenarios based on your input, allowing you to dive deeper
                                into various possibilities and outcomes. Use it to spark creativity,
                                problem-solve, or simply explore interesting ideas.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default InfoPopup;