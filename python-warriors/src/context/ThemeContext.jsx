import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
    NEON_CYBER: 'neon-cyber',
    DEEP_SPACE: 'deep-space', // Keeping for legacy, though might look same as neon
    ROBOTIC: 'robotic',
    TERMINAL: 'terminal',
    CYBERPUNK: 'cyberpunk',
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(THEMES.NEON_CYBER);

    useEffect(() => {
        // Remove all previous theme classes
        document.documentElement.classList.remove(
            ...Object.values(THEMES)
        );
        // Add new theme class
        document.documentElement.classList.add(currentTheme);
    }, [currentTheme]);

    const toggleTheme = (theme) => {
        if (Object.values(THEMES).includes(theme)) {
            setCurrentTheme(theme);
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
