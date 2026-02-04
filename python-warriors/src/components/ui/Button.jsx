import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSound } from '../../context/SoundContext';

const Button = ({
    children,
    variant = 'primary',
    className,
    onClick,
    ...props
}) => {
    const { playSFX } = useSound();

    const variants = {
        primary: "btn-primary", // Defined in index.css
        accent: "btn-accent",   // Defined in index.css
        ghost: "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white border border-transparent rounded-lg transition-all duration-300 font-orbitron text-sm tracking-wide",
        danger: "bg-red-500/10 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-lg transition-all duration-300 font-orbitron font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]"
    };

    const baseStyles = "px-6 py-2 font-orbitron font-bold rounded-lg transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep-space";

    // If variant is primary/accent, we rely on CSS class. If not, we might needed baseStyles?
    // Actually, looking at index.css, btn-primary handles padding/font.

    // For ghost/danger, we might want the baseStyles for layout/focus?
    // Let's stick to the structure that was intended: consistent button look.

    // For now, I'll trust the previous logic which used `variants[variant]` and passed `className`.
    // The previous file had `baseStyles` but the rewrite ignored it. I will keep it simple and clean.

    return (
        <button
            className={twMerge(variants[variant], className)}
            onClick={(e) => {
                playSFX('CLICK');
                onClick && onClick(e);
            }}
            onMouseEnter={() => playSFX('HOVER')}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
