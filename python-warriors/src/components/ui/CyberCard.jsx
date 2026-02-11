import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock } from 'lucide-react';

const CyberCard = ({ title, description, icon: Icon, color = 'cyan', onClick, locked = false }) => {
    const ref = useRef(null);

    // Mouse position for tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const colorClasses = {
        cyan: "from-cyan-500 to-blue-600 border-cyan-500/50 shadow-cyan-500/20",
        purple: "from-purple-500 to-pink-600 border-purple-500/50 shadow-purple-500/20",
        yellow: "from-yellow-400 to-orange-500 border-yellow-500/50 shadow-yellow-500/20",
        green: "from-green-400 to-emerald-600 border-green-500/50 shadow-green-500/20",
        red: "from-red-500 to-rose-600 border-red-500/50 shadow-red-500/20"
    };

    const bgGradient = colorClasses[color] || colorClasses.cyan;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onClick={!locked ? onClick : undefined}
            className={`
                relative h-full w-full rounded-xl p-[2px] cursor-pointer
                bg-gradient-to-br ${locked ? 'from-gray-700 to-gray-800 grayscale opacity-70' : bgGradient}
                transition-all duration-300
                hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)]
                ${locked ? 'cursor-not-allowed' : 'hover:scale-[1.02]'}
            `}
        >
            <div
                className="relative h-full w-full rounded-xl bg-black/90 backdrop-blur-xl p-6 flex flex-col overflow-hidden"
                style={{ transform: "translateZ(20px)" }}
            >
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

                {/* Icon */}
                <div
                    className={`
                        w-14 h-14 rounded-full flex items-center justify-center mb-4
                        bg-gradient-to-br ${bgGradient}
                        text-white shadow-lg
                    `}
                    style={{ transform: "translateZ(30px)" }}
                >
                    {Icon && <Icon size={28} />}
                </div>

                {/* Content */}
                <div style={{ transform: "translateZ(25px)" }}>
                    <h3 className="text-2xl font-bold font-orbitron text-white mb-2 tracking-wide">
                        {title}
                        {locked && <Lock size={16} className="inline ml-2 text-gray-400" />}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Glitch Overlay (on Hover) */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${bgGradient} opacity-0 group-hover:opacity-100`} />

                {/* Status Badge */}
                <div className="mt-auto pt-6 flex justify-between items-center" style={{ transform: "translateZ(20px)" }}>
                    <span className={`text-xs font-mono px-2 py-1 rounded border ${locked ? 'border-gray-600 text-gray-500' : 'border-white/20 text-white/70'}`}>
                        {locked ? 'LOCKED' : 'READY IS STATUS'}
                    </span>
                    {!locked && (
                        <span className="text-xs font-bold text-white uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                            Initialize &gt;&gt;
                        </span>
                    )}
                </div>
            </div>

            {/* Corner Accents */}
            <div className={`absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 ${locked ? 'border-gray-600' : 'border-white'} rounded-tl opacity-50`} />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 ${locked ? 'border-gray-600' : 'border-white'} rounded-br opacity-50`} />
        </motion.div>
    );
};

export default CyberCard;
