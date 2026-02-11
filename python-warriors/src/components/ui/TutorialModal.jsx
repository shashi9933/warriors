import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import Button from './Button';

const TutorialModal = ({ tutorialId, slides, onClose, showAlways = false }) => {
    // Check if tutorial has been seen
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const hasSeen = localStorage.getItem(`tutorial_seen_${tutorialId}`);
        if (!hasSeen || showAlways) {
            setIsOpen(true);
        }
    }, [tutorialId, showAlways]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem(`tutorial_seen_${tutorialId}`, 'true');
        if (onClose) onClose();
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            handleClose();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };

    if (!isOpen) return null;

    const slide = slides[currentSlide];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-lg bg-gray-900/90 border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                            <div className="flex items-center gap-2 text-cyan-400">
                                <HelpCircle size={20} />
                                <h3 className="font-orbitron font-bold tracking-wider">TUTORIAL SEQUENCE</h3>
                            </div>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 min-h-[300px] flex flex-col">
                            <div className="flex-1 flex flex-col items-center text-center space-y-6">
                                {/* Icon/Image Area */}
                                <div className="w-20 h-20 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center mb-2">
                                    {slide.icon ? <slide.icon size={40} className="text-cyan-400" /> : <HelpCircle size={40} className="text-cyan-400" />}
                                </div>

                                {/* Text Content */}
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white font-orbitron">{slide.title}</h2>
                                    <p className="text-gray-300 leading-relaxed text-sm">{slide.description}</p>
                                </div>

                                {/* Optional Custom Content (e.g. image or code snippet) */}
                                {slide.content && (
                                    <div className="w-full p-4 bg-black/50 rounded-lg border border-white/5 text-left">
                                        {slide.content}
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="mt-8 flex items-center justify-between">
                                <div className="flex gap-1">
                                    {slides.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-cyan-500' : 'w-2 bg-gray-700'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    {currentSlide > 0 && (
                                        <button
                                            onClick={prevSlide}
                                            className="p-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                    )}
                                    <Button onClick={nextSlide} variant="primary" className="flex items-center gap-2">
                                        {currentSlide === slides.length - 1 ? 'INITIALIZE' : 'NEXT'}
                                        {currentSlide < slides.length - 1 && <ChevronRight size={16} />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TutorialModal;
