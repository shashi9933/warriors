import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { BookOpen, Code, Play, CheckCircle, Lock, Terminal, Monitor, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CHAPTERS = [
    {
        id: 'basics',
        title: 'Chapter 1: The Source Code',
        desc: 'Master the fundamentals of Python syntax.',
        modules: [
            {
                id: 1,
                title: "Python Basics",
                desc: "Variables, Types & Printing",
                lectures: [
                    { title: "The Power of Python", duration: "5:00", completed: true },
                    { title: "Variables & Memory", duration: "12:00", completed: false },
                    { title: "Data Types Decoded", duration: "8:30", completed: false },
                ],
                practice: {
                    title: "Variable Assignment",
                    desc: "Create a variable 'hero_name' and assign it your name.",
                    starterCode: "hero_name = \"\""
                }
            },
            {
                id: 2,
                title: "Control Flow",
                desc: "If/Else & Logic Gates",
                lectures: [
                    { title: "Boolean Logic", duration: "10:00", completed: false },
                    { title: "Conditional Branching", duration: "15:00", completed: false },
                ],
                practice: {
                    title: "Security Check",
                    desc: "Write an if statement to check if 'level' is greater than 10.",
                    starterCode: "level = 5\n# Write your if statement here"
                }
            }
        ]
    },
    {
        id: 'structures',
        title: 'Chapter 2: Data Structures',
        desc: 'Organize and manipulate complex data.',
        modules: [
            {
                id: 3,
                title: "Lists & Arrays",
                desc: "Storing sequences of data.",
                lectures: [
                    { title: "List Basics", duration: "10:00", completed: false },
                    { title: "Indexing & Slicing", duration: "12:00", completed: false },
                ],
                practice: {
                    title: "Inventory Management",
                    desc: "Create a list called 'inventory' with 3 distinct items.",
                    starterCode: "inventory = []"
                }
            },
            {
                id: 4,
                title: "Loops & Iteration",
                desc: "Repeating actions efficiently.",
                lectures: [
                    { title: "For Loops", duration: "15:00", completed: false },
                    { title: "While Loops", duration: "10:00", completed: false },
                ],
                practice: {
                    title: "Power Cycle",
                    desc: "Write a loop that prints numbers 1 through 5.",
                    starterCode: "for i in range(1, 6):\n    pass"
                }
            }
        ]
    }
];

const Academy = () => {
    const navigate = useNavigate();
    const [activeChapter, setActiveChapter] = useState(CHAPTERS[0]);
    const [activeModule, setActiveModule] = useState(CHAPTERS[0].modules[0]);
    const [mode, setMode] = useState('LECTURE'); // LECTURE or PRACTICE
    const [code, setCode] = useState("");

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex gap-6 p-4">

                {/* Left: Module Sidebar */}
                <div className="w-1/4 glass-panel p-0 flex flex-col overflow-hidden bg-black/60 border-r border-white/10">
                    <div className="p-4 border-b border-white/10 bg-cyan-900/10">
                        <h2 className="font-orbitron text-xl text-cyan-400 flex items-center gap-2">
                            <BookOpen size={20} /> ACADEMY
                        </h2>

                        {/* Chapter Selector */}
                        <select
                            className="mt-2 w-full bg-black border border-white/10 text-xs text-gray-300 p-2 rounded outline-none"
                            value={activeChapter.id}
                            onChange={(e) => {
                                const chap = CHAPTERS.find(c => c.id === e.target.value);
                                setActiveChapter(chap);
                                setActiveModule(chap.modules[0]);
                            }}
                        >
                            {CHAPTERS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeChapter.modules.map((module, i) => (
                            <div
                                key={module.id}
                                onClick={() => {
                                    setActiveModule(module);
                                    setMode('LECTURE');
                                }}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 relative group overflow-hidden
                                    ${activeModule.id === module.id ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-gray-500">MODULE 0{i + 1}</span>
                                    {i === 0 ? <CheckCircle size={14} className="text-green-500" /> : <Lock size={14} className="text-gray-600" />}
                                </div>
                                <h3 className={`font-orbitron font-bold text-sm mb-1 ${activeModule.id === module.id ? 'text-white' : 'text-gray-400'}`}>
                                    {module.title}
                                </h3>
                                <p className="text-xs text-gray-500">{module.desc}</p>

                                {/* Active Indicator */}
                                {activeModule.id === module.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Content Area */}
                <div className="flex-1 glass-panel p-0 flex flex-col bg-black/80 relative overflow-hidden">

                    {/* Header Tabs */}
                    <div className="flex border-b border-white/10 bg-black/40">
                        <button
                            onClick={() => setMode('LECTURE')}
                            className={`flex-1 py-4 text-sm font-orbitron tracking-widest flex items-center justify-center gap-2 transition-colors
                                ${mode === 'LECTURE' ? 'text-cyan-400 bg-cyan-900/10 border-b-2 border-cyan-500' : 'text-gray-500 hover:text-gray-300'}
                            `}
                        >
                            <Monitor size={16} /> LECTURE HALL
                        </button>
                        <button
                            onClick={() => {
                                setMode('PRACTICE');
                                setCode(activeModule.practice.starterCode);
                            }}
                            className={`flex-1 py-4 text-sm font-orbitron tracking-widest flex items-center justify-center gap-2 transition-colors
                                ${mode === 'PRACTICE' ? 'text-purple-400 bg-purple-900/10 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}
                            `}
                        >
                            <Code size={16} /> PRACTICE LAB
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {mode === 'LECTURE' && (
                                <motion.div
                                    key="lecture"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-3xl font-black font-orbitron text-white mb-2">{activeModule.title}</h2>
                                            <p className="text-gray-400">Accessing neural database...</p>
                                        </div>
                                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs font-mono">
                                            PROGRESS: 33%
                                        </div>
                                    </div>

                                    {/* Video Placeholder */}
                                    <div className="w-full aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                        <div className="absolute inset-0 group-hover:opacity-80 transition-opacity bg-gradient-to-tr from-cyan-900/20 to-purple-900/20" />
                                        <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform z-10">
                                            <Play size={32} className="text-cyan-400 ml-1" />
                                        </div>
                                        <div className="absolute bottom-4 left-4 text-sm font-mono text-cyan-300">
                                            NOW PLAYING: {activeModule.lectures.find(l => !l.completed)?.title || "Introduction"}
                                        </div>
                                    </div>

                                    {/* Topics List */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Course Curriculum</h3>
                                        {activeModule.lectures.map((lecture, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${lecture.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <span className={lecture.completed ? 'text-gray-300' : 'text-gray-500'}>{lecture.title}</span>
                                                </div>
                                                <span className="text-xs font-mono text-gray-600">{lecture.duration}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button variant="primary" onClick={() => navigate('/battle-arena')}>
                                            PROCEED TO BATTLE ARENA
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {mode === 'PRACTICE' && (
                                <motion.div
                                    key="practice"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full flex flex-col gap-6"
                                >
                                    <div className="bg-purple-900/10 border border-purple-500/30 p-4 rounded-lg">
                                        <h3 className="text-purple-400 font-orbitron text-lg mb-2 flex items-center gap-2">
                                            <Cpu size={18} /> {activeModule.practice.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {activeModule.practice.desc}
                                        </p>
                                    </div>

                                    <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden flex flex-col">
                                        <div className="bg-black/50 p-2 border-b border-white/10 flex justify-between items-center px-4">
                                            <span className="text-xs text-gray-500 font-mono">sandbox.py</span>
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                            </div>
                                        </div>
                                        <textarea
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="flex-1 bg-transparent text-gray-300 font-mono p-4 resize-none focus:outline-none"
                                            spellCheck="false"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button variant="secondary" onClick={() => setCode(activeModule.practice.starterCode)}>
                                            RESET
                                        </Button>
                                        <Button variant="accent">
                                            RUN TEST <Play size={16} className="ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </PageLayout>
    );
};

export default Academy;
