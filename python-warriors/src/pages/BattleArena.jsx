import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { Sword, Brain, Trophy, Zap, Lock, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from '../components/ui/NeonButton';

const GAMES = [
    {
        id: 'boss',
        title: "CODE BOSS",
        description: "Engage in direct combat with algorithmic entities. Write efficient Python code to defeat high-level bosses. Earn rare loot and XP.",
        icon: Sword,
        color: "cyan",
        path: "/arena/boss",
        bgGradient: "from-cyan-900/40 via-blue-900/40 to-black/80",
        stats: ["DIFFICULTY: ADAPTIVE", "REWARDS: EPIC", "TYPE: PVE"]
    },
    {
        id: 'mcq',
        title: "LOGIC WARS",
        description: "High-speed tactical trivia. Verify code snippets under time pressure before the firewall collapses.",
        icon: Brain,
        color: "purple",
        path: "/arena/mcq",
        bgGradient: "from-purple-900/40 via-pink-900/40 to-black/80",
        stats: ["DIFFICULTY: HARD", "REWARDS: XP", "TYPE: SPEED"]
    },
    {
        id: 'daily',
        title: "DAILY QUEST",
        description: "Unique daily challenges to climb the global leaderboard. Reset every 24 hours.",
        icon: Trophy,
        color: "yellow",
        path: "/arena/daily",
        locked: true,
        bgGradient: "from-yellow-900/40 via-orange-900/40 to-black/80",
        stats: ["DIFFICULTY: VARIES", "REWARDS: RANK", "TYPE: COMP"]
    },
    {
        id: 'xp',
        title: "XP MINING",
        description: "Repetitive drills to farm raw XP and strengthen basic syntax muscle memory.",
        icon: Zap,
        color: "green",
        path: "/arena/xp",
        locked: true,
        bgGradient: "from-green-900/40 via-emerald-900/40 to-black/80",
        stats: ["DIFFICULTY: EASY", "REWARDS: LOW XP", "TYPE: GRIND"]
    }
];

const BattleArena = () => {
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState(GAMES[0]);

    return (
        <PageLayout>
            <div className="min-h-[calc(100vh-64px)] relative flex flex-col md:flex-row overflow-x-hidden">

                {/* Dynamic Background Layer */}
                <div className="absolute inset-0 z-0 fixed md:absolute">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedGame.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`absolute inset-0 bg-gradient-to-br ${selectedGame.bgGradient}`}
                        />
                    </AnimatePresence>
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
                </div>

                {/* Left Side: Game List */}
                <div className="w-full md:w-1/3 relative z-10 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col shrink-0">
                    <div className="p-4 md:p-8 border-b border-white/10 flex justify-between items-center md:block">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black font-orbitron text-white tracking-tighter">
                                BATTLE<span className="text-cyan-400">ARENA</span>
                            </h1>
                            <p className="text-[10px] md:text-xs text-gray-400 mt-1 md:mt-2 font-mono uppercase tracking-widest">Select Simulation</p>
                        </div>
                    </div>

                    <div className="flex-1 md:overflow-y-auto p-2 md:p-4 space-y-2 custom-scrollbar">
                        {GAMES.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => setSelectedGame(game)}
                                className={`w-full text-left p-3 md:p-4 rounded-xl transition-all duration-300 group relative overflow-hidden border ${selectedGame.id === game.id
                                    ? `bg-white/10 border-${game.color}-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]`
                                    : 'bg-transparent border-transparent hover:bg-white/5 border-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3 md:gap-4 relative z-10">
                                    <div className={`p-2 md:p-3 rounded-lg ${selectedGame.id === game.id ? `bg-${game.color}-500 text-white` : `bg-gray-800 text-gray-500 group-hover:text-gray-300`}`}>
                                        <game.icon size={16} className="md:w-5 md:h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold font-orbitron text-sm md:text-base ${selectedGame.id === game.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                            {game.title}
                                        </h3>
                                        <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                            {game.stats[2]} {game.locked && <span className="text-red-500 font-bold flex items-center gap-1"><Lock size={8} /> LOCKED</span>}
                                        </div>
                                    </div>
                                    {selectedGame.id === game.id && (
                                        <motion.div layoutId="active-indicator" className={`w-1 h-6 md:h-8 bg-${game.color}-500 rounded-full`} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Showcase Preview */}
                <div className="w-full md:w-2/3 relative z-10 flex flex-col justify-center px-4 py-8 md:px-16 md:py-0 overflow-visible">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedGame.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-2xl w-full mx-auto md:mx-0"
                        >
                            {/* Decorative Header */}
                            <div className="flex items-center gap-3 mb-4 md:mb-6">
                                <div className={`px-2 md:px-3 py-1 rounded border border-${selectedGame.color}-500/30 bg-${selectedGame.color}-500/10 text-${selectedGame.color}-400 text-[10px] md:text-xs font-mono uppercase tracking-widest`}>
                                    Running Protocol {selectedGame.id.toUpperCase()}_V2.0
                                </div>
                            </div>

                            <h2 className="text-4xl md:text-7xl font-black font-orbitron text-white mb-4 md:mb-6 leading-tight drop-shadow-xl">
                                {selectedGame.title}
                            </h2>

                            <p className="text-sm md:text-xl text-gray-300 mb-6 md:mb-10 leading-relaxed font-light border-l-4 border-white/20 pl-4 md:pl-6">
                                {selectedGame.description}
                            </p>

                            {/* Game Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-12">
                                {selectedGame.stats.map((stat, i) => (
                                    <div key={i} className="bg-black/40 border border-white/10 p-2 md:p-4 rounded-lg backdrop-blur-sm">
                                        <div className="text-[8px] md:text-[10px] text-gray-500 font-mono mb-1">METRIC_0{i + 1}</div>
                                        <div className="text-[10px] md:text-sm font-bold text-white tracking-wider truncate">{stat}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 pb-8 md:pb-0">
                                <NeonButton
                                    onClick={() => navigate(selectedGame.path)}
                                    color={selectedGame.color}
                                    size="lg"
                                    disabled={selectedGame.locked}
                                    className="w-full md:w-auto px-6 py-3 md:px-10 md:py-4 text-lg md:text-xl justify-center"
                                >
                                    {selectedGame.locked ? 'ACCESS DENIED' : (
                                        <>INITIALIZE <Play size={20} fill="currentColor" /></>
                                    )}
                                </NeonButton>

                                {selectedGame.locked && (
                                    <div className="text-red-500 font-mono text-xs md:text-sm flex items-center gap-2 animate-pulse justify-center w-full md:w-auto">
                                        <Lock size={14} /> SECURITY CLEARANCE REQUIRED
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </PageLayout>
    );
};

export default BattleArena;
