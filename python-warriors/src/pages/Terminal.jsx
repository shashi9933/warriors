import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Terminal as TerminalIcon, Command, Cpu, Shield, Wifi, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePlayer } from '../context/PlayerContext';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'info', content: 'NEURAL LINK ESTABLISHED...' },
        { type: 'info', content: 'WELCOME TO SYSTEM ROOT.' },
        { type: 'success', content: 'Type "help" for available commands.' },
    ]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const { currentTheme, toggleTheme } = useTheme();
    const { playerData } = usePlayer();

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim();
            if (!cmd) return;

            // Add user command to history
            const newHistory = [...history, { type: 'user', content: cmd }];

            // Process command
            const args = cmd.split(' ');
            const command = args[0].toLowerCase();

            switch (command) {
                case 'help':
                    newHistory.push({ type: 'system', content: 'AVAILABLE COMMANDS:' });
                    newHistory.push({ type: 'list', content: 'help      - Show this message' });
                    newHistory.push({ type: 'list', content: 'status    - System operational status' });
                    newHistory.push({ type: 'list', content: 'whoami    - User identity' });
                    newHistory.push({ type: 'list', content: 'clear     - Clear terminal' });
                    newHistory.push({ type: 'list', content: 'theme     - Toggle UI theme' });
                    newHistory.push({ type: 'list', content: 'echo [txt]- Print text' });
                    break;
                case 'clear':
                    setHistory([]);
                    setInput('');
                    return;
                case 'whoami':
                    newHistory.push({ type: 'success', content: `USER: ${playerData.name || 'GUEST'}` });
                    newHistory.push({ type: 'info', content: `RANK: ${playerData.rank || 'NOVICE'}` });
                    newHistory.push({ type: 'info', content: `LEVEL: ${playerData.level}` });
                    break;
                case 'status':
                    newHistory.push({ type: 'success', content: 'SYSTEM ONLINE' });
                    newHistory.push({ type: 'info', content: 'CPU: OPTIMAL' });
                    newHistory.push({ type: 'info', content: 'MEMORY: 14TB FREE' });
                    newHistory.push({ type: 'info', content: `THEME: ${currentTheme.toUpperCase()}` });
                    break;
                case 'theme':
                    toggleTheme();
                    newHistory.push({ type: 'success', content: 'THEME CYCLE INITIATED...' });
                    break;
                case 'echo':
                    newHistory.push({ type: 'info', content: args.slice(1).join(' ') });
                    break;
                case 'sudo':
                    newHistory.push({ type: 'error', content: 'PERMISSION DENIED: ADMIN PRIVILEGES REQUIRED' });
                    break;
                default:
                    newHistory.push({ type: 'error', content: `COMMAND NOT FOUND: ${command}` });
            }

            setHistory(newHistory);
            setInput('');
        }
    };

    return (
        <PageLayout>
            <div className="flex-1 w-full p-4 flex flex-col gap-6 animate-in fade-in duration-500 min-h-[calc(100vh-100px)]">
                <div className="glass-panel p-6 border-l-4 border-l-green-500 shrink-0 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                            <TerminalIcon className="text-green-400" size={32} /> TERMINAL
                        </h1>
                        <p className="text-gray-400 font-mono mt-2">SYSTEM COMMAND LINE & DEVELOPER TOOLS</p>
                    </div>

                    {/* System Stats Mini-Block */}
                    <div className="hidden md:flex gap-4 text-xs font-mono text-gray-500">
                        <div className="flex flex-col items-center">
                            <Activity size={16} className="text-green-500 mb-1" />
                            <span>PING: 24ms</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Wifi size={16} className="text-green-500 mb-1" />
                            <span>NET: SECURE</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Shield size={16} className="text-green-500 mb-1" />
                            <span>FW: ACTIVE</span>
                        </div>
                    </div>
                </div>

                <div
                    className="flex-1 glass-panel p-0 bg-black/90 font-mono text-sm overflow-hidden flex flex-col border border-white/10 shadow-2xl relative"
                    onClick={() => inputRef.current?.focus()}
                >
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

                    <div className="bg-gray-900/50 p-2 border-b border-white/10 flex items-center gap-2 px-4 z-20 select-none">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <span className="ml-4 text-xs text-gray-500">root@python-warriors:~</span>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-2 z-20 custom-scrollbar">
                        {history.map((entry, i) => (
                            <div key={i} className={`${entry.type === 'user' ? 'text-white mt-4' :
                                entry.type === 'error' ? 'text-red-500' :
                                    entry.type === 'success' ? 'text-green-400' :
                                        entry.type === 'list' ? 'text-gray-400 ml-4' :
                                            'text-gray-300'
                                }`}>
                                {entry.type === 'user' ? <span className="text-green-500 mr-2">root@system:~$</span> :
                                    entry.type === 'list' ? '' :
                                        <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>}
                                {entry.content}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-4 border-t border-white/10 bg-black z-20 flex items-center gap-2">
                        <span className="text-green-500">root@system:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-700"
                            placeholder="Type command..."
                            autoFocus
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Terminal;
