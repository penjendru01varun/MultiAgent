import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';

    return (
        <motion.div
            initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
        >
            <div className={`
        max-w-[85%] rounded-2xl p-4 shadow-2xl relative
        ${isUser
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none'
                    : 'bg-zinc-900/80 border border-white/10 text-zinc-100 rounded-tl-none backdrop-blur-sm'}
      `}>
                {!isUser && (
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-400">RailGuard Concierge</span>
                    </div>
                )}

                <div className="text-sm leading-relaxed whitespace-pre-wrap font-['Space_Grotesk']">
                    {message.text}
                </div>

                {message.active_agents && message.active_agents.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                        {message.active_agents.map(agent => (
                            <div
                                key={agent.id}
                                className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-400 font-mono"
                            >
                                [{agent.id}] {agent.name.split(' ')[0]}
                            </div>
                        ))}
                    </div>
                )}

                {message.confidence && (
                    <div className="mt-2 text-[9px] text-white/30 flex items-center gap-2">
                        <span>Confidence: {(message.confidence * 100).toFixed(0)}%</span>
                        <div className="flex gap-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-1 rounded-full ${i < message.confidence * 10
                                        ? 'bg-cyan-500'
                                        : 'bg-white/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageBubble;
