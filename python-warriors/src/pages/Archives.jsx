import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Book, FileText, Bookmark, Search, Terminal, Code, Database, ChevronRight, Layers, Cpu, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// --- ARCHEIVE DATA ---
const ARCHIVE_DATA = [
    {
        id: 'syntax',
        title: 'CORE SYNTAX',
        icon: Terminal,
        items: [
            { id: '1', title: 'Variables', desc: 'Containers for storing data values.', content: 'Variables are created the moment you first assign a value to them.\n\ne.g.\nx = 5\ny = "Hello, World!"' },
            { id: '2', title: 'Data Types', desc: 'Text, Semantic, Numeric, and Boolean types.', content: 'Python has the following data types built-in by default:\n\nText Type: str\nNumeric Types: int, float, complex\nSequence Types: list, tuple, range\nMapping Type: dict\nSet Types: set, frozenset\nBoolean Type: bool\nBinary Types: bytes, bytearray, memoryview' },
            { id: '3', title: 'Operators', desc: 'Arithmetic, Assignment, Comparison, Logical.', content: 'Operators are used to perform operations on variables and values.\n\n+ Addition\n- Subtraction\n* Multiplication\n/ Division\n% Modulus\n** Exponentiation\n// Floor division' },
        ]
    },
    {
        id: 'structures',
        title: 'DATA STRUCTURES',
        icon: Database,
        items: [
            { id: '4', title: 'Lists', desc: 'Ordered, changeable, and duplicate values.', content: 'Lists are used to store multiple items in a single variable.\n\nmylist = ["apple", "banana", "cherry"]' },
            { id: '5', title: 'Dictionaries', desc: 'Ordered*, changeable, no duplicates.', content: 'Dictionaries are used to store data values in key:value pairs.\n\nthisdict = {\n  "brand": "Ford",\n  "model": "Mustang",\n  "year": 1964\n}' },
        ]
    },
    {
        id: 'control',
        title: 'CONTROL FLOW',
        icon: Cpu,
        items: [
            { id: '6', title: 'If...Else', desc: 'Conditional statements.', content: 'Python supports the usual logical conditions from mathematics:\n\nEquals: a == b\nNot Equals: a != b\nLess than: a < b\nLess than or equal to: a <= b\nGreater than: a > b\nGreater than or equal to: a >= b' },
            { id: '7', title: 'While Loops', desc: 'Execute modifications while true.', content: 'With the while loop we can execute a set of statements as long as a condition is true.\n\ni = 1\nwhile i < 6:\n  print(i)\n  i += 1' },
            { id: '8', title: 'For Loops', desc: 'Iterating over a sequence.', content: 'A for loop is used for iterating over a sequence (that is either a list, a tuple, a dictionary, a set, or a string).\n\nfruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n  print(x)' },
        ]
    },
    {
        id: 'functions',
        title: 'FUNCTIONS',
        icon: Code,
        items: [
            { id: '9', title: 'Defining Functions', desc: 'Blocks of code capable of execution.', content: 'A function is a block of code which only runs when it is called.\nYou can pass data, known as parameters, into a function.\nA function can return data as a result.\n\ndef my_function():\n  print("Hello from a function")' },
            { id: '10', title: 'Lambda', desc: 'Small anonymous functions.', content: 'A lambda function is a small anonymous function.\nA lambda function can take any number of arguments, but can only have one expression.\n\nx = lambda a : a + 10\nprint(x(5))' },
        ]
    },
    {
        id: 'oop',
        title: 'OBJECT ORIENTED',
        icon: Layers,
        items: [
            { id: '11', title: 'Classes & Objects', desc: 'Object constructors.', content: 'Python is an object oriented programming language.\nAlmost everything in Python is an object, with its properties and methods.\nA Class is like an object constructor, or a "blueprint" for creating objects.\n\nclass MyClass:\n  x = 5' },
            { id: '12', title: 'Inheritance', desc: 'Parent and child classes.', content: 'Inheritance allows us to define a class that inherits all the methods and properties from another class.\n\nParent class is the class being inherited from, also called base class.\nChild class is the class that inherits from another class, also called derived class.' },
        ]
    },
    {
        id: 'security',
        title: 'CYBER SECURITY',
        icon: Shield,
        items: [
            { id: '13', title: 'Input Validation', desc: 'Sanitizing user input.', content: 'Input validation is the process of ensuring that input is clean, correct, and useful.\n\nwhile True:\n    try:\n        age = int(input("Please enter your age: "))\n        break\n    except ValueError:\n        print("Oops!  That was no valid number.  Try again...")' },
        ]
    }
];

