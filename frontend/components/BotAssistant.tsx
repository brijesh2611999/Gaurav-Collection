'use client';

import React, { useState, useEffect, useRef } from 'react';

export type BotMood = 'normal' | 'happy' | 'angry' | 'thinking' | 'stylish';

interface BotAssistantProps {
    mood?: BotMood;
    isVisible: boolean;
    message?: string;
}

export default function BotAssistant({ mood = 'normal', isVisible, message }: BotAssistantProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [botPos, setBotPos] = useState({ x: -200, y: 500 }); // Start off-screen lateral
    const botRef = useRef<HTMLDivElement>(null);
    const leftPupilRef = useRef<SVGCircleElement>(null);
    const rightPupilRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Human-Like Interaction: Move the whole body towards the interaction zone
    useEffect(() => {
        if (!isVisible) return;

        const moveTowardsAction = () => {
            setBotPos(prev => {
                // Target: Stay further away from the mouse to avoid feeling too close
                const targetX = mousePos.x > window.innerWidth / 2 ? mousePos.x - 250 : mousePos.x + 250;
                const targetY = mousePos.y + 100;

                // Smooth Human-like Easing
                const dx = (targetX - prev.x) * 0.04;
                const dy = (targetY - prev.y) * 0.04;
                return { x: prev.x + dx, y: prev.y + dy };
            });
        };

        const animationId = requestAnimationFrame(moveTowardsAction);
        return () => cancelAnimationFrame(animationId);
    }, [mousePos, botPos, isVisible]);



    useEffect(() => {
        if (!botRef.current) return;

        const moveEye = (pupilRef: React.RefObject<SVGCircleElement | null>) => {
            if (!pupilRef.current) return;
            const eyeRect = pupilRef.current.parentElement?.getBoundingClientRect();
            if (!eyeRect) return;

            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;

            const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);
            const distance = Math.min(
                Math.hypot(mousePos.x - eyeCenterX, mousePos.y - eyeCenterY) / 15,
                4 // Max eye movement radius
            );

            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            pupilRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
        };

        moveEye(leftPupilRef);
        moveEye(rightPupilRef);
    }, [mousePos]);

    if (!isVisible) return null;

    return (
        <div
            ref={botRef}
            className="fixed z-[300] w-48 h-64 pointer-events-none select-none transition-opacity duration-1000"
            style={{
                left: `${botPos.x}px`,
                top: `${botPos.y}px`,
                transform: `translateX(-50%) translateY(-50%)`,
                opacity: isVisible ? 1 : 0
            }}
        >
            <div className={`relative w-full h-full flex flex-col items-center ${mood === 'happy' ? 'animate-bot-dance' :
                mood === 'angry' ? 'animate-bot-angry-shake' :
                    'animate-bot-walk'
                }`}>

                {/* Sunglasses (Sivaji Style) */}
                <div className={`absolute top-12 z-20 transition-all duration-500 flex gap-1 ${mood === 'happy' || mood === 'stylish' ? 'scale-100 opacity-100' : 'scale-75 opacity-0 -translate-y-10'
                    }`}>
                    <div className="w-12 h-6 bg-black rounded-b-xl border border-white/20 shadow-2xl" />
                    <div className="w-1 h-1 bg-gray-600 mt-2" />
                    <div className="w-12 h-6 bg-black rounded-b-xl border border-white/20 shadow-2xl" />
                </div>

                <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    {/* Stylish Hair (Sivaji Style) */}
                    <path d="M60 40C60 20 140 20 140 40C140 60 160 45 160 70C160 95 140 90 140 90H60C60 90 40 95 40 70C40 45 60 60 60 40Z" fill="#2D3436" />

                    {/* Humanoid Head */}
                    <rect x="55" y="45" width="90" height="85" rx="35" fill="white" stroke="#F3F4F6" strokeWidth="2" />

                    {/* Glassy Mask */}
                    <rect x="65" y="65" width="70" height="40" rx="15" fill="#1F2937" />

                    {/* Eyes */}
                    <g className="transition-all duration-300">
                        {/* Left Eye */}
                        <circle cx="85" cy="85" r="10" fill="white" fillOpacity="0.1" />
                        <circle ref={leftPupilRef} cx="85" cy="85" r="4" fill={mood === 'angry' ? '#FF4757' : mood === 'happy' ? '#10B981' : '#38BDF8'} className="transition-transform duration-75" />

                        {/* Right Eye */}
                        <circle cx="115" cy="85" r="10" fill="white" fillOpacity="0.1" />
                        <circle ref={rightPupilRef} cx="115" cy="85" r="4" fill={mood === 'angry' ? '#FF4757' : mood === 'happy' ? '#10B981' : '#38BDF8'} className="transition-transform duration-75" />
                    </g>

                    {/* Mouth / LED Indicator */}
                    <path
                        d={mood === 'angry' ? "M85 110H115" : mood === 'happy' ? "M85 105C85 105 100 115 115 105" : "M90 110C90 110 100 112 110 110"}
                        stroke={mood === 'angry' ? "#FF4757" : mood === 'happy' ? "#10B981" : "#38BDF8"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Sophisticated Body (Shoulders/Suit Look) */}
                    <path d="M50 135C50 135 40 140 40 160V200H160V160C160 140 150 135 150 135" fill="white" stroke="#F3F4F6" strokeWidth="2" />
                    {/* V-Neck Suit */}
                    <path d="M85 135L100 170L115 135" stroke="#E5E7EB" strokeWidth="2" fill="none" />
                    {/* Center Core Tie Light */}
                    <rect x="96" y="145" width="8" height="20" rx="4" fill={mood === 'angry' ? '#FF4757' : mood === 'happy' ? '#10B981' : '#38BDF8'} className="animate-pulse" />

                    {/* Arms (Sivaji Gesture Potential) */}
                    <g className={`transition-all duration-700 ${mood === 'happy' ? 'translate-y-[-10px]' : ''}`}>
                        {/* Left Arm */}
                        <path d="M40 160C20 160 15 180 20 200" stroke="white" strokeWidth="12" strokeLinecap="round" />
                        {/* Right Arm (The "Salute" or "Thumb Up" Arm) */}
                        <path
                            d={mood === 'happy' ? "M160 160C180 140 190 120 180 100" : "M160 160C180 160 185 180 180 200"}
                            stroke="white" strokeWidth="12" strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </g>
                </svg>
            </div>

            {/* Status Bubble - Moved outside vibrating container for readability */}
            <div className={`absolute -top-6 right-0 bg-white px-4 py-2 rounded-2xl shadow-2xl border border-gray-100 transition-all duration-500 scale-0 origin-bottom ${(mood !== 'normal' || message) ? 'scale-100 opacity-100 translate-y-[-10px]' : 'opacity-0'
                }`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 whitespace-nowrap">
                    {message || (
                        mood === 'happy' ? 'Kya baat hai Bhidu! Mast entry mara! 😎' :
                            mood === 'angry' ? 'Are o bhidu! Galat signal re baba! ⚡' :
                                mood === 'thinking' ? 'Checking kar raha hoon bhidu... 🧐' :
                                    'Checking...'
                    )}
                </p>
                <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
            </div>
        </div>
    );
}
