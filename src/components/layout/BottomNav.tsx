import { useState } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, BookmarkIcon } from 'lucide-react';

export default function BottomNav() {
    const [selected, setSelected] = useState('home');

    return (
        <motion.div
            className="fixed bottom-20 left-0 right-0 mx-auto bg-cream-100 rounded-full p-1 flex justify-center items-center shadow-md
                       w-[150px] h-[60px] md:w-[100px] md:h-[40px]" // Responsive width and height
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
                className="p-5 md:p-2 rounded-full" // Responsive padding
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected('home')}
            >
                <HomeIcon
                    size={selected === 'home' ? 28 : 26}
                    className="text-black md:w-5 md:h-5" // Responsive icon size
                    strokeWidth={selected === 'home' ? 2.5 : 2}
                />
            </motion.button>
            <motion.button
                className="p-5 md:p-2 rounded-full ml-3 md:ml-2" // Responsive padding and margin
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected('saved')}
            >
                <BookmarkIcon
                    size={selected === 'saved' ? 28 : 26}
                    className="text-black md:w-5 md:h-5" // Responsive icon size
                    strokeWidth={selected === 'saved' ? 2.5 : 2}
                />
            </motion.button>
        </motion.div>
    );
}