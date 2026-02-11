import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Activity } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useSound } from '../context/SoundContext';

const Onboarding = () => {
    const navigate = useNavigate();
    const { actions } = usePlayer();
    const { playSFX } = useSound();

    const [name, setName] = useState('');
    const [selectedClass, setSelectedClass] = useState('Loop Knight');
    const [step, setStep] = useState(1); // 1: Name, 2: Class

    const classes = [
        {
            id: 'Loop Knight',
            icon: Shield,
            desc: "Balanced warrior. High endurance and reliable damage loops.",
            stats: "HP: High | ATK: Med | DEF: High"
        },
        {
            id: 'Logic Mage', // Placeholder for future class
            icon: Zap,
            desc: "Master of algorithms. High focus generation and spell power.",
            stats: "HP: Low | ATK: High | DEF: Low"
        },
        {
            id: 'Data Rogue', // Placeholder for future class
            icon: Activity,
            desc: "Agile operator. Critical hits and rapid execution speed.",
            stats: "HP: Med | ATK: High | CRT: High"
        }
    ];

    const handleSubmit = () => {
        if (!name.trim()) return;
        actions.setIdentity(name, selectedClass);
        playSFX('POWER_UP');
        navigate('/world');
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-orbitron text-white relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md border border-cyan-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.1)] relative z-10">
                <div className="flex items-center gap-3 mb-8 border-b border-cyan-500/20 pb-4">
                    <Terminal className="text-cyan-400" />
                    <h1 className="text-2xl font-bold tracking-widest text-cyan-400">IDENTITY PROTOCOL</h1>
                </div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-mono">ENTER CODENAME:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black border-2 border-cyan-900 focus:border-cyan-400 rounded-lg p-4 text-xl text-center tracking-widest outline-none transition-colors"
                                placeholder="USER_01"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (name.trim()) {
                                    setStep(2);
                                    playSFX('CLICK');
                                } else {
                                    playSFX('ERROR');
                                }
                            }}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 rounded-lg transition-all"
                        >
                            INITIALIZE SEQUENCE
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-sm text-gray-400 font-mono mb-4">SELECT CLASS PROTOCOL:</div>
                        <div className="grid gap-4">
                            {classes.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        setSelectedClass(c.id);
                                        playSFX('HOVER');
                                    }}
                                    className={`relative p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${selectedClass === c.id
                                            ? 'bg-cyan-900/20 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                                            : 'bg-black/40 border-gray-800 hover:border-gray-600'
                                        }`}
                                >
                                    <div className={`p-3 rounded-lg ${selectedClass === c.id ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                                        <c.icon size={24} />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${selectedClass === c.id ? 'text-cyan-400' : 'text-gray-300'}`}>{c.id}</div>
                                        <div className="text-xs text-gray-500 font-mono mt-1">{c.desc}</div>
                                        <div className="text-[10px] text-gray-600 mt-1 font-mono uppercase">{c.stats}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 py-4 rounded-lg transition-all"
                            >
                                BACK
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-[2] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-lg transition-all shadow-lg"
                            >
                                ESTABLISH CONNECTION
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
