import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />

            {/* Animated Gradient Overlay - Much more subtle */}
            <div
                className="absolute inset-0 opacity-10 transition-all duration-1000"
                style={{
                    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)`
                }}
            />

            {/* Floating Orbs - Reduced opacity and smaller */}
            <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-5 animate-float-${i + 1}`}
                        style={{
                            width: `${60 + i * 30}px`,
                            height: `${60 + i * 30}px`,
                            left: `${15 + i * 25}%`,
                            top: `${20 + i * 20}%`,
                            animationDelay: `${i * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Geometric Shapes - Fewer and more subtle */}
            <div className="absolute inset-0">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute opacity-3 animate-spin-slow`}
                        style={{
                            left: `${10 + i * 25}%`,
                            top: `${15 + i * 20}%`,
                            animationDelay: `${i * 5}s`,
                            animationDuration: `${40 + i * 10}s`,
                        }}
                    >
                        {i % 2 === 0 && (
                            <div className="w-12 h-12 border border-blue-400/20 rotate-45" />
                        )}
                        {i % 2 === 1 && (
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full" />
                        )}
                    </div>
                ))}
            </div>

            {/* Particles - Fewer and more subtle */}
            <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-20 animate-twinkle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${4 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Wave Effect - More subtle */}
            <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden opacity-20">
                <svg
                    className="absolute bottom-0 w-full h-full"
                    viewBox="0 0 1200 200"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,200 C300,150 500,100 600,120 C700,140 900,160 1200,130 L1200,200 Z"
                        fill="url(#wave-gradient)"
                        className="animate-wave"
                    />
                    <defs>
                        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
                            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.1)" />
                            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Grid Pattern - Much more subtle */}
            <div
                className="absolute inset-0 opacity-2"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '80px 80px',
                }}
            />
        </div>
    );
} 