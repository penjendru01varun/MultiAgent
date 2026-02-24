import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ activeAgents = [] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start mb-6"
        >
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl rounded-tl-none p-4 backdrop-blur-sm max-w-[80%]">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                        />
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Concierge is thinking</span>
                </div>

                {activeAgents.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-tighter">Activating specialized agents:</div>
                        <div className="flex flex-wrap gap-1.5">
                            {activeAgents.map(agentId => (
                                <div key={agentId} className="flex flex-col gap-1 w-12">
                                    <span className="text-[8px] text-cyan-400/70 font-mono text-center">{agentId}</span>
                                    <div className="h-0.5 w-full bg-white/5 overflow-hidden rounded-full">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="h-full w-full bg-cyan-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TypingIndicator;
