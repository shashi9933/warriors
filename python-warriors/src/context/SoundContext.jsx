import React, { createContext, useContext, useRef, useEffect, useState } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const audioCtxRef = useRef(null);
    const [muted, setMuted] = useState(false);
    const [bgmEnabled, setBgmEnabled] = useState(false);

    // New Settings
    const [bgmVolume, setBgmVolume] = useState(0.4);
    const [sfxVolume, setSfxVolume] = useState(0.5);
    const [currentTrack, setCurrentTrack] = useState('CYBER'); // CYBER, INDUSTRIAL, AMBIENT

    const bgmIntervalRef = useRef(null);
    const noteIndexRef = useRef(0);

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

    // BGM Sequencer Management
    useEffect(() => {
        if (bgmEnabled && !muted) {
            // Restart if parameters change to apply new track/volume instantly
            stopBGM();
            startBGM();
        } else {
            stopBGM();
        }
        return () => stopBGM();
    }, [bgmEnabled, muted, currentTrack, bgmVolume]); // Re-run when these change

    const playTone = (freq, type, duration, vol = 0.1) => {
        if (muted || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const finalVol = vol * sfxVolume; // Apply SFX Volume
        gain.gain.setValueAtTime(finalVol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playKick = (time) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

        // Kick is loud, so we scale it relative to BGM volume
        const vol = 0.5 * bgmVolume;

        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.5);
    };

    const playHiHat = (time, open = false) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const bufferSize = ctx.sampleRate * (open ? 0.1 : 0.05);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = open ? 3000 : 5000;
        const gain = ctx.createGain();

        const vol = (open ? 0.08 : 0.05) * bgmVolume;

        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.1 : 0.05));

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(time);
    };

    const playBass = (time, freq) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, time);

        const vol = 0.15 * bgmVolume;

        gain.gain.setValueAtTime(vol, time);
        gain.gain.linearRampToValueAtTime(vol * 0.6, time + 0.1);
        gain.gain.linearRampToValueAtTime(0, time + 0.25);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.25);
    }

    // Ambient Drone for 'AMBIENT' track
    const playDrone = (time, freq) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const vol = 0.05 * bgmVolume;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.5);
        gain.gain.linearRampToValueAtTime(0, time + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 2.0);
    }

    const startBGM = () => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const tempo = currentTrack === 'INDUSTRIAL' ? 100 : 120;
        const lookahead = 25.0;
        const scheduleAheadTime = 0.1;
        let nextNoteTime = ctx.currentTime;

        const scheduleNote = () => {
            while (nextNoteTime < ctx.currentTime + scheduleAheadTime) {
                const beat = noteIndexRef.current % 16;
                const quarterBeat = noteIndexRef.current % 4;

                if (currentTrack === 'CYBER') {
                    // E Minor Driving Beat
                    const bassLine = [41.20, 41.20, 49.00, 41.20, 55.00, 49.00, 61.74, 55.00];

                    if (quarterBeat === 0) playKick(nextNoteTime);
                    if (beat % 2 === 0) playHiHat(nextNoteTime);
                    else if (Math.random() > 0.7) playHiHat(nextNoteTime, true);

                    if (beat % 2 === 0) {
                        const noteIndex = Math.floor(beat / 2) % bassLine.length;
                        playBass(nextNoteTime, bassLine[noteIndex]);
                    }
                }
                else if (currentTrack === 'INDUSTRIAL') {
                    // Slower, Heavier, Broken Beat
                    if (beat === 0 || beat === 10) playKick(nextNoteTime);
                    if (beat === 4 || beat === 12) playHiHat(nextNoteTime, true); // Snare-ish
                    if (beat % 2 === 0) playBass(nextNoteTime, 36.71); // Deep D
                }
                else if (currentTrack === 'AMBIENT') {
                    // No drums, just pads
                    if (beat === 0) playDrone(nextNoteTime, 110.00); // A2
                    if (beat === 8) playDrone(nextNoteTime, 130.81); // C3
                }

                const secondsPerBeat = 60.0 / tempo;
                const secondsPer16th = secondsPerBeat / 4;
                nextNoteTime += secondsPer16th;
                noteIndexRef.current++;
                if (noteIndexRef.current === 16) noteIndexRef.current = 0;
            }
        };

        bgmIntervalRef.current = setInterval(scheduleNote, lookahead);
    };

    const stopBGM = () => {
        if (bgmIntervalRef.current) {
            clearInterval(bgmIntervalRef.current);
            bgmIntervalRef.current = null;
        }
    };

    const toggleBGM = () => {
        setBgmEnabled(prev => !prev);
    };

    const playSFX = (type) => {
        if (muted) return;

        switch (type) {
            case 'HOVER':
                playTone(800, 'sine', 0.05, 0.05);
                break;
            case 'CLICK':
                playTone(1200, 'square', 0.1, 0.05);
                setTimeout(() => playTone(600, 'sine', 0.1, 0.05), 50);
                break;
            case 'SUCCESS':
                playTone(440, 'triangle', 0.1, 0.1);
                setTimeout(() => playTone(554, 'triangle', 0.1, 0.1), 100);
                setTimeout(() => playTone(659, 'triangle', 0.2, 0.1), 200);
                break;
            case 'ERROR':
                playTone(150, 'sawtooth', 0.3, 0.1);
                playTone(140, 'sawtooth', 0.3, 0.1);
                break;
            case 'LOADING':
                playTone(1000, 'square', 0.05, 0.05);
                setTimeout(() => playTone(1200, 'square', 0.05, 0.05), 100);
                setTimeout(() => playTone(1400, 'square', 0.05, 0.05), 200);
                break;
            default:
                break;
        }
    };

    return (
        <SoundContext.Provider value={{
            playSFX,
            muted,
            setMuted,
            bgmEnabled,
            toggleBGM,
            bgmVolume,
            setBgmVolume,
            sfxVolume,
            setSfxVolume,
            currentTrack,
            setCurrentTrack
        }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => useContext(SoundContext);
