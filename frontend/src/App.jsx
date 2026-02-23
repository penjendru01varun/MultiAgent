import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'

function App() {
    const [systemState, setSystemState] = useState({
        blackboard: {},
        agents: [],
        health: {}
    })

    useEffect(() => {
        // Connect to WebSocket for real-time updates
        const ws = new WebSocket('ws://localhost:8000/ws/updates')

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setSystemState(data)
        }

        return () => ws.close()
    }, [])

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col">
            <Dashboard state={systemState} />
        </div>
    )
}

export default App
