import React, { useMemo } from 'react';
import { Screen } from '../types';
import { ArrowLeft, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { getFocusSessions, getCompletionRate, getTodayLaunchCount, getAppLaunches } from '../services/storageService';

interface StatsProps {
  onNavigate: (screen: Screen) => void;
}

const Stats: React.FC<StatsProps> = ({ onNavigate }) => {
  const sessions = getFocusSessions(7);
  const completionRate = getCompletionRate(7);
  const todayLaunches = getTodayLaunchCount();
  const recentLaunches = getAppLaunches(7);

  // Calculate total focus time in hours
  const totalFocusMinutes = sessions
    .filter(s => s.completed)
    .reduce((sum, s) => sum + s.duration, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  // Count completed sessions
  const completedSessions = sessions.filter(s => s.completed).length;

  // Prepare weekly data
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayMinutes = sessions
        .filter(s => s.completed && s.startTime >= date.getTime() && s.startTime < nextDay.getTime())
        .reduce((sum, s) => sum + s.duration, 0);

      data.push({
        day: days[date.getDay()],
        minutes: dayMinutes,
      });
    }

    return data;
  }, [sessions]);

  // Find most productive day
  const mostProductiveDay = useMemo(() => {
    const max = Math.max(...weeklyData.map(d => d.minutes));
    const day = weeklyData.find(d => d.minutes === max);
    return day && day.minutes > 0 ? day.day : null;
  }, [weeklyData]);

  // Calculate app launch insights
  const topApps = useMemo(() => {
    const appCounts: Record<string, number> = {};
    recentLaunches.forEach(launch => {
      appCounts[launch.appName] = (appCounts[launch.appName] || 0) + 1;
    });

    return Object.entries(appCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  }, [recentLaunches]);

  return (
    <div className="flex flex-col h-full px-8 pt-12 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => onNavigate(Screen.HOME)} className="p-2 -ml-2 text-white/50 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-light">Digital Wellbeing</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <Clock className="text-white/30 mb-4" size={20} />
            <div className="text-3xl font-light mb-1">{totalFocusHours}h</div>
            <div className="text-[10px] uppercase tracking-widest text-white/30">Total Focus (7d)</div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <Zap className="text-white/30 mb-4" size={20} />
            <div className="text-3xl font-light mb-1">{completedSessions}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/30">Deep Sessions</div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <TrendingUp className="text-white/30 mb-4" size={20} />
            <div className="text-3xl font-light mb-1">{completionRate}%</div>
            <div className="text-[10px] uppercase tracking-widest text-white/30">Completion Rate</div>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
            <Target className="text-white/30 mb-4" size={20} />
            <div className="text-3xl font-light mb-1">{todayLaunches}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/30">Apps Today</div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div>
          <h3 className="text-sm uppercase tracking-widest text-white/20 mb-6 font-light">
            Weekly Progress (Minutes)
          </h3>
          <div className="h-64 w-full bg-zinc-900/30 rounded-3xl p-4 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #222',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#fff' : '#333'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Apps */}
        {topApps.length > 0 && (
          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/20 mb-4 font-light">
              Most Launched Apps (7d)
            </h3>
            <div className="space-y-3">
              {topApps.map((app, index) => (
                <div
                  key={app.name}
                  className="flex items-center justify-between py-3 px-4 bg-zinc-900/30 rounded-2xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/30 text-sm font-mono">#{index + 1}</span>
                    <span className="font-light">{app.name}</span>
                  </div>
                  <span className="text-white/40 text-sm">{app.count}×</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insight */}
        <div className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5">
          <div className="flex items-start gap-4">
            <Target className="text-white/50 shrink-0" size={24} strokeWidth={1.5} />
            <div>
              <h4 className="font-light text-lg mb-2">Mindful Insight</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                {sessions.length === 0 ? (
                  "Start your first focus session to track your productivity journey."
                ) : completionRate >= 80 ? (
                  `Excellent work! You're completing ${completionRate}% of your focus sessions. Keep this momentum going.`
                ) : completionRate >= 50 ? (
                  `You're completing ${completionRate}% of sessions. Try reducing distractions to improve your completion rate.`
                ) : mostProductiveDay ? (
                  `You're most productive on ${mostProductiveDay}s. Consider scheduling deep work during this time.`
                ) : (
                  "Build consistency by completing more focus sessions. Small steps lead to big changes."
                )}
              </p>
            </div>
          </div>
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/30 italic text-sm">
              No data yet. Start using Zenith to see your analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
