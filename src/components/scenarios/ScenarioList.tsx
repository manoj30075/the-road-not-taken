import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Scenario {
    id: string;
    category: string;
    question: string;
    description: string;
    parentId: string | null;
}

interface ScenarioListProps {
    scenarios: Scenario[];
    onScenarioSelect: (scenario: Scenario) => void;
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, onScenarioSelect }) => {
    const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

    useEffect(() => {
        setExpandedScenario(null);
    }, [scenarios]);

    const toggleScenario = (id: string) => {
        setExpandedScenario(expandedScenario === id ? null : id);
    };

    return (
        <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence initial={false}>
                {scenarios.map((scenario) => (
                    <motion.div
                        key={scenario.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="flex justify-between items-center p-4 cursor-pointer"
                            onClick={() => toggleScenario(scenario.id)}
                        >
                            <h3 className="font-semibold text-lg">{scenario.question}</h3>
                            {expandedScenario === scenario.id ? <ChevronUp /> : <ChevronDown />}
                        </motion.div>
                        <AnimatePresence>
                            {expandedScenario === scenario.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-4 pb-4"
                                >
                                    <p className="text-gray-600 mb-2">{scenario.description}</p>
                                    <div className="flex justify-between items-center">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {scenario.category}
                    </span>
                                        <button
                                            onClick={() => onScenarioSelect(scenario)}
                                            className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-600 transition-colors duration-200"
                                        >
                                            Explore
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default ScenarioList;