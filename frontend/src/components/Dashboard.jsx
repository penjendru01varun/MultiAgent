import { useState, Component, lazy, Suspense } from 'react'
import { Shield, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

const ThreeSceneLazy = lazy(() =>
    import('./ThreeScene').catch(() => ({ default: () => <AmbientGrid /> }))
)

// ── Local error boundary for the 3D scene ────────────────────
class SceneBoundary extends Component {
    state = { failed: false }
    static getDerivedStateFromError() { return { failed: true } }
    render() {
        if (this.state.failed) {
            return (
                <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,20,40,0.8)', color: 'rgba(0,243,255,0.5)',
                    fontFamily: 'monospace', fontSize: 12,
                    gap: 8
                }}>
                    <Shield size={32} style={{ opacity: 0.3 }} />
                    <span style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>3D Render Offline</span>
                    <span style={{ opacity: 0.5, fontSize: 10 }}>Telemetry feed active</span>
                </div>
            )
        }
        return this.props.children
    }
}



// Inline 3D placeholder (CSS only) used when WebGL fails
function AmbientGrid() {
    return (
        <div style={{
            width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 40%, rgba(0,70,120,0.3) 0%, transparent 70%)',
        }}>
            {/* Grid lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00f3ff" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Agent orbs */}
            {Array.from({ length: 12 }, (_, i) => {
                const x = 10 + ((i * 73) % 80)
                const y = 15 + ((i * 57) % 70)
                const size = 6 + (i % 3) * 4
                const colors = ['#00f3ff', '#ff4444', '#ffa502', '#7bed9f', '#a55eea', '#ff6b6b']
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${x}%`, top: `${y}%`,
                        width: size, height: size,
                        borderRadius: '50%',
                        background: colors[i % colors.length],
                        boxShadow: `0 0 ${size * 2}px ${colors[i % colors.length]}`,
                        animation: `agent-pulse ${2 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
                        transform: 'translate(-50%, -50%)',
                    }} />
                )
            })}

            {/* Wagon silhouette */}
            <div style={{
                position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)',
                width: 280, height: 60,
                background: 'linear-gradient(to right, transparent, rgba(0,100,180,0.2), rgba(0,180,255,0.15), rgba(0,100,180,0.2), transparent)',
                border: '1px solid rgba(0,180,255,0.2)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{ color: 'rgba(0,243,255,0.4)', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.3em' }}>
                    WAGON TX-7842
                </span>
            </div>

            {/* Data lines */}
            {[20, 40, 60, 80].map(x => (
                <div key={x} style={{
                    position: 'absolute',
                    left: `${x}%`, top: 0, bottom: 0,
                    width: 1,
                    background: 'linear-gradient(to bottom, transparent, rgba(0,243,255,0.08), transparent)',
                    animation: `data-flow 3s ease-in-out ${x * 0.05}s infinite`,
                }} />
            ))}

            <style>{`
        @keyframes agent-pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.3); }
        }
        @keyframes data-flow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
        </div>
    )
}

// ── Agent status mini-grid ────────────────────────────────────
function AgentStatusGrid({ agents }) {
    const safeAgents = Array.isArray(agents) ? agents : []
    const running = safeAgents.filter(a => a?.status === 'running').length
    const categories = [
        { label: 'Sensory', range: [1, 10], color: '#00f3ff' },
        { label: 'Processing', range: [11, 18], color: '#a55eea' },
        { label: 'Inspection', range: [19, 30], color: '#ff9f43' },
        { label: 'Prediction', range: [31, 38], color: '#ff6b6b' },
        { label: 'Decision', range: [39, 44], color: '#2ed573' },
        { label: 'Comms', range: [45, 50], color: '#54a0ff' },
    ]

    return (
        <div style={{ padding: 12, background: 'rgba(0,20,40,0.6)', borderRadius: 12, border: '1px solid rgba(0,243,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ color: 'rgba(0,243,255,0.8)', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Agent Matrix
                </span>
                <span style={{ color: '#2ed573', fontSize: 10, fontFamily: 'monospace' }}>
                    {running}/{safeAgents.length || 50} LIVE
                </span>
            </div>

            {/* Mini dot grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 3, marginBottom: 10 }}>
                {Array.from({ length: 50 }, (_, i) => {
                    const num = i + 1
                    const agent = safeAgents.find(a => a?.id === `A${num}`)
                    const cat = categories.find(c => num >= c.range[0] && num <= c.range[1])
                    const active = agent?.status === 'running'
                    return (
                        <div key={num} title={`A${num}`} style={{
                            aspectRatio: '1', borderRadius: 2,
                            background: active ? (cat?.color || '#00f3ff') : 'rgba(255,255,255,0.05)',
                            boxShadow: active ? `0 0 6px ${cat?.color || '#00f3ff'}` : 'none',
                            opacity: active ? 1 : 0.4,
                            transition: 'all 0.5s',
                        }} />
                    )
                })}
            </div>

            {/* Category legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {categories.map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, boxShadow: `0 0 4px ${c.color}` }} />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                            {c.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Health bars from new backend format ───────────────────────
function HealthPanel({ health }) {
    // health = { A19: {health_pct, bearing_id, ...}, A20: {...}, ... }
    const safeHealth = health && typeof health === 'object' ? health : {}

    // Pick bearing agent data
    const bearingEntry = safeHealth['A19'] || {}
    const wheelEntry = safeHealth['A20'] || {}
    const brakeEntry = safeHealth['A22'] || {}
    const suspEntry = safeHealth['A23'] || {}

    const items = [
        { label: 'Bearing BRG-A34', value: bearingEntry.health_pct ?? 78, unit: '%', warn: 70 },
        { label: 'Wheel Condition', value: wheelEntry.flat_detected ? 55 : 92, unit: '%', warn: 70 },
        { label: 'Brake Pad', value: brakeEntry.thickness_mm ? Math.min(100, (brakeEntry.thickness_mm / 30) * 100) : 65, unit: '%', warn: 40 },
        { label: 'Suspension', value: suspEntry.damper_efficiency_pct ?? 88, unit: '%', warn: 70 },
    ]

    return (
        <div>
            <div style={{ color: 'rgba(0,243,255,0.7)', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
                Component Health
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => {
                    const val = typeof item.value === 'number' && !isNaN(item.value) ? Math.round(item.value) : 0
                    const good = val > item.warn
                    return (
                        <div key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}>{item.label}</span>
                                <span style={{ color: good ? '#2ed573' : '#ff4757', fontSize: 10, fontFamily: 'monospace' }}>{val}{item.unit}</span>
                            </div>
                            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                                <motion.div
                                    animate={{ width: `${val}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    style={{
                                        height: '100%', borderRadius: 4,
                                        background: good
                                            ? 'linear-gradient(to right, #00f3ff, #2ed573)'
                                            : 'linear-gradient(to right, #ff4757, #ff9f43)',
                                        boxShadow: good ? '0 0 8px rgba(0,243,255,0.4)' : '0 0 8px rgba(255,71,87,0.4)',
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard({ state }) {
    // Safely extract data with fallbacks
    const agents = Array.isArray(state?.agents) ? state.agents : []
    const health = (state?.health && typeof state.health === 'object') ? state.health : {}
    const bb = (state?.blackboard && typeof state.blackboard === 'object') ? state.blackboard : {}

    const runningCount = agents.filter(a => a?.status === 'running').length

    const ALERTS = [
        { type: 'critical', msg: 'Bearing #A34 — Early wear detected', time: '10:23', conf: 94 },
        { type: 'warning', msg: 'Wheel Flat #B12 — Impact detected', time: '10:22', conf: 82 },
        { type: 'info', msg: 'Brake pad #D03 — 15% life remaining', time: '10:18', conf: 99 },
    ]

    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            padding: 12, gap: 12, overflow: 'hidden',
            background: '#050510',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            color: 'rgba(255,255,255,0.85)',
        }}>
            {/* ── Header ── */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 20px',
                background: 'rgba(0,20,50,0.6)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,243,255,0.15)', borderRadius: 14,
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,112,255,0.2))',
                        border: '1px solid rgba(0,243,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Shield size={20} style={{ color: '#00f3ff' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#00f3ff', textShadow: '0 0 20px rgba(0,243,255,0.5)', margin: 0 }}>
                            RAILGUARD 5000
                        </h1>
                        <p style={{ fontSize: 9, color: 'rgba(0,243,255,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'monospace', margin: 0 }}>
                            Multi-Agent AI Predictive Maintenance
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    {[
                        { label: 'Train ID', value: 'TX-7842 (PREMIUM)' },
                        { label: 'Route', value: 'OSLO → BERGEN' },
                        { label: 'Agents', value: `${runningCount}/50 LIVE` },
                    ].map(item => (
                        <div key={item.label} style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}>{item.label}</div>
                            <div style={{ fontSize: 12, color: '#00f3ff', fontFamily: 'monospace', fontWeight: 700 }}>{item.value}</div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ed573', boxShadow: '0 0 8px #2ed573', animation: 'core-pulse 2s infinite' }} />
                        <span style={{ fontSize: 11, color: '#2ed573', fontFamily: 'monospace', fontWeight: 700 }}>ONLINE</span>
                    </div>
                </div>
            </header>

            {/* ── Main content ── */}
            <main style={{ flex: 1, display: 'flex', gap: 12, overflow: 'hidden', minHeight: 0 }}>

                {/* Left: Alerts */}
                <aside style={{ width: 288, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                    <div style={{
                        flex: 1, overflow: 'hidden',
                        background: 'rgba(0,20,40,0.6)', backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(0,243,255,0.1)', borderRadius: 14, padding: 14,
                        display: 'flex', flexDirection: 'column',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00f3ff', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                <Bell size={12} /> Critical Alerts
                            </span>
                            <span style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff4757', fontSize: 9, padding: '2px 8px', borderRadius: 100, fontFamily: 'monospace' }}>
                                3 NEW
                            </span>
                        </div>
                        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {ALERTS.map((alert, i) => {
                                const color = alert.type === 'critical' ? '#ff4757' : alert.type === 'warning' ? '#ffa502' : '#00f3ff'
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -16, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            padding: 10, borderRadius: 10,
                                            background: `rgba(${alert.type === 'critical' ? '255,71,87' : alert.type === 'warning' ? '255,165,2' : '0,243,255'},0.05)`,
                                            border: `1px solid rgba(${alert.type === 'critical' ? '255,71,87' : alert.type === 'warning' ? '255,165,2' : '0,243,255'},0.2)`,
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ color, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>{alert.type}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }}>{alert.time}</span>
                                        </div>
                                        <p style={{ fontSize: 11.5, fontWeight: 600, margin: '0 0 6px', lineHeight: 1.4 }}>{alert.msg}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${alert.conf}%`, background: color, borderRadius: 3 }} />
                                            </div>
                                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }}>{alert.conf}%</span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Data flow */}
                    <div style={{
                        height: 90, background: 'rgba(0,20,40,0.6)',
                        border: '1px solid rgba(0,243,255,0.1)', borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, flexShrink: 0,
                    }}>
                        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'monospace', color: '#00f3ff' }}>
                            48.2 <span style={{ fontSize: 11, opacity: 0.6 }}>MB/s</span>
                        </div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'monospace' }}>Processing Stream</div>
                    </div>
                </aside>

                {/* Center: 3D scene (wrapped in error boundary) */}
                <section style={{
                    flex: 1, position: 'relative', overflow: 'hidden',
                    background: 'rgba(0,10,30,0.8)',
                    border: '1px solid rgba(0,100,200,0.15)', borderRadius: 18,
                }}>
                    <SceneBoundary>
                        <Suspense fallback={<AmbientGrid />}>
                            <ThreeSceneLazy health={health} />
                        </Suspense>
                    </SceneBoundary>

                    {/* Overlay HUD */}
                    <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 5, pointerEvents: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,243,255,0.15)' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ed573', animation: 'core-pulse 2s infinite' }} />
                            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Live Telemetry</span>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,243,255,0.1)' }}>
                            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Speed</div>
                            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: '#00f3ff', lineHeight: 1 }}>
                                124 <span style={{ fontSize: 9, opacity: 0.6 }}>KM/H</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom nav */}
                    <div style={{
                        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', gap: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)',
                        padding: '8px 24px', borderRadius: 100, border: '1px solid rgba(0,243,255,0.15)',
                        zIndex: 5,
                    }}>
                        {['Bogie 1', 'Axle 1', 'Bearings', 'Brakes', 'Chassis'].map(c => (
                            <button key={c} style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace' }}>
                                {c}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Right: Agent grid + health */}
                <aside style={{ width: 288, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, overflow: 'hidden' }}>
                    <AgentStatusGrid agents={agents} />

                    <div style={{
                        flex: 1, overflow: 'auto',
                        background: 'rgba(0,20,40,0.6)', backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(0,243,255,0.1)', borderRadius: 14, padding: 14,
                    }}>
                        <HealthPanel health={health} />

                        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(0,243,255,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { label: 'Compute', value: '24%' },
                                { label: 'Latency', value: '14ms' },
                                { label: 'Uptime', value: '99.9%' },
                                { label: 'Alerts', value: '3 NEW' },
                            ].map(s => (
                                <div key={s.label} style={{ padding: 8, background: 'rgba(0,243,255,0.04)', border: '1px solid rgba(0,243,255,0.08)', borderRadius: 8 }}>
                                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 2 }}>{s.label}</div>
                                    <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace', color: '#00f3ff' }}>{s.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>

            {/* Footer */}
            <footer style={{
                flexShrink: 0, height: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingInline: 8, fontSize: 8, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    <span>ENC: AES-256-GCM</span>
                    <span>MESH: 50 NODES ACTIVE</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <span>LAT: 59.9139° N</span>
                    <span>LON: 10.7522° E</span>
                    <span style={{ color: 'rgba(0,243,255,0.4)' }}>© 2050 RAILGUARD INDUSTRIES</span>
                </div>
            </footer>

            <style>{`
        @keyframes core-pulse {
          0%, 100% { opacity: 0.8; } 50% { opacity: 1; }
        }
      `}</style>
        </div>
    )
}

