import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="fixed bottom-4 left-0 right-0 flex justify-center"
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
            <motion.button
                className="bg-[#C4634F] text-white rounded-full p-3 shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
            >
                <HomeIcon size={24} />
            </motion.button>
        </motion.div>
    );
};

export default BottomNav;