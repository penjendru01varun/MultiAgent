import { useState } from 'react'
import { Layout, Activity, Shield, Wifi, Bell, Clock, Cpu, Database, AlertTriangle } from 'lucide-react'
import ThreeScene from './ThreeScene'
import AgentMatrix from './AgentMatrix'
import { motion, AnimatePresence } from 'framer-motion'

const Dashboard = ({ state }) => {
    const [selectedAgent, setSelectedAgent] = useState(null)

    return (
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            {/* Header */}
            <header className="glass-shiny p-4 rounded-xl flex items-center justify-between border-b border-rail-blue/20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rail-blue/10 rounded-lg flex items-center justify-center border border-rail-blue/30 relative overflow-hidden">
                        <Shield className="text-rail-blue relative z-10" />
                        <div className="absolute inset-0 bg-rail-blue/20 animate-pulse-slow"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tighter neon-text">RAILGUARD 5000</h1>
                        <p className="text-[10px] mono text-rail-blue/60 uppercase tracking-widest">Multi-Agent AI Predictive Maintenance</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Train ID</div>
                        <div className="text-sm mono text-rail-blue">TX-7842 (PREMIUM)</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Route</div>
                        <div className="text-sm mono text-rail-blue">OSLO → BERGEN</div>
                    </div>
                    <div className="h-8 w-px bg-rail-blue/20"></div>
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Status</span>
                            <span className="text-rail-green text-xs font-bold flex items-center gap-1">
                                <Wifi size={12} /> ONLINE
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex gap-4 overflow-hidden">
                {/* Left Panel: Alerts & Logs */}
                <aside className="w-80 flex flex-col gap-4 overflow-hidden">
                    <div className="glass p-4 rounded-xl flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-rail-blue uppercase tracking-widest flex items-center gap-2">
                                <Bell size={14} /> Critical Alerts
                            </h3>
                            <span className="bg-rail-red/20 text-rail-red text-[10px] px-2 py-0.5 rounded-full font-bold">3 NEW</span>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {[
                                { type: 'critical', msg: 'Bearing #A34 - Early wear detected', time: '10:23', conf: 94 },
                                { type: 'warning', msg: 'Wheel Flat #B12 - Impact detected', time: '10:22', conf: 82 },
                                { type: 'info', msg: 'Brake pad #D03 - 15% life remaining', time: '10:18', conf: 99 }
                            ].map((alert, i) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className={`p-3 rounded-lg border flex flex-col gap-2 ${alert.type === 'critical' ? 'bg-rail-red/5 border-rail-red/20' :
                                            alert.type === 'warning' ? 'bg-rail-amber/5 border-rail-amber/20' :
                                                'bg-rail-blue/5 border-rail-blue/20'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-bold uppercase ${alert.type === 'critical' ? 'text-rail-red' :
                                                alert.type === 'warning' ? 'text-rail-amber' :
                                                    'text-rail-blue'
                                            }`}>{alert.type}</span>
                                        <span className="text-[10px] text-gray-500 mono">{alert.time}</span>
                                    </div>
                                    <p className="text-xs font-semibold leading-tight">{alert.msg}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${alert.type === 'critical' ? 'bg-rail-red' : 'bg-rail-blue'
                                                }`} style={{ width: `${alert.conf}%` }}></div>
                                        </div>
                                        <span className="text-[9px] mono text-gray-400">{alert.conf}% CONF</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-4 rounded-xl h-48 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-rail-blue uppercase tracking-widest flex items-center gap-2">
                                <Database size={14} /> Data Flow
                            </h3>
                        </div>
                        <div className="flex-1 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-rail-blue/5 rounded-lg border border-rail-blue/10 animate-pulse"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold mono text-rail-blue">48.2 <span className="text-xs uppercase">MB/s</span></div>
                                <div className="text-[9px] uppercase tracking-tighter text-gray-500">Processing Stream</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center Panel: 3D Scene */}
                <section className="flex-1 relative glass rounded-2xl overflow-hidden border border-rail-blue/10">
                    <div className="absolute inset-0 z-0">
                        <ThreeScene bearings={state.health?.bearings || []} />
                    </div>

                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <div className="glass p-3 rounded-lg flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rail-green animate-pulse"></div>
                            <span className="text-[10px] font-bold tracking-widest uppercase">Live Telemetry</span>
                        </div>
                        <div className="glass p-2 rounded-lg flex flex-col gap-1">
                            <div className="text-[8px] text-gray-500 uppercase font-bold">Speed</div>
                            <div className="text-lg mono font-bold text-rail-blue leading-none">124 <span className="text-[10px] font-normal">KM/H</span></div>
                        </div>
                    </div>

                    {/* Controller */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-2xl flex gap-8 border border-rail-blue/30 backdrop-blur-2xl">
                        {['Bogie 1', 'Axle 1', 'Bearings', 'Brakes', 'Chassis'].map((comp, i) => (
                            <button key={i} className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 hover:text-rail-blue transition-colors">
                                {comp}
                            </button>
                        ))}
                    </div>

                    {/* Compass / Orientation */}
                    <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border border-rail-blue/20 flex items-center justify-center glass">
                        <div className="text-[8px] mono text-rail-blue/40 absolute -top-1">FRONT</div>
                        <Shield size={20} className="text-rail-blue/20 rotate-45" />
                    </div>
                </section>

                {/* Right Panel: Agents & Stats */}
                <aside className="w-80 flex flex-col gap-4 overflow-hidden">
                    <AgentMatrix agents={state.agents || []} onSelect={setSelectedAgent} />

                    <div className="glass p-4 rounded-xl flex-1 flex flex-col gap-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-rail-blue uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} /> Diagnostics
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {state.health?.bearings?.slice(0, 4).map((b, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-[10px] mono">
                                        <span className="text-gray-400">{b.bearing_id}</span>
                                        <span className={b.health > 70 ? 'text-rail-green' : 'text-rail-red'}>{b.health}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${b.health}%` }}
                                            className={`h-full ${b.health > 70 ? 'bg-rail-green' : 'bg-rail-red'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-rail-blue/10">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-rail-blue/5 rounded-lg border border-rail-blue/10">
                                    <div className="text-[8px] text-gray-500 uppercase mb-1">Compute Load</div>
                                    <div className="text-sm mono font-bold text-rail-blue">24%</div>
                                </div>
                                <div className="p-2 bg-rail-blue/5 rounded-lg border border-rail-blue/10">
                                    <div className="text-[8px] text-gray-500 uppercase mb-1">Latency</div>
                                    <div className="text-sm mono font-bold text-rail-blue">14ms</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Footer Info */}
            <footer className="h-6 flex items-center justify-between px-2 text-[8px] mono text-gray-600 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>ENC: AES-256-GCM</span>
                    <span>MESH: 50 NODES ACTIVE</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>LAT: 59.9139° N</span>
                    <span>LON: 10.7522° E</span>
                    <span className="text-rail-blue">© 2050 RAILGUARD INDUSTRIES</span>
                </div>
            </footer>
        </div>
    )
}

export default Dashboard
