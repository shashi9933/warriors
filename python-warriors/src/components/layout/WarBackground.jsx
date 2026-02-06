import React, { useEffect, useRef } from 'react';

const WarBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Characters to use in the rain: Python keywords and tech symbols
        const chars = 'def class return import from while for if else elif try except finally with as lambda yield None True False pass break continue global nonlocal and or not is in 0123456789ABCDEF'.split(' ');

        // Column settings
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);

        // Array to track the y-coordinate of the drop for each column
        // Initialize with random starting positions to stagger the effect
        const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -canvas.height));

        const draw = () => {
            // Semi-transparent black fill to create fade trail effect
            ctx.fillStyle = 'rgba(5, 5, 16, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px 'Courier New', monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Randomly pick a character
                const text = chars[Math.floor(Math.random() * chars.length)];

                // Color logic: Main green/cyan theme with occasional white highlights
                const isHighlight = Math.random() > 0.98;
                if (isHighlight) {
                    ctx.fillStyle = '#fff'; // Glitch/sparkle
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#fff';
                } else {
                    // Gradient from top to bottom logic not strictly possible easily per-character here without complex passes,
                    // so we alternate between our neon green and cyan accents
                    ctx.fillStyle = Math.random() > 0.5 ? '#0f0' : '#0ff';
                    ctx.shadowBlur = 0;
                }

                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                // Reset drop to top if it goes off screen (with some randomness)
                // drops[i] * fontSize > canvas.height means it's past the bottom
                // Math.random() > 0.975 adds randomness so they don't all reset at once
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Increment y coordinate
                drops[i]++;
            }

            // Draw scanlines
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            for (let i = 0; i < canvas.height; i += 4) {
                ctx.fillRect(0, i, canvas.width, 1);
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 bg-black pointer-events-none opacity-40"
            style={{ filter: 'contrast(1.2) brightness(0.8)' }}
        />
    );
};

export default WarBackground;
