import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Agent name and category mapping
const AGENT_INFO = {
  // Category 1: Sensory Perception (A1-A10)
  A1: { name: "Visual Acquisition", category: "sensory", color: "#00f3ff" },
  A2: { name: "Thermal Imaging", category: "sensory", color: "#ff4444" },
  A3: { name: "Acoustic Emission", category: "sensory", color: "#aa6dc9" },
  A4: { name: "Vibration Spectrum", category: "sensory", color: "#ff9f43" },
  A5: { name: "Load Distribution", category: "sensory", color: "#54a0ff" },
  A6: { name: "Environmental", category: "sensory", color: "#00d2d3" },
  A7: { name: "GPS/Speed Sync", category: "sensory", color: "#5f27cd" },
  A8: { name: "Power Management", category: "sensory", color: "#ee5253" },
  A9: { name: "Data Integrity", category: "sensory", color: "#10ac84" },
  A10: { name: "Multi-Spectral Fusion", category: "sensory", color: "#f368e0" },
  // Category 2: Data Processing (A11-A18)
  A11: { name: "Motion Deblurring", category: "processing", color: "#00d2d3" },
  A12: { name: "Low-Light Enhancement", category: "processing", color: "#ff9f43" },
  A13: { name: "Compressed Sensing", category: "processing", color: "#54a0ff" },
  A14: { name: "Noise Reduction", category: "processing", color: "#5f27cd" },
  A15: { name: "Super-Resolution", category: "processing", color: "#ff6b6b" },
  A16: { name: "Temporal Interpolation", category: "processing", color: "#a55eea" },
  A17: { name: "Data Compression", category: "processing", color: "#2ed573" },
  A18: { name: "Anomaly Highlighting", category: "processing", color: "#ff4757" },
  // Category 3: Inspection (A19-A30)
  A19: { name: "Bearing Wear", category: "inspection", color: "#ff6b6b" },
  A20: { name: "Wheel Flat", category: "inspection", color: "#ffa502" },
  A21: { name: "Axle Crack", category: "inspection", color: "#ff4757" },
  A22: { name: "Brake Pad", category: "inspection", color: "#5352ed" },
  A23: { name: "Suspension", category: "inspection", color: "#2ed573" },
  A24: { name: "Coupler", category: "inspection", color: "#1e90ff" },
  A25: { name: "Rail-Wheel Contact", category: "inspection", color: "#ff7f50" },
  A26: { name: "Lubrication", category: "inspection", color: "#7bed9f" },
  A27: { name: "Fastener", category: "inspection", color: "#eccc68" },
  A28: { name: "Corrosion", category: "inspection", color: "#a55eea" },
  A29: { name: "Fatigue Life", category: "inspection", color: "#ff6348" },
  A30: { name: "Geometric Distortion", category: "inspection", color: "#70a1ff" },
  // Category 4: Prediction (A31-A38)
  A31: { name: "Temporal Predictor", category: "prediction", color: "#7bed9f" },
  A32: { name: "Ensemble Voting", category: "prediction", color: "#a29bfe" },
  A33: { name: "Uncertainty", category: "prediction", color: "#ffeaa7" },
  A34: { name: "Rare Event", category: "prediction", color: "#fd79a8" },
  A35: { name: "Digital Twin", category: "prediction", color: "#00cec9" },
  A36: { name: "What-If Simulator", category: "prediction", color: "#fab1a0" },
  A37: { name: "Historical Matcher", category: "prediction", color: "#fdcb6e" },
  A38: { name: "Transfer Learning", category: "prediction", color: "#81ecec" },
  // Category 5: Decision (A39-A44)
  A39: { name: "Criticality Assessor", category: "decision", color: "#ff4757" },
  A40: { name: "Urgency Scheduler", category: "decision", color: "#ffa502" },
  A41: { name: "Maintenance Recommender", category: "decision", color: "#2ed573" },
  A42: { name: "Alert Prioritizer", category: "decision", color: "#ff6b81" },
  A43: { name: "HMI Agent", category: "decision", color: "#70a1ff" },
  A44: { name: "Voice Synthesizer", category: "decision", color: "#dfe6e9" },
  // Category 6: Communication (A45-A50)
  A45: { name: "Mesh Coordinator", category: "communication", color: "#00d2d3" },
  A46: { name: "Store-and-Forward", category: "communication", color: "#a29bfe" },
  A47: { name: "Bandwidth Allocator", category: "communication", color: "#ffeaa7" },
  A48: { name: "Data Synchronizer", category: "communication", color: "#fd79a8" },
  A49: { name: "Edge-Cloud Orchestrator", category: "communication", color: "#00cec9" },
  A50: { name: "Self-Healing", category: "communication", color: "#2ed573" }
}

