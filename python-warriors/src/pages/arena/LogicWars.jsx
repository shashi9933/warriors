import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, AlertCircle, CheckCircle, XCircle, ChevronRight, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton';
import TutorialModal from '../../components/ui/TutorialModal';

const QUESTIONS = [
    {
        id: 1,
        question: "What is the output of `print(2 ** 3)`?",
        options: ["6", "8", "9", "23"],
        answer: 1 // Index of "8"
    },
    {
        id: 2,
        question: "Which keyword defines a function?",
        options: ["func", "def", "lambda", "function"],
        answer: 1
    },
    {
        id: 3,
        question: "Type of `[1, 2, 3]`?",
        options: ["Tuple", "List", "Dictionary", "Set"],
        answer: 1
    },
    {
        id: 4,
        question: "Comment character in Python?",
        options: ["//", "/*", "#", "<!--"],
        answer: 2
    },
    {
        id: 5,
        question: "Result of `'a' + 'b'`?",
        options: ["'ab'", "'ba'", "Error", "NaN"],
        answer: 0
    }
];

const LogicWars = () => {
    const navigate = useNavigate();
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [health, setHealth] = useState(100);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
    const [lastResult, setLastResult] = useState(null); // 'CORRECT', 'WRONG'

    const handleAnswer = useCallback((optionIndex) => {
        const currentQ = QUESTIONS[currentQIndex];
        const isCorrect = optionIndex === currentQ.answer;

        if (isCorrect) {
            setScore(prev => prev + 100 + (timeLeft * 10)); // Speed bonus
            setLastResult('CORRECT');
        } else {
            setHealth(prev => Math.max(0, prev - 20));
            setLastResult('WRONG');
        }

        setTimeout(() => {
            setLastResult(null);
            if (currentQIndex < QUESTIONS.length - 1 && health > 0) {
                setCurrentQIndex(prev => prev + 1);
                setTimeLeft(15);
            } else {
                setGameState('GAMEOVER');
            }

            if (!isCorrect && health <= 20) { // If this hit killed us
                setGameState('GAMEOVER');
            }
        }, 1000);
    }, [currentQIndex, health, timeLeft]);

    useEffect(() => {
        let timer;
        if (gameState === 'PLAYING') {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleAnswer(-1); // Time out
                        return 15;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, currentQIndex, handleAnswer]);

    const resetGame = () => {
        setScore(0);
        setHealth(100);
        setCurrentQIndex(0);
        setTimeLeft(15);
        setGameState('PLAYING');
    };

    const shakeVariant = {
        hidden: { x: 0 },
        visible: {
            x: [-10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };

    // --- Tutorial Data ---
    const tutorialSlides = [
        {
            title: "LOGIC WARS INITIATED",
            description: "Test your Python knowledge against AI opponents. Speed and accuracy are your weapons.",
            icon: Terminal,
        },
        {
            title: "ANSWER QUICKLY",
            description: "You have limited time to answer each question. The faster you answer, the more damage you deal.",
            icon: Zap,
        },
        {
            title: "AVOID ERRORS",
            description: "Incorrect answers will damage your system integrity. Three strikes and you're out.",
            icon: AlertCircle,
        }
    ];

    return (
        <PageLayout>
            <TutorialModal tutorialId="logic_wars" slides={tutorialSlides} />
            <div className="absolute top-20 left-6 z-50">
                <button onClick={() => navigate('/battle-arena')} className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase">
                    <ChevronRight className="rotate-180" size={16} /> Return to Hub
                </button>
            </div>

            <div className="max-w-5xl mx-auto min-h-screen flex flex-col justify-center py-6 md:py-10 px-2 md:px-4 relative overflow-hidden">
                {/* Background Tech Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />

                {gameState === 'START' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 glass-panel bg-black/60 border border-purple-500/50 p-6 md:p-12 text-center max-w-2xl mx-auto rounded-2xl shadow-[0_0_50px_rgba(147,51,234,0.3)] mt-10 md:mt-0"
                    >
                        <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-black border border-purple-500 rounded px-2 md:px-4 py-1 text-purple-400 font-mono text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
                            System Breach Detected
                        </div>

                        <h1 className="text-4xl md:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-800 mb-4 md:mb-6 drop-shadow-lg">
                            LOGIC WARS
                        </h1>
                        <p className="text-gray-300 text-sm md:text-xl mb-8 md:mb-12 font-light leading-relaxed">
                            Defend your system integrity. Verify code snippets before the firewall collapses.
                            <br /><span className="text-purple-400 font-bold text-xs md:text-sm mt-2 block">SPEED IS KEY. ACCURACY IS MANDATORY.</span>
                        </p>

                        <NeonButton onClick={() => setGameState('PLAYING')} color="purple" size="lg" className="w-full">
                            INITIATE DEFENSE PROTOCOL
                        </NeonButton>
                    </motion.div>
                )}

                {gameState === 'PLAYING' && (
                    <div className="relative z-10 w-full max-w-4xl mx-auto mt-10 md:mt-0">
                        {/* HUD Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-8 bg-black/40 border-b border-white/10 pb-4 px-4 backdrop-blur-sm rounded-t-xl gap-4 md:gap-0">
                            <div className="flex-1 w-full md:w-auto">
                                <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mb-1 font-mono uppercase">
                                    <span>System Integrity</span>
                                    <span className={health < 30 ? "text-red-500 animate-pulse" : "text-green-500"}>{health}%</span>
                                </div>
                                <div className="h-1.5 md:h-2 bg-gray-900 rounded-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-[shimmer_2s_infinite]" />
                                    <motion.div
                                        className={`h-full ${health < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-cyan-500'}`}
                                        animate={{ width: `${health}%` }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 text-center hidden md:block">
                                <div className="text-5xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                    {score.toString().padStart(5, '0')}
                                </div>
                                <div className="text-[10px] text-purple-400 uppercase tracking-[0.3em]">Current Score</div>
                            </div>

                            <div className="flex-1 w-full md:w-auto flex justify-between md:block">
                                <div className="md:hidden text-2xl font-mono font-bold text-white">
                                    {score.toString().padStart(5, '0')}
                                </div>
                                <div className={`text-2xl md:text-4xl font-bold font-mono flex items-center justify-end gap-2 md:gap-3 ${timeLeft < 5 ? 'text-red-500 animate-pulse scale-110' : 'text-cyan-400'} transition-all`}>
                                    <Timer size={20} className="md:w-7 md:h-7" /> {timeLeft.toString().padStart(2, '0')}s
                                </div>
                            </div>
                        </div>

                        {/* Holo Terminal Question Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQIndex}
                                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                                animate={lastResult === 'WRONG' ? "visible" : { opacity: 1, y: 0, rotateX: 0 }}
                                exit={{ opacity: 0, y: -50, rotateX: 10 }}
                                variants={shakeVariant}
                                className={`
                                    bg-black/80 backdrop-blur-xl border-2 rounded-2xl p-4 md:p-8 relative overflow-hidden shadow-2xl
                                    ${lastResult === 'WRONG' ? 'border-red-500 shadow-red-500/20' :
                                        lastResult === 'CORRECT' ? 'border-green-500 shadow-green-500/20' : 'border-purple-500/30 shadow-purple-500/20'}
                                    transition-colors duration-300
                                `}
                            >
                                {/* CRT Scanline Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-0 opacity-20" />

                                {/* Header */}
                                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 border-b border-white/5 pb-2 md:pb-4">
                                    <Terminal className="text-purple-400" size={16} />
                                    <span className="text-xs md:text-sm font-mono text-gray-400 uppercase">Input Required // Query_ID: {QUESTIONS[currentQIndex].id}</span>
                                </div>

                                {/* Question */}
                                <div className="relative z-10 mb-6 md:mb-10 min-h-[80px]">
                                    <div className="font-mono text-lg md:text-3xl text-gray-200 leading-relaxed">
                                        <span className="text-purple-500 mr-2 md:mr-4">&gt;&gt;</span>
                                        {QUESTIONS[currentQIndex].question}
                                        <span className="animate-pulse ml-1">_</span>
                                    </div>
                                </div>

                                {/* Options Grid */}
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-4">
                                    {QUESTIONS[currentQIndex].options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => !lastResult && handleAnswer(i)}
                                            disabled={!!lastResult}
                                            className={`
                                                group relative p-3 md:p-4 rounded-xl text-left border transition-all duration-200
                                                ${lastResult ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}
                                                bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-500/50
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center bg-white/10 text-[10px] md:text-xs font-mono text-gray-400 group-hover:bg-purple-500 group-hover:text-black transition-colors">
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                <span className="font-mono text-sm md:text-lg text-gray-300 group-hover:text-white">{opt}</span>
                                            </div>

                                            {/* Corner Accents */}
                                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 rounded-tr group-hover:border-purple-400 transition-colors" />
                                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 rounded-bl group-hover:border-purple-400 transition-colors" />
                                        </button>
                                    ))}
                                </div>

                                {/* Feedback Overlay (Absolute) */}
                                <AnimatePresence>
                                    {lastResult && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                        >
                                            <div className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-4 ${lastResult === 'CORRECT' ? 'border-green-500 bg-green-900/20 text-green-400' : 'border-red-500 bg-red-900/20 text-red-500'}`}>
                                                {lastResult === 'CORRECT' ? <CheckCircle size={64} /> : <XCircle size={64} />}
                                                <span className="text-3xl font-black font-orbitron tracking-widest">{lastResult}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

                {gameState === 'GAMEOVER' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel p-12 text-center bg-black/60 border border-white/10 max-w-2xl mx-auto rounded-3xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />

                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold text-gray-300 mb-2">SIMULATION COMPLETE</h2>
                            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-8 drop-shadow-2xl">
                                {score}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-10 max-w-sm mx-auto">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Status</div>
                                    <div className={`font-bold ${health > 0 ? 'text-green-400' : 'text-red-500'}`}>
                                        {health > 0 ? 'SURVIVED' : 'TERMINATED'}
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Accuracy</div>
                                    <div className="font-bold text-white">-</div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <NeonButton onClick={resetGame} color="purple">
                                    RETRY SIMULATION
                                </NeonButton>
                                <NeonButton onClick={() => navigate('/battle-arena')} color="red">
                                    ABORT
                                </NeonButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </PageLayout>
    );
};

export default LogicWars;
