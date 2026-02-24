import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Cpu, X, RotateCcw, ShieldCheck } from 'lucide-react'

// ── Markdown-lite renderer ───────────────────────────────────
function renderText(text) {
    return text
        .split('\n')
        .map((line, i) => {
            // Bold: **text**
            const parts = line.split(/(\*\*[^*]+\*\*)/)
            return (
                <span key={i}>
                    {parts.map((p, j) =>
                        p.startsWith('**') && p.endsWith('**')
                            ? <strong key={j} style={{ color: '#e2e8f0' }}>{p.slice(2, -2)}</strong>
                            : <span key={j}>{p}</span>
                    )}
                    {i < text.split('\n').length - 1 && <br />}
                </span>
            )
        })
}

// ── Message bubble ───────────────────────────────────────────
function Bubble({ msg }) {
    const isUser = msg.sender === 'user'
    const isSystem = msg.sender === 'system'

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 16,
            }}
        >
            {/* Avatar */}
            <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isUser
                    ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                    : 'linear-gradient(135deg,#00b4d8,#0070ff)',
                boxShadow: isUser
                    ? '0 0 12px rgba(124,58,237,0.4)'
                    : '0 0 12px rgba(0,180,216,0.4)',
            }}>
                {isUser ? <User size={15} color="white" /> : <Bot size={15} color="white" />}
            </div>

            {/* Bubble */}
            <div style={{
                maxWidth: '78%',
                background: isUser
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15))'
                    : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isUser ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'}`,
                backdropFilter: 'blur(10px)',
                borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                padding: '10px 14px',
                color: 'rgba(255,255,255,0.88)',
                fontSize: 13.5,
                lineHeight: 1.65,
                fontFamily: "'Space Grotesk', sans-serif",
            }}>
                {renderText(msg.text)}

                {/* Agent tags */}
                {isSystem && msg.agents && msg.agents.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {msg.agents.slice(0, 5).map(a => (
                            <span key={a.id} style={{
                                fontSize: 10, padding: '2px 8px', borderRadius: 100,
                                background: 'rgba(0,243,255,0.08)',
                                border: '1px solid rgba(0,243,255,0.2)',
                                color: '#00f3ff', fontFamily: 'monospace'
                            }}>
                                {a.id}
                            </span>
                        ))}
                    </div>
                )}

                {/* Confidence */}
                {typeof msg.confidence === 'number' && (
                    <div style={{ marginTop: 6, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                        confidence {Math.round(msg.confidence * 100)}%
                    </div>
                )}

                <div style={{ marginTop: 4, fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </motion.div>
    )
}

// ── Typing indicator ─────────────────────────────────────────
function ThinkingBubble({ agents }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
        >
            <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg,#00b4d8,#0070ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Cpu size={15} color="white" style={{ animation: 'spin 2s linear infinite' }} />
            </div>
            <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px 18px 18px 18px',
                padding: '10px 14px',
            }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 0.2, 0.4].map(delay => (
                        <motion.div
                            key={delay}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.7, delay, repeat: Infinity }}
                            style={{ width: 7, height: 7, borderRadius: '50%', background: '#00f3ff' }}
                        />
                    ))}
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 6, fontFamily: 'monospace' }}>
                        {agents.length > 0 ? `${agents.slice(0, 3).join(', ')} processing…` : 'Processing…'}
                    </span>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
    )
}

// ── Suggested queries ─────────────────────────────────────────
const SUGGESTED = [
    "What's the bearing health status?",
    "Show crack growth prediction",
    "Explain how you prevent hallucinations",
    "How should I allocate a $500k budget?",
    "Derailment investigation findings",
]

