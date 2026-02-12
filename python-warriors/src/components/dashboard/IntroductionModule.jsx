import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, BookOpen, Zap, Target, ChevronRight } from 'lucide-react';

const Slide = ({ title, icon: Icon, color, children, onNext }) => (
    <div className="min-w-full md:min-w-[700px] h-full p-6 flex flex-col relative shrink-0 snap-center border-r border-white/5 last:border-r-0">
        <div className="flex items-center gap-2 mb-3">
            <Icon style={{ color }} size={24} />
            <h2 className="text-xl font-orbitron font-bold text-white">{title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
            {children}
        </div>
        {onNext && (
            <button
                onClick={onNext}
                className="absolute bottom-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all group border border-white/10 hover:border-cyan-500/50"
                title="Next Slide"
            >
                <ChevronRight className="text-gray-400 group-hover:text-cyan-400" />
            </button>
        )}
    </div>
);

const IntroductionModule = () => {
    const scrollRef = useRef(null);

    const scroll = (offset) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel border-l-4 border-l-cyan-500 relative overflow-hidden mb-6 h-[320px] flex items-center bg-black/20"
        >
            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full items-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <Slide title="INCOMING TRANSMISSION" icon={MonitorPlay} color="#22d3ee" onNext={() => scroll(600)}>
                    <div className="flex flex-col h-full justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10">
                            <MonitorPlay size={200} className="text-cyan-500" />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <p className="text-gray-300 mb-6 leading-relaxed font-mono text-base">
                                Welcome to <span className="text-cyan-400 font-bold">Python Warriors</span>.
                                <br /><br />
                                This is a combat simulation designed to train your neural network in the Python protocols. You will write code to control your character, defeat enemies, and solve logic puzzles.
                                <br /><br />
                                <span className="text-gray-500 italic border-l-2 border-cyan-500 pl-3 block">"Code is your weapon. Logic is your shield."</span>
                            </p>
                        </div>
                        <div className="text-[10px] font-mono text-cyan-500/50 mt-auto flex items-center gap-2">
                            <span className="animate-pulse">●</span> SLIDE TO NAVIGATE &gt;&gt;&gt;
                        </div>
                    </div>
                </Slide>

                {/* Slide 2: Academy */}
                <Slide title="THE ACADEMY // LEARN" icon={BookOpen} color="#06b6d4" onNext={() => scroll(600)}>
                    <div className="flex gap-6 h-full items-center">
                        <div className="flex-1">
                            <p className="text-gray-300 text-sm font-mono mb-4">
                                <span className="text-cyan-400 font-bold">OBJECTIVE:</span> Master syntax and logic.
                            </p>
                            <ul className="text-gray-400 text-xs leading-relaxed space-y-2 list-disc list-inside marker:text-cyan-500">
                                <li>Access the <strong>ACADEMY</strong> to view interactive lessons.</li>
                                <li>Complete coding drills to earn <span className="text-yellow-400">XP</span>.</li>
                                <li>Unlock new weapons for the Arena.</li>
                            </ul>
                        </div>
                        <div className="w-1/3 h-40 bg-gradient-to-br from-cyan-900/20 to-black border border-cyan-500/30 rounded flex flex-col items-center justify-center p-4 text-center">
                            <BookOpen size={48} className="text-cyan-500/50 mb-2" />
                            <span className="text-[10px] text-cyan-400 font-mono">KNOWLEDGE BASE</span>
                        </div>
                    </div>
                </Slide>

                {/* Slide 3: Arena */}
                <Slide title="THE ARENA // COMBAT" icon={Zap} color="#ef4444" onNext={() => scroll(600)}>
                    <div className="flex gap-6 h-full items-center">
                        <div className="flex-1">
                            <p className="text-gray-300 text-sm font-mono mb-4">
                                <span className="text-red-400 font-bold">OBJECTIVE:</span> Defeat AI Glitches.
                            </p>
                            <ul className="text-gray-400 text-xs leading-relaxed space-y-2 list-disc list-inside marker:text-red-500">
                                <li>Enter the <strong>BATTLE ARENA</strong> to test your code.</li>
                                <li>Write efficient Python code to deal damage.</li>
                                <li>Climb the leaderboard by defeating bosses.</li>
                            </ul>
                        </div>
                        <div className="w-1/3 h-40 bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded flex flex-col items-center justify-center p-4 text-center">
                            <Zap size={48} className="text-red-500/50 mb-2" />
                            <span className="text-[10px] text-red-400 font-mono">COMBAT ZONE</span>
                        </div>
                    </div>
                </Slide>

                {/* Slide 4: Directives */}
                <Slide title="DIRECTIVES // MISSIONS" icon={Target} color="#eab308">
                    <div className="flex gap-6 h-full items-center">
                        <div className="flex-1">
                            <p className="text-gray-300 text-sm font-mono mb-4">
                                <span className="text-yellow-400 font-bold">OBJECTIVE:</span> Daily Tasks.
                            </p>
                            <ul className="text-gray-400 text-xs leading-relaxed space-y-2 list-disc list-inside marker:text-yellow-500">
                                <li>Check <strong>DIRECTIVES</strong> daily for new missions.</li>
                                <li>Earn <span className="text-yellow-400">Gold</span> to upgrade equipment.</li>
                                <li>Maintain your login streak for bonuses.</li>
                            </ul>
                        </div>
                        <div className="w-1/3 h-40 bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-500/30 rounded flex flex-col items-center justify-center p-4 text-center">
                            <Target size={48} className="text-yellow-500/50 mb-2" />
                            <span className="text-[10px] text-yellow-400 font-mono">MISSION LOG</span>
                        </div>
                    </div>
                </Slide>

            </div>
        </motion.div>
    );
};

export default IntroductionModule;