const Archives = () => {
    const [activeCategory, setActiveCategory] = useState('syntax');
    const [activeItem, setActiveItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = ARCHIVE_DATA.filter(category => category.id === activeCategory)[0];

    // Search Logic
    const searchResults = ARCHIVE_DATA.flatMap(cat => cat.items).filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageLayout>
            <div className="flex-1 w-full p-4 flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden h-screen md:h-auto">
                <div className="flex items-center justify-between">
                    <div className="border-l-4 border-l-cyan-500 pl-4">
                        <h1 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                            <Book className="text-cyan-400" size={32} /> ARCHIVES
                        </h1>
                        <p className="text-gray-400 font-mono text-xs mt-1">NEURAL KNOWLEDGE BASE v2.0</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden min-h-[600px]">
                    {/* Left Sidebar: Categories & Search */}
                    <div className="w-full md:w-64 flex flex-col gap-4">
                        {/* Search Bar */}
                        <div className="glass-panel p-3 border border-white/10 relative">
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search Database..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded py-1.5 pl-9 pr-4 text-xs text-gray-300 focus:border-cyan-500/50 outline-none font-mono"
                            />
                        </div>

                        {/* Categories List */}
                        {!searchQuery && (
                            <div className="glass-panel p-2 flex-1 overflow-y-auto space-y-1">
                                <div className="px-2 py-1 text-[10px] font-bold text-gray-500 tracking-widest mb-1">DATA SECTORS</div>
                                {ARCHIVE_DATA.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setActiveCategory(cat.id);
                                                setActiveItem(null);
                                            }}
                                            className={clsx(
                                                "w-full text-left px-3 py-2 rounded text-xs font-bold font-orbitron flex items-center gap-3 transition-all",
                                                activeCategory === cat.id
                                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                                            )}
                                        >
                                            <Icon size={14} /> {cat.title}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Search Results List */}
                        {searchQuery && (
                            <div className="glass-panel p-2 flex-1 overflow-y-auto space-y-1">
                                <div className="px-2 py-1 text-[10px] font-bold text-yellow-500 tracking-widest mb-1">SEARCH RESULTS</div>
                                {searchResults.length > 0 ? searchResults.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveItem(item)}
                                        className="w-full text-left px-3 py-2 rounded text-xs font-bold font-mono transition-all hover:bg-white/5 text-gray-400 hover:text-white"
                                    >
                                        {item.title}
                                    </button>
                                )) : (
                                    <div className="text-center py-4 text-xs text-gray-600 font-mono">NO MATCH FOUND</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Middle: Item List */}
                    {!searchQuery && (
                        <div className="w-full md:w-72 glass-panel p-0 flex flex-col overflow-hidden">
                            <div className="p-3 border-b border-white/10 bg-black/20">
                                <h3 className="font-orbitron text-sm text-cyan-400 font-bold">{filteredData?.title}</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {filteredData?.items.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveItem(item)}
                                        className={clsx(
                                            "w-full text-left p-3 rounded border transition-all duration-200 group relative overflow-hidden",
                                            activeItem?.id === item.id
                                                ? "bg-cyan-900/20 border-cyan-500/50 text-white"
                                                : "bg-black/20 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300"
                                        )}
                                    >
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="text-sm font-bold font-mono">{item.title}</span>
                                            <ChevronRight size={14} className={activeItem?.id === item.id ? "text-cyan-400" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Right: Content Viewer */}
                    <div className="flex-1 glass-panel p-0 flex flex-col overflow-hidden relative bg-black/80">
                        {activeItem ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeItem.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col h-full"
                                >
                                    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-900/10 to-transparent">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="text-cyan-400" size={20} />
                                            <div className="text-[10px] font-mono text-cyan-500 border border-cyan-500/30 px-2 rounded">
                                                ID: DOC-{activeItem.id.padStart(3, '0')}
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-orbitron font-bold text-white">{activeItem.title.toUpperCase()}</h2>
                                        <p className="text-gray-400 mt-2 font-mono text-sm">{activeItem.desc}</p>
                                    </div>
                                    <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
                                        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 md:p-6 font-mono text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-wrap shadow-inner relative">
                                            <div className="absolute top-0 right-0 p-2 text-gray-700 opacity-20 pointer-events-none">
                                                <Terminal size={48} />
                                            </div>
                                            {activeItem.content}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4 opacity-50">
                                <Database size={64} strokeWidth={1} />
                                <div className="font-orbitron tracking-widest">SELECT A DATA NODE</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Archives;
