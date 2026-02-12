import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Info } from 'lucide-react';
import ReactDOM from 'react-dom';

const TourOverlay = ({ steps, isOpen, onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);

    // Update target position on step change or resize
    useEffect(() => {
        if (!isOpen || !steps[currentStep]) return;

        const updatePosition = () => {
            const targetId = steps[currentStep].targetId;
            const element = document.getElementById(targetId);

            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    bottom: rect.bottom,
                    right: rect.right
                });

                // Scroll into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                console.warn(`Tour target not found: ${targetId}`);
                // Fallback: center screen if element missing
                setTargetRect(null);
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [currentStep, isOpen, steps]);

    if (!isOpen) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onComplete && onComplete();
            onClose();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] overflow-hidden"
            >
                {/* Dark Overlay with Hole (Clip-path) */}
                {targetRect && (
                    <div
                        className="absolute inset-0 bg-black/70 transition-all duration-300 ease-in-out"
                        style={{
                            clipPath: `polygon(
                                0% 0%, 
                                0% 100%, 
                                100% 100%, 
                                100% 0%, 
                                ${targetRect.left}px 0%, 
                                ${targetRect.left}px ${targetRect.top}px, 
                                ${targetRect.right}px ${targetRect.top}px, 
                                ${targetRect.right}px ${targetRect.bottom}px, 
                                ${targetRect.left}px ${targetRect.bottom}px, 
                                ${targetRect.left}px 0%
                            )`
                        }}
                    >
                        {/* Spotlight Glow Border */}
                        <div
                            className="absolute border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] rounded-lg pointer-events-none transition-all duration-300 ease-in-out"
                            style={{
                                top: targetRect.top - 4,
                                left: targetRect.left - 4,
                                width: targetRect.width + 8,
                                height: targetRect.height + 8
                            }}
                        />
                    </div>
                )}

                {/* Fallback Overlay if no target found */}
                {!targetRect && <div className="absolute inset-0 bg-black/80" />}

                {/* Tooltip Card */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute z-[101] max-w-sm w-full"
                    style={{
                        top: targetRect ? Math.min(Math.max(targetRect.bottom + 20, 20), window.innerHeight - 200) : '50%',
                        left: targetRect ? Math.min(Math.max(targetRect.left, 20), window.innerWidth - 340) : '50%',
                        transform: !targetRect ? 'translate(-50%, -50%)' : 'none'
                    }}
                >
                    <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold border border-cyan-500/30">
                                STEP {currentStep + 1}/{steps.length}
                            </span>
                        </div>

                        <h3 className="text-lg font-orbitron font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed mb-6">{step.content}</p>

                        <div className="flex justify-between items-center">
                            {/* Dots Indicator */}
                            <div className="flex gap-1">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentStep ? 'bg-cyan-400' : 'bg-gray-700'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
                            >
                                {isLastStep ? 'FINISH' : 'NEXT'} <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default TourOverlay;
