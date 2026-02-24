import React from 'react';
import { motion } from 'framer-motion';

const AgentGrid = ({ activeAgents = [] }) => {
    const categories = [
        { title: "Sensory", range: [1, 10], color: "from-cyan-500 to-blue-500" },
        { title: "Processing", range: [11, 18], color: "from-purple-500 to-indigo-500" },
        { title: "Inspection", range: [19, 30], color: "from-orange-500 to-red-500" },
        { title: "Prediction", range: [31, 38], color: "from-pink-500 to-rose-500" },
        { title: "Decision", range: [39, 44], color: "from-emerald-500 to-teal-500" },
        { title: "Comm", range: [45, 50], color: "from-gray-500 to-slate-500" },
    ];

    const isActive = (id) => activeAgents.some(a => a.id === `A${id}`);

    return (
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 overflow-y-auto max-h-[300px] custom-scrollbar">
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">Active Agent Matrix</div>
            <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 50 }, (_, i) => i + 1).map((id) => {
                    const active = isActive(id);
                    return (
                        <motion.div
                            key={id}
                            initial={false}
                            animate={{
                                scale: active ? [1, 1.2, 1] : 1,
                                opacity: active ? 1 : 0.3,
                                boxShadow: active ? "0 0 15px rgba(0, 255, 255, 0.5)" : "none"
                            }}
                            className={`
                aspect-square rounded-[4px] flex items-center justify-center text-[8px] font-bold cursor-help transition-colors
                ${active ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/30 border border-white/5'}
              `}
                            title={`Agent A${id}`}
                        >
                            A{id}
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
                {categories.map(cat => (
                    <div key={cat.title} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${cat.color}`} />
                        <span className="text-[9px] text-white/50 uppercase tracking-tight">{cat.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentGrid;
