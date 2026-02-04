import React, { createContext, useContext, useRef, useEffect, useState } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const audioCtxRef = useRef(null);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        // Initialize Audio Context on first potential interaction
        const initAudio = () => {
            if (!audioCtxRef.current) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtxRef.current = new AudioContext();
            }
        };
        window.addEventListener('click', initAudio, { once: true });
        return () => window.removeEventListener('click', initAudio);
    }, []);

    const playTone = (freq, type, duration, vol = 0.1) => {
        if (muted || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playSFX = (type) => {
        if (muted) return;

        switch (type) {
            case 'HOVER':
                // High-pitch short blip
                playTone(800, 'sine', 0.05, 0.05);
                break;
            case 'CLICK':
                // Future tech click
                playTone(1200, 'square', 0.1, 0.05);
                setTimeout(() => playTone(600, 'sine', 0.1, 0.05), 50);
                break;
            case 'SUCCESS':
                // Ascending major arpeggio
                playTone(440, 'triangle', 0.1, 0.1); // A4
                setTimeout(() => playTone(554, 'triangle', 0.1, 0.1), 100); // C#5
                setTimeout(() => playTone(659, 'triangle', 0.2, 0.1), 200); // E5
                break;
            case 'ERROR':
                // Descending dissonance
                playTone(150, 'sawtooth', 0.3, 0.1);
                playTone(140, 'sawtooth', 0.3, 0.1);
                break;
            case 'ATTACK':
                // Laser zap
                if (!audioCtxRef.current) return;
                const ctx = audioCtxRef.current;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
                break;
            default:
                break;
        }
    };

    return (
        <SoundContext.Provider value={{ playSFX, muted, setMuted }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => useContext(SoundContext);
