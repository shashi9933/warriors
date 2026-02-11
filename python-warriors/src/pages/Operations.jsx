import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Briefcase, FolderOpen, Lock, Terminal, Shield, Code, Database, ChevronRight, CheckCircle, Clock, AlertTriangle, FileText, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Button from '../components/ui/Button';

// --- MOCK DATA ---
const OPERATIONS_DATA = [
    {
        id: 'op-001',
        title: 'PROTOCOL: WEB_SCRAPER',
        subtitle: 'Data Extraction Automaton',
        status: 'ACTIVE', // ACTIVE, LOCKED, COMPLETED
        difficulty: 'EASY',
        xpReward: 500,
        description: 'Intelligence requires data. Your directory is empty. Construct a Python script to extract headline data from "The Daily Byte" news feed and store it in a structured JSON format.',
        objectives: [
            { id: 101, text: 'Import requests and BeautifulSoup libraries', completed: true },
            { id: 102, text: 'Fetch HTML content from target URL', completed: false },
            { id: 103, text: 'Parse DOM to locate headline elements', completed: false },
            { id: 104, text: 'Export data to "headlines.json"', completed: false },
        ],
        icon: Database,
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500'
    },
    {
        id: 'op-002',
        title: 'PROTOCOL: CIPHER_BREAKER',
        subtitle: 'Cryptography Decryption Tool',
        status: 'LOCKED',
        difficulty: 'HARD',
        xpReward: 1200,
        description: 'Enemy communications have been intercepted but are encrypted using a Caesar Cipher shift. Develop a decryption algorithm to reveal their plans.',
        objectives: [
            { id: 201, text: 'Define alphabet shift logic', completed: false },
            { id: 202, text: 'Create brute-force decryption loop', completed: false },
            { id: 203, text: 'Analyze letter frequency to identify key', completed: false },
        ],
        icon: Lock,
        color: 'text-red-400',
        borderColor: 'border-red-500'
    },
    {
        id: 'op-003',
        title: 'PROTOCOL: SERVER_BOT',
        subtitle: 'Discord Automation Unit',
        status: 'LOCKED',
        difficulty: 'MEDIUM',
        xpReward: 800,
        description: 'Our communication channels need moderation. Build a bot that responds to specific commands and filters out banned keywords.',
        objectives: [
            { id: 301, text: 'Register application in Developer Portal', completed: false },
            { id: 302, text: 'Implement event listeners for messages', completed: false },
            { id: 303, text: 'Deploy to cloud instance', completed: false },
        ],
        icon: Terminal,
        color: 'text-purple-400',
        borderColor: 'border-purple-500'
    }
];

const Operations = () => {
    const [selectedOp, setSelectedOp] = useState(OPERATIONS_DATA[0]);

    return (
        <PageLayout>
            <div className="flex-1 w-full p-4 flex flex-col gap-6 animate-in fade-in duration-500 min-h-[calc(100vh-100px)]">
                {/* Header */}
                <div className="glass-panel p-6 border-l-4 border-l-amber-500 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                            <Briefcase className="text-amber-400" size={32} /> OPERATIONS
                        </h1>
                        <p className="text-gray-400 font-mono mt-2">ACTIVE CASE FILES & FIELD PROJECTS</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-2xl font-bold font-mono text-amber-500">LEVEL 3 CLEARENCE</div>
                        <div className="text-xs text-gray-500">ID: USER-992-ALPHA</div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1">
                    {/* Operations List */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        {OPERATIONS_DATA.map((op) => {
                            const Icon = op.icon;
                            const isLocked = op.status === 'LOCKED';
                            const isSelected = selectedOp.id === op.id;

                            return (
                                <button
                                    key={op.id}
                                    onClick={() => !isLocked && setSelectedOp(op)}
                                    className={clsx(
                                        "relative overflow-hidden p-0 text-left transition-all duration-300 rounded-lg border group",
                                        isSelected ? `bg-white/5 ${op.borderColor}` : "bg-black/40 border-white/10 hover:bg-white/5",
                                        isLocked && "opacity-60 cursor-not-allowed grayscale"
                                    )}
                                >
                                    <div className="p-4 flex gap-4 items-start relative z-10">
                                        <div className={clsx("p-3 rounded bg-black/50 border border-white/10 shrink-0", op.color)}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={clsx("font-orbitron font-bold text-sm", isSelected ? "text-white" : "text-gray-300")}>{op.title}</h3>
                                                {isLocked ? <Lock size={14} className="text-gray-500" /> : <div className={clsx("text-[10px] px-1.5 py-0.5 rounded border border-current font-mono", op.color)}>{op.status}</div>}
                                            </div>
                                            <p className="text-xs text-gray-500 font-mono mb-2">{op.subtitle}</p>

                                            {/* Details Pills */}
                                            <div className="flex gap-2">
                                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 border border-white/5">{op.difficulty}</span>
                                                <span className="text-[10px] bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-500 border border-yellow-500/20">{op.xpReward} XP</span>
                                            </div>
                                        </div>
                                    </div>
                                    {isSelected && <div className={clsx("absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 pointer-events-none")} />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Operation Details */}
                    <div className="flex-1 glass-panel p-0 relative overflow-hidden flex flex-col bg-black/80">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedOp.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                {/* Banner */}
                                <div className="h-48 relative overflow-hidden bg-black border-b border-white/10">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.8)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.8)_50%,rgba(0,0,0,0.8)_75%,transparent_75%,transparent)] bg-[size:20px_20px] opacity-20" />
                                    <div className={clsx("absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80")} />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={clsx("font-mono text-xs px-2 py-1 rounded border border-current bg-black/50 backdrop-blur", selectedOp.color)}>CASE FILE {selectedOp.id}</span>
                                            <span className="text-xs text-gray-400 font-mono bg-black/50 px-2 py-1 rounded border border-white/10 flex items-center gap-1"><Clock size={12} /> EST. TIME: 2 HOURS</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-orbitron font-black text-white glow-text">{selectedOp.title}</h2>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                                    <div className="space-y-8 max-w-3xl">
                                        {/* Briefing */}
                                        <section>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <FileText size={16} /> Mission Briefing
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed font-mono text-sm md:text-base border-l-2 border-white/10 pl-4 py-2 bg-white/5 rounded-r">
                                                {selectedOp.description}
                                            </p>
                                        </section>

                                        {/* Objectives */}
                                        <section>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <CheckCircle size={16} /> Operational Objectives
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedOp.objectives.map((obj) => (
                                                    <div key={obj.id} className="flex items-start gap-4 p-3 rounded bg-black/40 border border-white/5 hover:border-white/10 transition-colors group">
                                                        <div className={clsx(
                                                            "mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                                            obj.completed ? "bg-green-500 border-green-500 text-black" : "border-gray-600 text-transparent"
                                                        )}>
                                                            <CheckCircle size={12} />
                                                        </div>
                                                        <div>
                                                            <p className={clsx("text-sm transition-colors", obj.completed ? "text-gray-500 line-through" : "text-gray-200")}>{obj.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Actions */}
                                        <section className="pt-4 flex flex-col sm:flex-row gap-4">
                                            <Button variant="primary" className="flex-1 py-4 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500">
                                                <Code size={18} /> OPEN WORKSPACE
                                            </Button>
                                            <Button variant="secondary" className="flex-1 py-4 flex items-center justify-center gap-2">
                                                <Upload size={18} /> SUBMIT SOLUTION
                                            </Button>
                                        </section>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Operations;
