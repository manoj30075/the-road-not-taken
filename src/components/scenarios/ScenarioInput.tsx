import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, InfoIcon, X} from 'lucide-react';

interface ScenarioInputProps {
    onSubmit: (scenario: string, assumption: string) => void;
    onChangeScenario: (value: string) => void;
    onChangeAssumption: (value: string) => void;
    scenarioValue: string;
    assumptionValue: string;
}

const ASSUMPTION_STORAGE_KEY = 'lastAssumption';

const ScenarioInput: React.FC<ScenarioInputProps> = ({
                                                         onSubmit,
                                                         onChangeScenario,
                                                         onChangeAssumption,
                                                         scenarioValue,
                                                         assumptionValue,
                                                     }) => {
    const [showAssume, setShowAssume] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const assumptionRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (assumptionRef.current && !assumptionRef.current.contains(event.target as Node)) {
                updateAssumptionStorage();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [assumptionValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (scenarioValue.trim()) {
            onSubmit(scenarioValue.trim(), assumptionValue.trim());
        }
    };

    const updateAssumptionStorage = () => {
        localStorage.setItem(ASSUMPTION_STORAGE_KEY, assumptionValue.trim());
    };

    const handleClearScenario = () => {
        onChangeScenario('');
    };

    const handleClearAssumption = () => {
        onChangeAssumption('');
        localStorage.removeItem(ASSUMPTION_STORAGE_KEY);
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
                        placeholder="Enter your 'What if' question here..."
                        className="w-full bg-white border border-gray-300 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#C4634F] focus:border-transparent"
                    />
                    {scenarioValue && (
                        <button
                            type="button"
                            onClick={handleClearScenario}
                            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20}/>
                        </button>
                    )}
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
                        <InfoIcon size={20}/>
                    </button>
                </div>
                <AnimatePresence>
                    {showAssume && (
                        <motion.div
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.3}}
                            className="relative"
                        >
                            <textarea
                                ref={assumptionRef}
                                value={assumptionValue}
                                onChange={(e) => onChangeAssumption(e.target.value)}
                                onBlur={updateAssumptionStorage}
                                placeholder="Add context to your question (Optional, see (i) for help)"
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C4634F] focus:border-transparent resize-none"
                                rows={3}
                            />
                            {assumptionValue && (
                                <button
                                    type="button"
                                    onClick={handleClearAssumption}
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            )}
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
                            <p className="text-gray-600 text-center">
                                Assumptions provide context to personalize your 'What if' scenarios. The more
                                assumptions you provide, the more relevant the generated questions will be.<br/><br/>
                                <strong>Example:</strong><br/>
                                For 'What if I adopt a dog?', you might add:<br/>
                                <span className="italic">
                                    'Live in a small apartment, work from home, no pets currently, local park nearby, partner allergic to cats, enjoy daily walks.'
                                </span><br/><br/>
                                Keep it brief and avoid sensitive details. This helps tailor scenarios to your
                                situation.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ScenarioInput;