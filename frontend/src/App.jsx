import { useState, useEffect, useRef, Component } from 'react'
import Dashboard from './components/Dashboard'
import ChatbotOverlay from './components/Chatbot/ChatbotOverlay'

// ── Error Boundary ───────────────────────────────────────────
class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info)
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    background: '#0a0a0f', color: '#00f3ff', fontFamily: 'monospace',
                    padding: '2rem', minHeight: '100vh', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <h2>⚠ Component Error — Recovering…</h2>
                    <p style={{ color: '#666', marginTop: 8 }}>{String(this.state.error?.message)}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{ marginTop: 16, padding: '8px 24px', background: '#00f3ff', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                    >
                        Retry
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

// ── Main App ─────────────────────────────────────────────────
function App() {
    const [systemState, setSystemState] = useState({
        blackboard: {},
        agents: [],
        health: {}
    })

    const wsRef = useRef(null)
    const reconnectRef = useRef(null)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true

        function connect() {
            // Don't reconnect if already open or component unmounted
            if (!mountedRef.current) return
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return

            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const wsUrl = isLocal
                ? 'ws://localhost:8000/ws/updates'
                : 'wss://multiagent-backend-fm5f.onrender.com/ws/updates';
            const ws = new WebSocket(wsUrl)
            wsRef.current = ws

            ws.onopen = () => {
                console.log('[RailGuard] WS connected')
                clearTimeout(reconnectRef.current)
            }

            ws.onmessage = (e) => {
                if (!mountedRef.current) return
                try {
                    const data = JSON.parse(e.data)
                    setSystemState(data)
                } catch (_) { /* ignore bad frames */ }
            }

            ws.onclose = () => {
                if (!mountedRef.current) return
                console.log('[RailGuard] WS closed — reconnecting in 3s')
                reconnectRef.current = setTimeout(connect, 3000)
            }

            ws.onerror = () => {
                ws.close() // triggers onclose → reconnect
            }
        }

        connect()

        return () => {
            mountedRef.current = false
            clearTimeout(reconnectRef.current)
            if (wsRef.current) wsRef.current.close()
        }
    }, [])

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <ErrorBoundary>
                <Dashboard state={systemState} />
            </ErrorBoundary>
            <ErrorBoundary>
                <ChatbotOverlay />
            </ErrorBoundary>
        </div>
    )
}

export default App
