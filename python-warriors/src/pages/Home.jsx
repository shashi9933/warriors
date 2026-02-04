import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Activity } from 'lucide-react';
import { useSound } from '../context/SoundContext';

// --- Matrix Rain Effect ---
const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/?[]{}!@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                // Randomly color some characters Cyan for "glitch" look
                ctx.fillStyle = Math.random() > 0.95 ? '#0ff' : '#0F0';

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />;
};

const Home = () => {
    const { playSFX } = useSound();
    const [initSystem, setInitSystem] = useState(false);

    useEffect(() => {
        // Fake system boot delay
        const timer = setTimeout(() => {
            setInitSystem(true);
            playSFX('SUCCESS');
        }, 1000);
        return () => clearTimeout(timer);
    }, [playSFX]);

    return (
        <PageLayout>
            <MatrixRain />

            <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center text-center p-4">

                <AnimatePresence>
                    {!initSystem ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                            className="flex flex-col items-center gap-4"
                        >
                            <Cpu size={64} className="text-cyan-400 animate-pulse" />
                            <div className="font-mono text-cyan-500 text-sm">INITIALIZING KERNEL...</div>
                            <div className="w-48 h-1 bg-gray-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="space-y-8 max-w-5xl"
                        >
                            {/* Version Tag */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-cyan-500/30 rounded-full bg-cyan-900/10 backdrop-blur-sm"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-cyan-400 font-orbitron text-xs tracking-[0.2em] uppercase">System Online V2.1</span>
                            </motion.div>

                            {/* Main Title */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                <h1 className="relative text-6xl md:text-9xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-[0_0_25px_rgba(0,243,255,0.2)] tracking-tighter">
                                    PYTHON <br className="hidden md:block" />
                                    <span className="bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">WARRIORS</span>
                                </h1>
                            </div>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
                            >
                                <b className="text-white">Code is your weapon.</b> Logic is your shield. <br />
                                Hack the multiverse in this <span className="text-cyan-300 font-bold bg-cyan-900/10 px-2 py-1 rounded">Agentic Coding RPG</span>.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
                            >
                                <Link to="/war-room" className="group">
                                    <Button variant="primary" className="text-lg px-10 py-5 shadow-[0_0_30px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-all">
                                        <span className="flex items-center gap-3">
                                            ENTER SYSTEM <Terminal size={20} />
                                        </span>
                                    </Button>
                                </Link>
                                <Link to="/world" className="group">
                                    <Button variant="secondary" className="text-lg px-10 py-5 border-gray-600 group-hover:border-purple-500 group-hover:text-purple-400">
                                        <span className="flex items-center gap-3">
                                            VIEW MAP <Activity size={20} />
                                        </span>
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Stats / Features Strip */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 pt-12 border-t border-white/5"
                            >
                                {[
                                    { icon: Terminal, title: "REAL PYTHON", desc: "Execute code via Pyodide Engine", color: "text-green-400" },
                                    { icon: Zap, title: "BOSS BATTLES", desc: "Adaptive Enemy AI", color: "text-yellow-400" },
                                    { icon: Cpu, title: "NEURAL UPGRADES", desc: "Deep Skill Tree System", color: "text-purple-400" }
                                ].map((feat, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
                                        <feat.icon size={32} className={feat.color} />
                                        <h3 className="font-orbitron font-bold text-gray-200">{feat.title}</h3>
                                        <p className="text-xs text-gray-500 font-mono text-center max-w-[200px]">{feat.desc}</p>
                                    </div>
                                ))}
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageLayout>
    );
};

export default Home;
