import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { usePlayer } from '../context/PlayerContext';
import { Shield, Sword, Cpu, Activity, Database, Terminal, Zap, Lock, Scan, Award, Medal } from 'lucide-react';
import Button from '../components/ui/Button';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS, getRank } from '../data/achievements';

const RarityColor = {
    "Common": "text-gray-400 border-gray-600 shadow-gray-500/10",
    "Rare": "text-cyan-400 border-cyan-500 shadow-cyan-500/20",
    "Epic": "text-purple-400 border-purple-500 shadow-purple-500/20",
    "Legendary": "text-yellow-400 border-yellow-500 shadow-yellow-500/20",
};

const SkillNode = ({ icon: Icon, label, level, max = 10, color, active, onUpgrade, canUpgrade }) => {
    return (
        <div className="relative group">
            {/* Connection Line Placeholder (Vertical) */}
            <div className={`absolute -top-8 left-1/2 w-0.5 h-8 bg-gray-800 transition-colors duration-500 ${level > 0 ? color.replace('text-', 'bg-').replace('400', '500') : ''}`} />

            <button
                onClick={onUpgrade}
                disabled={!canUpgrade}
                className={clsx(
                    "relative z-10 w-24 h-24 hexagon flex flex-col items-center justify-center p-2 transition-all duration-300 clip-hexagon",
                    level > 0
                        ? `bg-gray-900 border-2 ${color.replace('text-', 'border-')}`
                        : "bg-gray-900/50 border-2 border-dashed border-gray-700 hover:border-gray-500",
                    canUpgrade && "hover:scale-110 cursor-pointer shadow-[0_0_20px_rgba(var(--accent-primary),0.3)]"
                )}
            >
                <Icon size={24} className={level > 0 ? color : "text-gray-600"} />
                <span className="text-[10px] font-orbitron mt-1 text-gray-300">{label}</span>
                <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1 h-3 rounded-sm ${i < level ? color.replace('text-', 'bg-') : 'bg-gray-800'}`} />
                    ))}
                </div>
            </button>

            {/* Hover Detail */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="bg-black/90 border border-theme-text/20 p-2 rounded text-center backdrop-blur-md">
                    <p className="text-xs text-gray-300">Level {level} / {max}</p>
                    <p className="text-[10px] text-gray-500">{canUpgrade ? "Click to Upgrade" : "Locked / No Points"}</p>
                </div>
            </div>
        </div>
    );
};


const WarRoom = () => {
    const { playerData, actions } = usePlayer();
    const { level, xp, maxXp, hp, maxHp, skillPoints, damageSkill, critSkill, healSkill } = playerData;
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'skills', 'loadout', 'records'
    const [scanning, setScanning] = useState(false);

    // XP Progress
    const xpPercent = (xp / maxXp) * 100;

    const navTabs = [
        { id: 'overview', label: 'OPERATOR DASHBOARD', icon: Activity },
        { id: 'skills', label: 'NEURAL UPGRADES', icon: Cpu },
        { id: 'loadout', label: 'ARMORY / LOADOUT', icon: Sword },
        { id: 'records', label: 'SERVICE RECORD', icon: Award },
    ];

    return (
        <PageLayout>
            <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-4 p-2 overflow-hidden relative z-10 animate-in fade-in duration-700">

                {/* Compact Header */}
                <div className="flex flex-col md:flex-row gap-4 shrink-0">
                    <div className="glass-panel p-3 flex items-center gap-4 flex-1 relative overflow-hidden">
                        <div className="w-12 h-12 bg-cyan-900/30 rounded-full flex items-center justify-center border border-cyan-500/50">
                            <Scan size={24} className="text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-orbitron theme-text">{playerData.classType}</h2>
                            <p className="text-xs font-mono text-gray-500">Lvl {level} // {getRank(level).title}</p>
                        </div>

                        {/* XP Bar Integrated */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900">
                            <motion.div
                                className="h-full bg-cyan-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Navigation Tabs - Simplified */}
                    <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/10 overflow-x-auto">
                        {navTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded font-orbitron text-[10px] tracking-wider transition-all whitespace-nowrap flex-1 justify-center",
                                    activeTab === tab.id
                                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                )}
                            >
                                <tab.icon size={14} />
                                <span className="hidden md:inline">{tab.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                {/* Left: Vitals Scan */}
                                <div className="glass-panel p-6 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-orbitron theme-text text-lg flex items-center gap-2">
                                            <Activity size={18} className="text-red-400" /> SYSTEM DIAGNOSTICS
                                        </h3>
                                        <button onClick={() => setScanning(!scanning)} className="text-[10px] text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded hover:bg-cyan-500/10 transition-colors uppercase tracking-widest">
                                            {scanning ? 'Halt Scan' : 'Init Scan'}
                                        </button>
                                    </div>

                                    <div className="relative h-64 flex items-center justify-center mb-6 bg-black/20 rounded-lg border border-theme-text/5">
                                        <div className={`relative transition-all duration-1000 ${scanning ? 'scale-100 opacity-100' : 'scale-95 opacity-50 blur-[1px]'}`}>
                                            <div className="w-40 h-56 border-2 border-dashed border-cyan-500/30 rounded-lg flex flex-col items-center justify-center p-2 relative">
                                                <div className="w-full h-px bg-cyan-500/50 absolute top-1/2 animate-scan shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                                                <span className="font-mono text-[10px] text-cyan-500 absolute top-2 left-2">SYS.Lvl: {level}</span>
                                                <span className="font-mono text-[10px] text-red-500 absolute bottom-2 right-2">HP.Max: {hp}</span>
                                                <Shield size={64} className="text-gray-700 opacity-50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 font-mono text-sm">
                                        <div className="flex justify-between border-b border-theme-text/5 pb-2">
                                            <span className="text-gray-400">Health Integrity</span>
                                            <span className="text-green-400">{hp} / {maxHp}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-theme-text/5 pb-2">
                                            <span className="text-gray-400">Base Output (DMG)</span>
                                            <span className="text-red-400">{(10 + damageSkill * 2).toFixed(1)} UNITS</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Clock Speed (CRIT)</span>
                                            <span className="text-yellow-400">{(1.0 + critSkill * 0.05).toFixed(2)}x</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Quick Summary or Flavor Text */}
                                <div className="space-y-6">
                                    <div className="glass-panel p-6 border-l-4 border-l-purple-500">
                                        <h3 className="theme-text font-orbitron text-sm mb-2">CURRENT MISSION DIRECTIVE</h3>
                                        <p className="text-gray-400 text-sm italic">
                                            "System complexity increasing. Recursive entities detected in lower memory sectors. Recommend upgrading neural pathways before further engagement."
                                        </p>
                                    </div>
                                    <div className="glass-panel p-6 flex items-center justify-between">
                                        <div>
                                            <div className="text-gray-500 text-xs">UNSPENT NEURAL POINTS</div>
                                            <div className="text-3xl text-purple-400 font-bold">{skillPoints}</div>
                                        </div>
                                        {skillPoints > 0 && (
                                            <Button onClick={() => setActiveTab('skills')} variant="primary" size="sm">
                                                UPGRADE NOW
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SKILLS TAB */}
                        {activeTab === 'skills' && (
                            <motion.div
                                key="skills"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-panel p-8 relative overflow-hidden backdrop-blur-xl"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="text-xs font-mono text-purple-300 bg-purple-900/40 px-3 py-1 rounded border border-purple-500/30">
                                        AVAILABLE POINTS: {skillPoints}
                                    </span>
                                </div>

                                <div className="text-center mb-12">
                                    <h3 className="font-orbitron theme-text text-xl mb-2 flex items-center justify-center gap-2">
                                        <Cpu size={24} className="text-purple-400" /> NEURAL UPGRADE PATH
                                    </h3>
                                    <p className="text-gray-500 text-xs max-w-md mx-auto">Allocating points permanently rewrites your combat subroutines.</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-12 md:gap-24 relative z-10 mb-16">
                                    {/* Damage Node */}
                                    <SkillNode
                                        icon={Sword}
                                        label="OVERCLOCK"
                                        level={damageSkill}
                                        color="text-red-400"
                                        active={true}
                                        onUpgrade={() => actions.spendSkillPoint('damage')}
                                        canUpgrade={skillPoints > 0}
                                    />

                                    {/* Crit Node */}
                                    <SkillNode
                                        icon={Terminal}
                                        label="PRECISION"
                                        level={critSkill}
                                        color="text-yellow-400"
                                        active={true}
                                        onUpgrade={() => actions.spendSkillPoint('crit')}
                                        canUpgrade={skillPoints > 0}
                                    />

                                    {/* Heal Node */}
                                    <SkillNode
                                        icon={Database}
                                        label="RECOVERY"
                                        level={healSkill}
                                        color="text-green-400"
                                        active={true}
                                        onUpgrade={() => actions.spendSkillPoint('heal')}
                                        canUpgrade={skillPoints > 0}
                                    />
                                </div>

                                {/* Advanced Perks */}
                                <div className="border-t border-theme-text/5 pt-8">
                                    <h4 className="font-orbitron text-xs text-gray-500 mb-8 text-center tracking-[0.2em] uppercase">Advanced Neural Protocols (Cost: 2 SP, Lvl 5+)</h4>
                                    <div className="flex justify-center gap-10 flex-wrap">
                                        <SkillNode
                                            icon={Cpu}
                                            label="PY_COMPILER"
                                            level={playerData.advancedSkills?.optimized_compiler ? 1 : 0}
                                            max={1}
                                            color="text-blue-400"
                                            active={true}
                                            onUpgrade={() => actions.unlockAdvancedSkill('optimized_compiler')}
                                            canUpgrade={skillPoints >= 2 && !playerData.advancedSkills?.optimized_compiler}
                                        />
                                        <SkillNode
                                            icon={Zap}
                                            label="LOOP_MASTERY"
                                            level={playerData.advancedSkills?.loop_mastery ? 1 : 0}
                                            max={1}
                                            color="text-orange-400"
                                            active={true}
                                            onUpgrade={() => actions.unlockAdvancedSkill('loop_mastery')}
                                            canUpgrade={skillPoints >= 2 && !playerData.advancedSkills?.loop_mastery}
                                        />
                                        <SkillNode
                                            icon={Scan}
                                            label="DEBUG_SUITE"
                                            level={playerData.advancedSkills?.debug_suite ? 1 : 0}
                                            max={1}
                                            color="text-pink-400"
                                            active={true}
                                            onUpgrade={() => actions.unlockAdvancedSkill('debug_suite')}
                                            canUpgrade={skillPoints >= 2 && !playerData.advancedSkills?.debug_suite}
                                        />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
                            </motion.div>
                        )}

                        {/* LOADOUT TAB */}
                        {activeTab === 'loadout' && (
                            <motion.div
                                key="loadout"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-panel p-6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-orbitron theme-text text-lg">STORAGE_DRIVE_01</h3>
                                    <span className="text-xs text-gray-500 font-mono">{playerData.inventory.length} / 12 SLOTS USED</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                    {playerData.inventory.map((item, idx) => (
                                        <div key={idx} className="group relative">
                                            <div className={`aspect-square bg-gray-900/80 border rounded-xl flex flex-col items-center justify-center p-3 transition-all hover:bg-gray-800 cursor-pointer ${RarityColor[item.rarity] || RarityColor["Common"]}`}>
                                                <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                                                    <Sword size={24} />
                                                </div>
                                                <span className="text-[10px] font-mono text-center leading-tight truncate w-full px-1">{item.name}</span>
                                            </div>

                                            {/* Item Tooltip */}
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black/95 border border-gray-700 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                                <h4 className={`text-sm font-bold mb-1 ${item.rarity === 'Legendary' ? 'text-yellow-400' : 'text-gray-200'}`}>{item.name}</h4>
                                                <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                                                    <div className="flex justify-between">
                                                        <span>DMG DEALT</span>
                                                        <span className="theme-text">{item.damage}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>CRIT %</span>
                                                        <span className="theme-text">{(item.critChance * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>TYPE</span>
                                                        <span className={RarityColor[item.rarity]?.split(' ')[0]}>{item.rarity}</span>
                                                    </div>
                                                    <div className="pt-2 italic text-gray-500 border-t border-gray-800 mt-1">
                                                        "{item.description}"
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {[...Array(Math.max(0, 12 - playerData.inventory.length))].map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square bg-black/20 border border-dashed border-gray-800 rounded-xl flex items-center justify-center opacity-50 group hover:border-theme-text/20 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-gray-800 group-hover:bg-gray-700" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* RECORDS TAB (ACHIEVEMENTS) */}
                        {activeTab === 'records' && (
                            <motion.div
                                key="records"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass-panel p-8"
                            >
                                <h3 className="font-orbitron theme-text text-lg flex items-center gap-2 mb-8">
                                    <Award size={20} className="text-yellow-500" /> SERVICE COMMENDATIONS
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {ACHIEVEMENTS.map(ach => {
                                        const isUnlocked = playerData.achievements?.includes(ach.id);
                                        return (
                                            <div
                                                key={ach.id}
                                                className={`p-4 rounded-lg border flex items-center gap-4 transition-all duration-300
                                                    ${isUnlocked
                                                        ? 'bg-gradient-to-br from-yellow-900/10 to-transparent border-yellow-500/30'
                                                        : 'bg-black/30 border-theme-text/5 opacity-50 grayscale'}
                                                `}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2
                                                    ${isUnlocked ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-gray-900 border-gray-700 text-gray-600'}
                                                `}>
                                                    <ach.icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className={`font-orbitron text-sm ${isUnlocked ? 'theme-text' : 'text-gray-500'}`}>{ach.title}</h4>
                                                    <p className="text-xs text-gray-400 leading-tight mt-1">{ach.description}</p>
                                                    {isUnlocked && <div className="mt-2 text-[10px] text-yellow-500/70 font-mono tracking-wider">STATUS: AWARDED</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

            </div>

            <style jsx>{`
                .clip-hexagon {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </PageLayout>
    );
};

export default WarRoom;
