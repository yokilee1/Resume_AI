import React from 'react';
import { motion } from 'framer-motion';

export const SimpleLineChart = ({ data }: { data: { label: string; value: number }[] }) => {
    const height = 100;
    const width = 300;

    if (!data || data.length === 0) {
        return <div className="w-full h-32 flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">No Data Available</div>;
    }

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const points = data.map((d, i) => {
        const x = data.length === 1 ? width / 2 : (i / (data.length - 1)) * width;
        const y = height - (d.value / maxVal) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-32 flex flex-col justify-end">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0f172a" stopOpacity="1" />
                        <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="0" x2={width} y2="0" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1={height} x2={width} y2={height} stroke="#e2e8f0" strokeWidth="1" />

                {/* Line */}
                <motion.polyline
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    points={points}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Dots */}
                {data.map((d, i) => {
                    const x = data.length === 1 ? width / 2 : (i / (data.length - 1)) * width;
                    const y = height - (d.value / maxVal) * height;
                    return (
                        <motion.g
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                        >
                            <circle cx={x} cy={y} r="4" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                        </motion.g>
                    );
                })}
            </svg>
            <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                {data.map((d, i) => <span key={i}>{d.label}</span>)}
            </div>
        </div>
    );
};

export const SimplePieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
    if (!data || data.length === 0) {
        return <div className="h-28 flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">No Data</div>;
    }
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let cumulativePercent = 0;

    return (
        <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 rounded-full flex-shrink-0">
                <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                    {data.map((slice, i) => {
                        const percent = slice.value / total;
                        const dashArray = `${percent * 100} 100`;
                        const offset = -(cumulativePercent * 100);
                        cumulativePercent += percent;
                        return (
                            <motion.circle
                                key={i}
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: dashArray }}
                                transition={{ duration: 1, delay: 0.2 + i * 0.2 }}
                                r="16"
                                cx="16"
                                cy="16"
                                fill="transparent"
                                stroke={slice.color}
                                strokeWidth="32"
                                strokeDashoffset={offset}
                            />
                        );
                    })}
                    <circle r="12" cx="16" cy="16" fill="white" />
                </svg>
            </div>
            <div className="space-y-2">
                {data.map((slice, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center text-xs"
                    >
                        <span className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{ backgroundColor: slice.color }}></span>
                        <span className="text-slate-600 font-bold">{slice.label}</span>
                        <span className="text-slate-400 ml-1.5 tabular-nums">{Math.round((slice.value / total) * 100)}%</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
