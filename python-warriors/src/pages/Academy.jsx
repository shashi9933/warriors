import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { BookOpen, Code, Play, CheckCircle, Lock, Terminal, Monitor, Cpu, Database, ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const CHAPTERS = [
    {
        id: 'basics',
        title: 'SEQUENCE 1: CORE SYNTAX',
        desc: 'Initialize your neural pathways with Python fundamentals.',
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
                    { title: "Loops & Iteration", duration: "15:00", completed: false } // Fixed to match original count if needed or just kept distinct
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
        title: 'SEQUENCE 2: DATA MATRICES',
        desc: 'Organize and manipulate complex data structures.',
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
    const [output, setOutput] = useState("");

    const handleRunCode = () => {
        setOutput("> Compiling...");
        setTimeout(() => {
            // Simple mock validation
            if (code.length > 10) {
                setOutput("> ABSTRACTION LAYER: SUCCESS\n> OUTPUT: [Process Completed with Exit Code 0]\n> REWARD: 50 XP Gained");
            } else {
                setOutput("> SYNTAX ERROR: Logic density too low.\n> HINT: Expand your algorithmic approach.");
            }
        }, 1000);
    };

    return (
        <PageLayout>
            <div className="flex-1 w-full flex flex-col md:flex-row gap-6 p-2 md:p-4 overflow-hidden relative z-10 animate-in fade-in duration-700">

                {/* Left: Codex Navigation */}
                <div className="w-full md:w-80 flex flex-col gap-4 shrink-0">

                    {/* Header */}
                    <div className="glass-panel p-4 flex items-center gap-3 border-l-4 border-l-cyan-500">
                        <div className="w-10 h-10 rounded bg-cyan-900/20 flex items-center justify-center border border-cyan-500/30">
                            <Database size={20} className="text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="font-orbitron text-lg text-white">THE CODEX</h2>
                            <p className="text-[10px] text-gray-400 font-mono">KNOWLEDGE ARCHIVE</p>
                        </div>
                    </div>

                    {/* Chapter Selection */}
                    <div className="glass-panel p-2 flex-1 overflow-y-auto custom-scrollbar">
                        {CHAPTERS.map(chapter => (
                            <div key={chapter.id} className="mb-4 last:mb-0">
                                <div className="px-3 py-2 text-xs font-bold text-gray-500 font-orbitron tracking-widest uppercase flex items-center gap-2">
                                    <Layers size={12} /> {chapter.title}
                                </div>
                                <div className="space-y-1 mt-1">
                                    {chapter.modules.map(mod => (
                                        <button
                                            key={mod.id}
                                            onClick={() => {
                                                setActiveChapter(chapter);
                                                setActiveModule(mod);
                                                setMode('LECTURE');
                                            }}
                                            className={`w-full text-left p-3 rounded border transition-all duration-200 group relative overflow-hidden
                                                ${activeModule.id === mod.id
                                                    ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                    : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                                            `}
                                        >
                                            <div className="flex justify-between items-center relative z-10">
                                                <span className="text-xs font-bold font-mono group-hover:translate-x-1 transition-transform">{mod.title}</span>
                                                {activeModule.id === mod.id && <ChevronRight size={14} className="text-cyan-400" />}
                                            </div>
                                            {activeModule.id === mod.id && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Content Viewer */}
                <div className="flex-1 glass-panel p-0 flex flex-col relative overflow-hidden bg-black/80 border border-white/10">

                    {/* Top Bar */}
                    <div className="h-14 border-b border-white/10 flex items-center px-4 justify-between bg-black/40">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono text-cyan-500 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/30">
                                MOD_ID: {activeModule.id.toString().padStart(3, '0')}
                            </span>
                            <h2 className="text-sm md:text-base font-bold text-white font-orbitron">{activeModule.title}</h2>
                        </div>

                        {/* Mode Toggles */}
                        <div className="flex bg-black/60 rounded p-1 border border-white/10">
                            <button
                                onClick={() => setMode('LECTURE')}
                                className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider flex items-center gap-2 transition-all
                                    ${mode === 'LECTURE' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-gray-300'}
                                `}
                            >
                                <Monitor size={12} /> DATA
                            </button>
                            <button
                                onClick={() => {
                                    setMode('PRACTICE');
                                    setCode(activeModule.practice.starterCode);
                                }}
                                className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider flex items-center gap-2 transition-all
                                    ${mode === 'PRACTICE' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-gray-300'}
                                `}
                            >
                                <Code size={12} /> SIMULATION
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {mode === 'LECTURE' && (
                                <motion.div
                                    key="lecture"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="relative z-10 max-w-3xl mx-auto space-y-8"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                            <BookOpen size={32} className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-orbitron font-black text-white mb-2">{activeModule.title}</h1>
                                            <p className="text-gray-400 text-sm md:text-base">{activeModule.desc}</p>
                                        </div>
                                    </div>

                                    {/* Video / Visual Placeholder */}
                                    <div className="w-full aspect-video bg-black rounded-lg border border-white/10 relative group overflow-hidden shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-purple-900/20 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                                                <Play size={24} className="text-cyan-400 ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-4 font-mono text-xs text-cyan-500">
                                            ACCESSING_NEURAL_FEED...
                                        </div>
                                    </div>

                                    {/* Curriculum List */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Modules Loaded</h3>
                                        {activeModule.lectures.map((lec, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:bg-white/10 transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${lec.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                                        {i + 1}
                                                    </div>
                                                    <span className={`text-sm ${lec.completed ? 'text-gray-300' : 'text-gray-400 group-hover:text-white'}`}>{lec.title}</span>
                                                </div>
                                                <span className="text-xs font-mono text-gray-600 border border-white/5 px-2 py-0.5 rounded">{lec.duration}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 flex justify-center">
                                        <Link to="/arena" className="group relative px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold rounded overflow-hidden transition-all">
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            <span className="relative flex items-center gap-2">
                                                ENGAGE PRACTICAL EXAM <ChevronRight size={16} />
                                            </span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {mode === 'PRACTICE' && (
                                <motion.div
                                    key="practice"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full flex flex-col relative z-10"
                                >
                                    <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-lg mb-4">
                                        <h3 className="text-purple-400 font-orbitron text-sm mb-2 flex items-center gap-2">
                                            <Terminal size={16} /> SIMULATION PARAMETERS
                                        </h3>
                                        <p className="text-gray-300 text-sm">{activeModule.practice.desc}</p>
                                    </div>

                                    <div className="flex-1 bg-[#0d0d0d] rounded-lg border border-white/10 flex flex-col overflow-hidden shadow-2xl font-mono text-sm relative group">
                                        {/* Mock Line Numbers */}
                                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-white/5 text-gray-600 flex flex-col items-end pr-2 pt-4 select-none pointer-events-none">
                                            {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                                        </div>

                                        <textarea
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="flex-1 bg-transparent text-gray-300 font-mono p-4 pl-10 resize-none focus:outline-none leading-normal relative z-10"
                                            spellCheck="false"
                                        />

                                        {/* Mock Output Area (Hidden usually, simplified here) */}
                                        <div className="h-32 border-t border-white/10 bg-black/80 p-2 font-mono text-xs">
                                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                                <Terminal size={12} /> CONSOLE OUTPUT
                                            </div>
                                            <div className="text-green-500">
                                                {output || "> Waiting for compilation..."}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-4">
                                        <Button variant="secondary" onClick={() => {
                                            setCode(activeModule.practice.starterCode);
                                            setOutput('');
                                        }}>
                                            RESET SEQUENCE
                                        </Button>
                                        <Button
                                            variant="accent"
                                            className="bg-purple-600 hover:bg-purple-500 relative overflow-hidden"
                                            onClick={handleRunCode}
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                COMPILE & RUN <Play size={14} />
                                            </span>
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
