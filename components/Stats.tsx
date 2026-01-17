
import React from 'react';
import { Screen } from '../types';
import { ArrowLeft, Clock, Zap, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface StatsProps {
  onNavigate: (screen: Screen) => void;
}

const DATA = [
  { day: 'Mon', minutes: 120 },
  { day: 'Tue', minutes: 85 },
  { day: 'Wed', minutes: 160 },
  { day: 'Thu', minutes: 45 },
  { day: 'Fri', minutes: 190 },
  { day: 'Sat', minutes: 30 },
  { day: 'Sun', minutes: 10 },
];

const Stats: React.FC<StatsProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full px-8 pt-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => onNavigate(Screen.HOME)} className="p-2 -ml-2 text-white/50 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-light">Digital Wellbeing</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-zinc-900/50 p-6 rounded-3xl">
          <Clock className="text-white/30 mb-4" size={20} />
          <div className="text-3xl font-light mb-1">4.2h</div>
          <div className="text-[10px] uppercase tracking-widest text-white/30">Total Focus</div>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-3xl">
          <Zap className="text-white/30 mb-4" size={20} />
          <div className="text-3xl font-light mb-1">12</div>
          <div className="text-[10px] uppercase tracking-widest text-white/30">Deep Sessions</div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-sm uppercase tracking-widest text-white/20 mb-6 font-light">Weekly Progress (Minutes)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}}
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px'}}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.minutes > 100 ? '#fff' : '#333'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5">
        <div className="flex items-start gap-4">
          <Target className="text-white/50 shrink-0" size={24} strokeWidth={1.5} />
          <div>
            <h4 className="font-light text-lg mb-2">Mindful Insight</h4>
            <p className="text-white/40 text-sm leading-relaxed">
              You are most productive on Friday mornings. Consider scheduling your most difficult tasks then and keep your phone in the other room.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
