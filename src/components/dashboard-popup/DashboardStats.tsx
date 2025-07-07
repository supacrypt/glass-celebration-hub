import React from 'react';
import { StatItem } from './types';

interface DashboardStatsProps {
  stats: StatItem[];
  userRole: 'guest' | 'admin' | 'couple';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, userRole }) => {
  return (
    <div className={`grid gap-4 ${userRole === 'admin' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              userRole === 'admin' 
                ? `bg-gradient-to-br ${stat.color}` 
                : 'bg-[#2d3f51]'
            }`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-[#2d3f51]">{stat.value}</div>
              <div className="text-xs text-[#7a736b]">{stat.label}</div>
              {stat.total && (
                <div className="mt-1 w-full bg-[#a39b92]/20 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-700"
                    style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;