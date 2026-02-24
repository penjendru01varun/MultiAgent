import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import ChatInterface from './ChatInterface'

// Pure-CSS animated neural core — no WebGL, no crashes
function NeuralCore() {
    const rings = [80, 120, 160, 200, 240]
    const dots = Array.from({ length: 24 }, (_, i) => i)

    return (
        <div style={{
            position: 'relative', width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Ambient glow background */}
            <div style={{
                position: 'absolute', width: 320, height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,243,255,0.08) 0%, transparent 70%)',
                animation: 'pulse-glow 3s ease-in-out infinite'
            }} />

            {/* Concentric spinning rings */}
            {rings.map((size, i) => (
                <div key={size} style={{
                    position: 'absolute',
                    width: size, height: size,
                    borderRadius: '50%',
                    border: `1px solid rgba(0,243,255,${0.08 + i * 0.04})`,
                    animation: `spin-${i % 2 === 0 ? 'cw' : 'ccw'} ${8 + i * 3}s linear infinite`,
                    boxShadow: `0 0 ${6 + i * 2}px rgba(0,243,255,0.05) inset`
                }} />
            ))}

            {/* Orbiting data dots */}
            {dots.map((i) => {
                const angle = (i / dots.length) * 360
                const radius = 70 + (i % 3) * 30
                const delay = -(i * 0.4)
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        width: i % 4 === 0 ? 6 : 3,
                        height: i % 4 === 0 ? 6 : 3,
                        borderRadius: '50%',
                        background: i % 4 === 0 ? '#00f3ff' : 'rgba(0,243,255,0.5)',
                        boxShadow: i % 4 === 0 ? '0 0 8px #00f3ff' : 'none',
                        transform: `rotate(${angle}deg) translateX(${radius}px)`,
                        transformOrigin: `${-radius}px 0`,
                        animation: `orbit ${6 + (i % 5)}s linear ${delay}s infinite`
                    }} />
                )
            })}

            {/* Core orb */}
            <div style={{
                position: 'relative', zIndex: 10,
                width: 56, height: 56, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #00f3ff, #0070ff)',
                boxShadow: '0 0 30px rgba(0,243,255,0.6), 0 0 60px rgba(0,112,255,0.3)',
                animation: 'core-pulse 2s ease-in-out infinite',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 0 10px white'
                }} />
            </div>

            {/* Data stream lines */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <div key={angle} style={{
                    position: 'absolute',
                    width: 2, height: 80,
                    background: `linear-gradient(to top, transparent, rgba(0,243,255,${0.3 + i * 0.05}), transparent)`,
                    transformOrigin: 'bottom center',
                    transform: `rotate(${angle}deg) translateY(-40px)`,
                    animation: `stream-pulse ${1.5 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`
                }} />
            ))}

            <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes spin-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes spin-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
        @keyframes orbit    { from { transform: rotate(var(--start,0deg)) translateX(var(--r,70px)); }
                              to   { transform: rotate(calc(var(--start,0deg) + 360deg)) translateX(var(--r,70px)); } }
        @keyframes core-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(0,243,255,0.6), 0 0 60px rgba(0,112,255,0.3); }
          50%       { box-shadow: 0 0 50px rgba(0,243,255,0.9), 0 0 90px rgba(0,112,255,0.5); }
        }
        @keyframes stream-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
        </div>
    )
}

// ── Main overlay ─────────────────────────────────────────────
export default function ChatbotOverlay() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: 32, right: 32,
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00b4d8, #0070ff)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', cursor: 'pointer', zIndex: 50,
                    boxShadow: '0 0 30px rgba(0,180,216,0.5)',
                }}
            >
                <MessageSquare size={26} />
                <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        border: '2px solid rgba(0,180,216,0.5)'
                    }}
                />
            </motion.button>

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 16,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(16px)',
                        }}
                    >
                        {/* Click outside to close */}
                        <div
                            style={{ position: 'absolute', inset: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                position: 'relative', zIndex: 1,
                                width: '100%', maxWidth: 1100,
                                height: 'min(90vh, 720px)',
                                display: 'flex', borderRadius: 24,
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
                                background: 'rgba(8,8,16,0.95)'
                            }}
                        >
                            {/* Left — Neural Visualization (pure CSS, no WebGL) */}
                            <div style={{
                                width: 340, flexShrink: 0, position: 'relative',
                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                background: 'linear-gradient(160deg, rgba(0,70,120,0.15), transparent)',
                                display: 'none'
                            }}
                                className="lg-vis-panel"
                            >
                                {/* Header */}
                                <div style={{ padding: '20px 20px 0', position: 'relative', zIndex: 5 }}>
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                                        Entity Visualization
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f3ff', boxShadow: '0 0 8px #00f3ff', animation: 'core-pulse 2s infinite' }} />
                                        <span style={{ color: 'white', fontSize: 13, fontFamily: 'monospace', letterSpacing: '0.15em', fontWeight: 700 }}>CONCIERGE CORE</span>
                                    </div>
                                </div>

                                <NeuralCore />

                                {/* Status bar at bottom */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    padding: '12px 20px',
                                    background: 'rgba(0,0,0,0.4)',
                                    borderTop: '1px solid rgba(0,243,255,0.1)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    {['A.I.', 'AGENTS', 'UPTIME'].map((label, i) => (
                                        <div key={label} style={{ textAlign: 'center' }}>
                                            <div style={{ color: '#00f3ff', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}>
                                                {['ACTIVE', '50', '99.9%'][i]}
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                                {label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — Chat */}
                            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <ChatInterface onClose={() => setIsOpen(false)} />
                            </div>
                        </motion.div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute', top: 24, right: 24,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%', width: 40, height: 40,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(255,255,255,0.5)', cursor: 'pointer', zIndex: 2
                            }}
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Show left panel on large screens */}
            <style>{`
        @media (min-width: 1024px) {
          .lg-vis-panel { display: block !important; }
        }
      `}</style>
        </>
    )
}
