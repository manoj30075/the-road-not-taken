import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScenarioInput from '../components/scenarios/ScenarioInput';
import ScenarioList from '../components/scenarios/ScenarioList';
import Suggestions from '../components/scenarios/Suggestions';
import { motion, AnimatePresence } from 'framer-motion';
import forestIcon from '../assets/images/forest-silhouette.png';
import BottomNav from '../components/layout/BottomNav';

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
const ASSUMPTION_STORAGE_KEY = 'lastAssumption';

const Home: React.FC = () => {
    const [allScenarios, setAllScenarios] = useState<Record<string, Scenario>>({});
    const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [assumptionValue, setAssumptionValue] = useState('');
    const inputRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { question } = useParams<{ question: string }>();
    const [bottomNavProps, setBottomNavProps] = useState({
        showBackButton: false,
        onBackClick: () => {}
    });


    useEffect(() => {
        const storedAssumption = localStorage.getItem(ASSUMPTION_STORAGE_KEY);
        if (storedAssumption) {
            setAssumptionValue(storedAssumption);
        }
    }, []);

    useEffect(() => {
        if (question) {
            const decodedQuestion = decodeURIComponent(question.replace(/-/g, ' '));
            setInputValue(decodedQuestion);
            const storedAssumption = localStorage.getItem(ASSUMPTION_STORAGE_KEY) || '';
            fetchScenarios(decodedQuestion, storedAssumption);
        } else {
            // Reset state when component mounts or route changes to root
            setAllScenarios({});
            setCurrentScenarioId(null);
            setIsLoading(false);
            setError(null);
            setShowSuggestions(true);
            setInputValue('');
            // Don't reset assumptionValue here to persist it across navigation
        }
    }, [question]);

    useEffect(() => {
        const handleScroll = () => {
            if (inputRef.current) {
                if (window.scrollY > 100) {
                    inputRef.current.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-10');
                } else {
                    inputRef.current.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-10');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchScenarios = async (query: string, assumption: string) => {
        if (isLoading || query === allScenarios.root?.question) return;

        setIsLoading(true);
        setError(null);
        setShowSuggestions(false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/scenarios/initial`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, assumption }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch scenarios');
            }

            const data: ApiResponse = await response.json();

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
        if (isLoading) return;

        setCurrentScenarioId(selectedScenario.id);
        setIsLoading(true);
        setError(null);

        try {
            const previousScenarios = Object.values(allScenarios);
            const body = {
                selectedScenario,
                previousScenarios,
                assumption: assumptionValue
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

            const newScenarios = {
                ...allScenarios,
                ...data.scenarios.reduce((acc, scenario) => ({ ...acc, [scenario.id]: scenario }), {})
            };

            setAllScenarios(newScenarios);
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

    useEffect(() => {
        const scenarioHierarchy = getScenarioHierarchy();
        setBottomNavProps({
            showBackButton: scenarioHierarchy.length > 1,
            onBackClick: handleReturn
        });
    }, [currentScenarioId, allScenarios]);

    const handleSuggestionSelect = (suggestion: string) => {
        setInputValue(suggestion);
        const urlFriendlyQuery = suggestion.toLowerCase().replace(/\s+/g, '-');
        navigate(`/what-if/${urlFriendlyQuery}`);
    };

    const handleInputSubmit = (scenario: string, assumption: string) => {
        const urlFriendlyQuery = scenario.toLowerCase().replace(/\s+/g, '-');
        navigate(`/what-if/${urlFriendlyQuery}`);

        if (assumption !== localStorage.getItem(ASSUMPTION_STORAGE_KEY)) {
            localStorage.setItem(ASSUMPTION_STORAGE_KEY, assumption);
        }
    };

    const handleScenarioChange = (value: string) => {
        setInputValue(value);
        setShowSuggestions(true);
    };

    const handleAssumptionChange = (value: string) => {
        setAssumptionValue(value);
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
            className="max-w-2xl mx-auto relative pt-20 pb-20" // Added pb-20 for bottom padding
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 bg-[#FAF9F6]">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-2">
                    <img
                        src={forestIcon}
                        alt="Forest Icon"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <h1 className="text-4xl font-bold text-center mb-4">What If...?</h1>

            <div ref={inputRef} className="sticky top-[75px] z-40 bg-[#FAF9F6] pt-10 pb-2">
                <ScenarioInput
                    onSubmit={handleInputSubmit}
                    onChangeScenario={handleScenarioChange}
                    onChangeAssumption={handleAssumptionChange}
                    scenarioValue={inputValue}
                    assumptionValue={assumptionValue}
                />
            </div>
            {showSuggestions && !isLoading && Object.keys(allScenarios).length === 0 && (
                <Suggestions onSelect={handleSuggestionSelect}/>
            )}

            <AnimatePresence>
                {scenarioHierarchy.length > 0 && (
                    <motion.div
                        key="question-hierarchy"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        className="mb-4"
                    >
                        <h2 className="text-2xl font-bold">
                            {currentScenarioId ? allScenarios[currentScenarioId]?.question : ''}
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading && (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C4634F]"></div>
                </div>
            )}

            {error && (
                <motion.div
                    key="error"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="text-red-500 text-center mt-4"
                >
                    {error}
                </motion.div>
            )}

            <AnimatePresence>
                {!isLoading && getCurrentScenarios().length > 0 && (
                    <ScenarioList key="scenario-list" scenarios={getCurrentScenarios()}
                                  onScenarioSelect={handleExplore}/>
                )}
            </AnimatePresence>

            <BottomNav {...bottomNavProps} />
        </motion.div>
    );
};

export default Home;