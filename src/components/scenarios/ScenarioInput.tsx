import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {ArrowRight, ChevronDown, HelpCircle} from 'lucide-react';

interface ScenarioInputProps {
    onSubmit: (scenario: string, assumption: string) => void;
    onChangeScenario: (value: string) => void;
    onChangeAssumption: (value: string) => void;
    scenarioValue: string;
    assumptionValue: string;
}

const ScenarioInput: React.FC<ScenarioInputProps> = ({
                                                         onSubmit,
                                                         onChangeScenario,
                                                         onChangeAssumption,
                                                         scenarioValue,
                                                         assumptionValue
                                                     }) => {
    const [showAssume, setShowAssume] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (scenarioValue.trim()) {
            onSubmit(scenarioValue.trim(), assumptionValue.trim());
        }
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="w-full space-y-4"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={scenarioValue}
                        onChange={(e) => onChangeScenario(e.target.value)}
                        placeholder="What if..."
                        className="w-full bg-white border border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#C4634F] focus:border-transparent"
                    />
                    <motion.button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C4634F] text-white rounded-full p-2 w-8 h-8 flex items-center justify-center"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        <ArrowRight size={20}/>
                    </motion.button>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setShowAssume(!showAssume)}
                        className="text-[#C4634F] font-medium flex items-center"
                    >
                        Assume <ChevronDown size={20}
                                            className={`ml-1 transform transition-transform ${showAssume ? 'rotate-180' : ''}`}/>
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowInfo(!showInfo)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <HelpCircle size={20}/>
                    </button>
                </div>
                <AnimatePresence>
                    {showAssume && (
                        <motion.div
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.3}}
                        >
                            <textarea
                                value={assumptionValue}
                                onChange={(e) => onChangeAssumption(e.target.value)}
                                placeholder="Add 5 random story placeholders. Keep the story short."
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4634F] focus:border-transparent resize-none"
                                rows={3}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowInfo(false)}
                    >
                        <motion.div
                            initial={{y: 50, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: 50, opacity: 0}}
                            className="bg-white rounded-lg p-6 max-w-md relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowInfo(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-bold mb-4">About Assumptions</h2>
                            <p className="text-gray-600">
                                Assumptions provide context for generating more personalized scenarios.
                                They help tailor the "What if" questions to your specific situation or story.
                                Keep it brief and avoid sharing sensitive personal information.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ScenarioInput;