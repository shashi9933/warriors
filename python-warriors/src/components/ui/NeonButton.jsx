import React from 'react';
import { motion } from 'framer-motion';

const NeonButton = ({ children, onClick, color = 'cyan', className = '', disabled = false, size = 'md' }) => {

    const colors = {
        cyan: "text-cyan-400 border-cyan-500 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
        purple: "text-purple-400 border-purple-500 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
        red: "text-red-400 border-red-500 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
        green: "text-green-400 border-green-500 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
    };

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-6 py-2 text-base",
        lg: "px-8 py-3 text-lg font-bold"
    };

    const activeColor = colors[color] || colors.cyan;
    const activeSize = sizes[size] || sizes.md;

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative overflow-hidden
                border-2 rounded-lg font-orbitron tracking-widest
                transition-all duration-300 uppercase
                ${disabled ? 'opacity-50 grayscale cursor-not-allowed border-gray-600 text-gray-500' : activeColor}
                ${activeSize}
                ${className}
            `}
        >
            {/* Scanline Effect */}
            {!disabled && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1s_infinite]" />
            )}

            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default NeonButton;