// Animation variants for each agent type
const getAnimationVariant = (agentId) => {
  const num = parseInt(agentId.replace('A', ''))
  
  // Category 1: Sensory - "Observing" theme - breathing/pulsing
  if (num >= 1 && num <= 10) {
    return {
      animate: {
        scale: [1, 1.05, 1],
        boxShadow: [
          `0 0 5px ${AGENT_INFO[agentId].color}40`,
          `0 0 15px ${AGENT_INFO[agentId].color}80`,
          `0 0 5px ${AGENT_INFO[agentId].color}40`
        ]
      },
      transition: { duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut" }
    }
  }
  
  // Category 2: Processing - "Transforming" theme - rotating/morphing
  if (num >= 11 && num <= 18) {
    return {
      animate: {
        rotate: [0, 180, 360],
        scale: [1, 1.1, 1]
      },
      transition: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "linear" }
    }
  }
  
  // Category 3: Inspection - "Examining" theme - scanning
  if (num >= 19 && num <= 30) {
    return {
      animate: {
        y: [0, -3, 0],
        opacity: [0.8, 1, 0.8]
      },
      transition: { duration: 1.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }
    }
  }
  
  // Category 4: Prediction - "Foreseeing" theme - glowing/crystalizing
  if (num >= 31 && num <= 38) {
    return {
      animate: {
        filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
        scale: [1, 1.02, 1]
      },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  }
  
  // Category 5: Decision - "Acting" theme - urgent pulsing
  if (num >= 39 && num <= 44) {
    return {
      animate: {
        scale: [1, 1.08, 1],
        borderColor: [AGENT_INFO[agentId].color, '#ffffff', AGENT_INFO[agentId].color]
      },
      transition: { duration: 1 + Math.random(), repeat: Infinity, ease: "easeInOut" }
    }
  }
  
  // Category 6: Communication - "Connecting" theme - networking
  if (num >= 45 && num <= 50) {
    return {
      animate: {
        scale: [1, 1.03, 1],
        rotate: [0, 5, -5, 0]
      },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  }
  
  return { animate: {} }
}

// Individual agent orb with unique animation
const AgentOrb = ({ agentId, status = "active", onClick }) => {
  const info = AGENT_INFO[agentId] || { name: agentId, color: "#00f3ff" }
  const variant = getAnimationVariant(agentId)
  const [pulseSpeed] = useState(1 + Math.random() * 2)
  
  const getStatusColor = () => {
    switch(status) {
      case 'critical': return '#ff4757'
      case 'warning': return '#ffa502'
      case 'idle': return '#636e72'
      default: return info.color
    }
  }

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.15, zIndex: 20 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...variant}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{ duration: pulseSpeed, repeat: Infinity }}
        style={{ background: `radial-gradient(circle, ${getStatusColor()}40 0%, transparent 70%)` }}
      />
      
      {/* Main orb */}
      <div
        className="w-10 h-10 rounded-full relative flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${getStatusColor()}cc, ${getStatusColor()}66)`,
          border: `1.5px solid ${getStatusColor()}`,
          boxShadow: `0 0 10px ${getStatusColor()}66, inset 0 0 10px ${getStatusColor()}40`
        }}
      >
        {/* Inner core */}
        <div
          className="w-4 h-4 rounded-full"
          style={{
            background: `radial-gradient(circle, #ffffff80, transparent)`,
          }}
        />
        
        {/* Category-specific animation overlay */}
        {info.category === 'sensory' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: getStatusColor() }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {info.category === 'processing' && (
          <motion.div
            className="absolute inset-1 rounded-full"
            style={{ border: `2px dashed ${getStatusColor()}80` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {info.category === 'prediction' && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-full h-full rounded-full"
                style={{ border: `1px solid ${getStatusColor()}40` }}
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              />
            ))}
          </>
        )}
        
        {info.category === 'decision' && (
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: getStatusColor() }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
        
        {info.category === 'communication' && (
          <>
            {[0, 90, 180, 270].map((deg) => (
              <motion.div
                key={deg}
                className="absolute w-1 h-1 rounded-full"
                style={{ 
                  background: getStatusColor(),
                  top: '50%',
                  left: '50%',
                  marginTop: '-2px',
                  marginLeft: '-2px',
                  transform: `rotate(${deg}deg) translateY(-8px)`
                }}
                animate={{ scale: [0.5, 1, 0.5] }}
                transition={{ duration: 1, delay: deg / 360, repeat: Infinity }}
              />
            ))}
          </>
        )}
      </div>
      
      {/* Agent ID label */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold whitespace-nowrap" style={{ color: getStatusColor() }}>
        {agentId}
      </div>
    </motion.div>
  )
}

