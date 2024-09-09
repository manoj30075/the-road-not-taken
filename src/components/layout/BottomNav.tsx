import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InfoPopup from '../InfoPopup';

interface BottomNavProps {
    showBackButton: boolean;
    onBackClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ showBackButton, onBackClick }) => {
    const navigate = useNavigate();
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    return (
        <>
            <motion.div
                className="fixed bottom-4 left-4 right-4 flex justify-between items-center"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    mass: 1,
                    duration: 1
                }}
            >
                {showBackButton ? (
                    <motion.button
                        className="bg-[#C4634F] text-white rounded-full p-3 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onBackClick}
                    >
                        <ArrowLeft size={24} />
                    </motion.button>
                ) : (
                    <div className="w-10 h-10"></div> // Placeholder to maintain layout
                )}
                <motion.button
                    className="bg-[#C4634F] text-white rounded-full p-3 shadow-md"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/')}
                >
                    <HomeIcon size={24} />
                </motion.button>
                <motion.button
                    className="bg-[#C4634F] text-white rounded-full p-3 shadow-md"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsInfoOpen(true)}
                >
                    <HelpCircle size={24} />
                </motion.button>
            </motion.div>
            <InfoPopup isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        </>
    );
};

export default BottomNav;