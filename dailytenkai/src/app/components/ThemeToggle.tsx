'use client'
import React, { useState, useEffect } from 'react';

const MoonIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#08192d" style={{ width: '3rem', height: '3rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    )
}

const SunIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#fcfaf2" style={{ width: '3rem', height: '3rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
    )
}

interface ThemeToggleProps {
    initialDarkMode?: boolean;
    storageKey?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
    initialDarkMode = false,
    storageKey = 'darkMode',
}) => {
    const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);

    useEffect(() => {
        const isDarkMode = localStorage.getItem(storageKey) === 'true';
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [storageKey]);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem(storageKey, newDarkMode.toString());
        document.documentElement.classList.toggle('dark', newDarkMode);
    };


    return (
        <button onClick={toggleDarkMode} className={darkMode ? 'dark' : ''}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};

export default ThemeToggle;
