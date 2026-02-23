import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

const AgentMatrix = ({ agents, onSelect }) => {
    // Create a 10x5 grid for 50 agents
    const totalAgents = 50
    const agentMap = {}
    agents.forEach(a => {
        const idNum = parseInt(a.id.substring(1))
        agentMap[idNum] = a
    })

    return (
        <div className="glass p-4 rounded-xl flex flex-col overflow-hidden max-h-[400px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-rail-blue uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={14} /> Agent Intelligence Matrix
                </h3>
                <span className="text-[10px] mono text-rail-blue/40">{agents.length} / 50 ACTIVE</span>
            </div>

            <div className="grid grid-cols-10 gap-2 flex-1 overflow-y-auto pr-1 select-none">
                {Array.from({ length: totalAgents }).map((_, i) => {
                    const agentIdNum = i + 1
                    const agent = agentMap[agentIdNum]
                    const isActive = !!agent

                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.1, zIndex: 10 }}
                            onClick={() => agent && onSelect(agent)}
                            className={`aspect-square rounded-[4px] relative cursor-pointer flex items-center justify-center border transition-all duration-300 ${isActive
                                    ? 'bg-rail-blue/20 border-rail-blue/40 shadow-[0_0_8px_rgba(0,243,255,0.2)]'
                                    : 'bg-gray-900/50 border-white/5 opacity-50'
                                }`}
                        >
                            {/* Agent ID tooltip on top-left of specific cell */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-[8px] mono font-bold ${isActive ? 'text-rail-blue' : 'text-gray-700'}`}>
                                    {agentIdNum}
                                </span>
                            </div>

                            {isActive && (
                                <div className="absolute inset-0 bg-rail-blue/10 animate-pulse rounded-[4px]"></div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rail-blue shadow-[0_0_5px_rgba(0,243,255,0.5)]"></div>
                    <span className="text-[8px] uppercase font-bold text-gray-500">Processing</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rail-red animate-ping"></div>
                    <span className="text-[8px] uppercase font-bold text-gray-500">Alert Priority</span>
                </div>
            </div>
        </div>
    )
}

export default AgentMatrix