// ── Main ChatInterface ────────────────────────────────────────
export default function ChatInterface({ onClose }) {
    const WELCOME_MSG = {
        id: 1, sender: 'system', timestamp: Date.now(),
        text: "Welcome, Engineer. I am the RAILGUARD CONCIERGE — v8.0 Decision Engine active. I orchestrate 50 specialized AI agents. \n\nWhat scenario would you like to analyze?",
    }
    const [messages, setMessages] = useState([WELCOME_MSG])
    const [input, setInput] = useState('')
    const [wsReady, setWsReady] = useState(false)
    const [thinking, setThinking] = useState(false)
    const [activeAgents, setActive] = useState([])

    const wsRef = useRef(null)
    const reconnectRef = useRef(null)
    const scrollRef = useRef(null)
    const mountedRef = useRef(true)

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, thinking])

    const clearChat = () => {
        setMessages([WELCOME_MSG])
        setActive([])
        setThinking(false)
    }

    // WebSocket with auto-reconnect
    const connect = useCallback(() => {
        if (!mountedRef.current) return
        if (wsRef.current?.readyState === WebSocket.OPEN) return

        const ws = new WebSocket('ws://localhost:8000/ws/chat')
        wsRef.current = ws

        ws.onopen = () => {
            if (!mountedRef.current) { ws.close(); return }
            setWsReady(true)
            clearTimeout(reconnectRef.current)
        }

        ws.onmessage = (e) => {
            if (!mountedRef.current) return
            try {
                const data = JSON.parse(e.data)
                if (data.type === 'thinking') {
                    setThinking(true)
                    setActive(data.active_agents || [])
                } else if (data.type === 'response') {
                    setThinking(false)
                    setMessages(prev => [...prev, {
                        id: Date.now(), sender: 'system', timestamp: Date.now(),
                        text: data.response,
                        agents: data.active_agents,
                        confidence: data.confidence,
                    }])
                }
            } catch (_) { }
        }

        ws.onclose = () => {
            if (!mountedRef.current) return
            setWsReady(false)
            reconnectRef.current = setTimeout(connect, 3000)
        }

        ws.onerror = () => ws.close()
    }, [])

    useEffect(() => {
        mountedRef.current = true
        connect()
        return () => {
            mountedRef.current = false
            clearTimeout(reconnectRef.current)
            wsRef.current?.close()
        }
    }, [connect])

    const send = () => {
        const text = input.trim()
        if (!text) return
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', timestamp: Date.now(), text }])
        setInput('')
        setThinking(true)
        wsRef.current.send(JSON.stringify({ query: text }))
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            background: 'transparent', overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.02)',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#00b4d8,#0070ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 16px rgba(0,180,216,0.6)'
                    }}>
                        <Bot size={22} color="white" />
                    </div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 15, letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                            RAILGUARD CONCIERGE
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <div style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: wsReady ? '#22c55e' : '#f59e0b',
                                boxShadow: wsReady ? '0 0 6px #22c55e' : '0 0 6px #f59e0b',
                                animation: 'core-pulse 2s infinite'
                            }} />
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                                {wsReady ? '50 Agents Online' : 'Connecting…'}
                                {wsReady && <ShieldCheck size={10} color="#22c55e" />}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearChat}
                        style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12, padding: '0 12px', height: 36,
                            display: 'flex', alignItems: 'center', gap: 6,
                            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                            fontSize: 12, fontWeight: 500, fontFamily: 'monospace'
                        }}
                        title="Clear Conversation & Reset Context"
                    >
                        <RotateCcw size={14} />
                        RESET
                    </motion.button>
                    {onClose && (
                        <button onClick={onClose} style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%', width: 36, height: 36,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'rgba(255,255,255,0.5)', cursor: 'pointer'
                        }}>
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}

            {/* Messages */}
            <div
                ref={scrollRef}
                style={{
                    flex: 1, overflowY: 'auto', padding: '20px 16px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0,243,255,0.2) transparent',
                }}
            >
                <AnimatePresence>
                    {messages.map(m => <Bubble key={m.id} msg={m} />)}
                    {thinking && <ThinkingBubble key="thinking" agents={activeAgents} />}
                </AnimatePresence>
            </div>

            {/* Suggested queries */}
            <div style={{
                padding: '8px 16px',
                display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0,
                scrollbarWidth: 'none',
            }}>
                {SUGGESTED.map(q => (
                    <button key={q} onClick={() => setInput(q)} style={{
                        whiteSpace: 'nowrap', fontSize: 11, padding: '5px 12px',
                        borderRadius: 100,
                        background: 'rgba(0,243,255,0.05)',
                        border: '1px solid rgba(0,243,255,0.15)',
                        color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
                        fontFamily: "'Space Grotesk', sans-serif",
                        transition: 'all 0.2s',
                    }}>
                        {q}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div style={{
                padding: '12px 16px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)',
                flexShrink: 0,
            }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                        placeholder="Ask about bearings, wheels, brakes, system health…"
                        disabled={!wsReady}
                        style={{
                            width: '100%', padding: '13px 52px 13px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 14, color: 'rgba(255,255,255,0.9)',
                            fontSize: 13.5, outline: 'none',
                            fontFamily: "'Space Grotesk', sans-serif",
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(0,180,216,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                    <button
                        onClick={send}
                        disabled={!input.trim() || !wsReady}
                        style={{
                            position: 'absolute', right: 8,
                            width: 36, height: 36, borderRadius: 10,
                            background: input.trim() && wsReady ? 'linear-gradient(135deg,#00b4d8,#0070ff)' : 'rgba(255,255,255,0.05)',
                            border: 'none', cursor: input.trim() && wsReady ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: input.trim() && wsReady ? 'white' : 'rgba(255,255,255,0.2)',
                            transition: 'all 0.2s',
                            boxShadow: input.trim() && wsReady ? '0 0 12px rgba(0,180,216,0.5)' : 'none',
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