// Connection lines between agents
const ConnectionLines = ({ agents }) => {
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {agents.slice(0, 10).map((a, i) => {
        const next = agents[i + 1]
        if (!next) return null
        return (
          <motion.line
            key={i}
            x1={(i % 10) * 11 + 5 + 15 + "%"}
            y1={Math.floor(i / 10) * 25 + 12 + "%"}
            x2={(i + 1) % 10 * 11 + 5 + 15 + "%"}
            y2={Math.floor((i + 1) / 10) * 25 + 12 + "%"}
            stroke={AGENT_INFO[a]?.color || "#00f3ff"}
            strokeWidth="0.5"
            strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        )
      })}
    </svg>
  )
}

// Main AgentMatrix component
const AgentMatrix = ({ agents = [], onSelect }) => {
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [agentStates, setAgentStates] = useState({})
  
  // Simulate agent states for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const states = {}
      for (let i = 1; i <= 50; i++) {
        const rand = Math.random()
        states[`A${i}`] = rand > 0.9 ? 'critical' : rand > 0.7 ? 'warning' : 'active'
      }
      setAgentStates(states)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Group agents by category
  const categories = [
    { name: 'SENSORY PERCEPTION', ids: Array.from({length: 10}, (_, i) => `A${i+1}`), color: '#00f3ff' },
    { name: 'DATA PROCESSING', ids: Array.from({length: 8}, (_, i) => `A${i+11}`), color: '#a55eea' },
    { name: 'COMPONENT INSPECTION', ids: Array.from({length: 12}, (_, i) => `A${i+19}`), color: '#ff9f43' },
    { name: 'PREDICTIVE MODELING', ids: Array.from({length: 8}, (_, i) => `A${i+31}`), color: '#7bed9f' },
    { name: 'DECISION & ALERTING', ids: Array.from({length: 6}, (_, i) => `A${i+39}`), color: '#ff4757' },
    { name: 'COMMUNICATION', ids: Array.from({length: 6}, (_, i) => `A${i+45}`), color: '#00cec9' }
  ]
  
  return (
    <div className="glass p-4 rounded-xl flex flex-col overflow-hidden" style={{ minHeight: '500px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-rail-blue uppercase tracking-widest flex items-center gap-2">
          <span style={{ color: '#00f3ff' }}>◆</span> Agent Intelligence Matrix
        </h3>
        <span className="text-[10px] mono text-rail-blue/60">50 NODES ACTIVE</span>
      </div>
      
      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <div key={cat.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
            <span className="text-[8px] text-gray-500">{cat.name.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
      
      {/* Agent Grid */}
      <div className="flex-1 grid grid-cols-10 gap-2 relative">
        <ConnectionLines agents={Array.from({length: 50}, (_, i) => `A${i+1}`)} />
        
        {Array.from({length: 50}).map((_, i) => {
          const agentId = `A${i + 1}`
          return (
            <div key={agentId} className="flex justify-center pt-2">
              <AgentOrb 
                agentId={agentId} 
                status={agentStates[agentId]}
                onClick={() => {
                  setSelectedAgent(agentId)
                  onSelect?.({ id: agentId, ...AGENT_INFO[agentId] })
                }}
              />
            </div>
          )
        })}
      </div>
      
      {/* Selected Agent Detail */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-3 rounded-lg border border-rail-blue/30 bg-rail-blue/5"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold" style={{ color: AGENT_INFO[selectedAgent]?.color }}>
                  {AGENT_INFO[selectedAgent]?.name}
                </h4>
                <p className="text-[10px] text-gray-400">{selectedAgent} • {AGENT_INFO[selectedAgent]?.category}</p>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-gray-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            
            {/* Status indicators */}
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-gray-400">ACTIVE</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rail-blue" />
                <span className="text-[9px] text-gray-400">PROCESSING</span>
              </div>
            </div>
            
            {/* Animated activity bar */}
            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: AGENT_INFO[selectedAgent]?.color }}
                animate={{ width: ['20%', '80%', '45%', '90%', '30%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* System Health Summary */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="text-center p-2 bg-rail-blue/5 rounded">
          <div className="text-lg font-bold text-rail-green">50</div>
          <div className="text-[8px] text-gray-500">TOTAL</div>
        </div>
        <div className="text-center p-2 bg-rail-blue/5 rounded">
          <div className="text-lg font-bold text-rail-blue">{Object.values(agentStates).filter(s => s === 'active').length || 50}</div>
          <div className="text-[8px] text-gray-500">ACTIVE</div>
        </div>
        <div className="text-center p-2 bg-rail-blue/5 rounded">
          <div className="text-lg font-bold text-rail-amber">{Object.values(agentStates).filter(s => s === 'warning').length || 0}</div>
          <div className="text-[8px] text-gray-500">WARNING</div>
        </div>
        <div className="text-center p-2 bg-rail-blue/5 rounded">
          <div className="text-lg font-bold text-rail-red">{Object.values(agentStates).filter(s => s === 'critical').length || 0}</div>
          <div className="text-[8px] text-gray-500">CRITICAL</div>
        </div>
      </div>
    </div>
  )
}

export default AgentMatrix
