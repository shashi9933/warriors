import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const PageLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-deep-space text-[rgb(var(--text-primary))] font-inter selection:bg-neon-cyan/30 selection:text-neon-cyan">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="pt-16 px-2 pb-4 w-full h-screen mx-auto flex flex-col"
            >
                {children}
            </motion.main>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-magenta/20 rounded-full blur-[128px] animate-pulse-slow mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[128px] animate-pulse-slow mix-blend-screen" />
            </div>
        </div>
    );
};

export default PageLayout;
