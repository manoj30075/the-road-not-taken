import React, { useState, useRef, useEffect } from 'react';
import ScenarioInput from '../components/scenarios/ScenarioInput';
import ScenarioList from '../components/scenarios/ScenarioList';
import Suggestions from '../components/scenarios/Suggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface Scenario {
    id: string;
    category: string;
    question: string;
    description: string;
    parentId: string | null;
}

interface ApiResponse {
    rootQuestion: string;
    scenarios: Scenario[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Home: React.FC = () => {
    const [allScenarios, setAllScenarios] = useState<Record<string, Scenario>>({});
    const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (inputRef.current) {
                if (window.scrollY > 100) {
                    inputRef.current.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-10', 'bg-white', 'shadow-md');
                } else {
                    inputRef.current.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-10', 'bg-white', 'shadow-md');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchScenarios = async (query: string) => {
        setIsLoading(true);
        setError(null);
        setShowSuggestions(false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/scenarios/initial`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch scenarios');
            }

            const data: ApiResponse = await response.json();
            console.log('API Response:', data);

            const rootScenario: Scenario = {
                id: 'root',
                category: 'Root',
                question: query,
                description: '',
                parentId: null
            };

            const newScenarios = {
                [rootScenario.id]: rootScenario,
                ...data.scenarios.reduce((acc, scenario) => ({ ...acc, [scenario.id]: scenario }), {})
            };

            setAllScenarios(newScenarios);
            setCurrentScenarioId('root');
        } catch (err) {
            setError('An error occurred while fetching scenarios. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExplore = async (selectedScenario: Scenario) => {
        setIsLoading(true);
        setError(null);

        try {
            const previousScenarios = Object.values(allScenarios);
            const body = {
                selectedScenario,
                previousScenarios
            };

            const response = await fetch(`${API_BASE_URL}/api/scenarios/followup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch scenarios');
            }

            const data: ApiResponse = await response.json();
            console.log('API Response:', data);

            const newScenarios = {
                ...allScenarios,
                ...data.scenarios.reduce((acc, scenario) => ({ ...acc, [scenario.id]: scenario }), {})
            };

            setAllScenarios(newScenarios);
            setCurrentScenarioId(selectedScenario.id);
        } catch (err) {
            setError('An error occurred while fetching scenarios. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturn = () => {
        if (currentScenarioId && currentScenarioId !== 'root') {
            const currentScenario = allScenarios[currentScenarioId];
            if (currentScenario.parentId) {
                setCurrentScenarioId(currentScenario.parentId);
            }
        }
    };

    const handleSuggestionSelect = (suggestion: string) => {
        setInputValue(suggestion);
        fetchScenarios(suggestion);
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        setShowSuggestions(true);
    };

    const handleInputSubmit = (value: string) => {
        fetchScenarios(value);
    };

    const getCurrentScenarios = (): Scenario[] => {
        if (!currentScenarioId) return [];
        return Object.values(allScenarios).filter(scenario => scenario.parentId === currentScenarioId);
    };

    const getScenarioHierarchy = (): Scenario[] => {
        const hierarchy: Scenario[] = [];
        let currentId = currentScenarioId;
        while (currentId) {
            const scenario = allScenarios[currentId];
            if (scenario) {
                hierarchy.unshift(scenario);
                currentId = scenario.parentId;
            } else {
                break;
            }
        }
        return hierarchy;
    };

    const scenarioHierarchy = getScenarioHierarchy();

    return (
        <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold text-center mb-8">What If Explorer</h1>

            <div ref={inputRef} className="sticky top-0 bg-[#FAF9F6] py-4 z-10">
                <ScenarioInput
                    onSubmit={handleInputSubmit}
                    onChange={handleInputChange}
                    value={inputValue}
                />
            </div>

            {showSuggestions && !isLoading && Object.keys(allScenarios).length === 0 && (
                <Suggestions onSelect={handleSuggestionSelect} />
            )}

            <AnimatePresence>
                {scenarioHierarchy.length > 0 && (
                    <motion.div
                        key="question-hierarchy"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-4 flex items-center"
                    >
                        {scenarioHierarchy.length > 1 && (
                            <button onClick={handleReturn} className="mr-2 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                                <ArrowUp size={20} />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold">
                            {scenarioHierarchy[scenarioHierarchy.length - 1].question}
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-32"
                >
                    <div className="w-8 h-8 border-4 border-[#C4634F] border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
            )}

            {error && (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-center mt-4"
                >
                    {error}
                </motion.div>
            )}

            <AnimatePresence>
                {!isLoading && getCurrentScenarios().length > 0 && (
                    <ScenarioList key="scenario-list" scenarios={getCurrentScenarios()} onScenarioSelect={handleExplore} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Home;