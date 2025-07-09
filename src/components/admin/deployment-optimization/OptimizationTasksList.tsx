import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OptimizationTask } from './types';

interface OptimizationTasksListProps {
  optimizationTasks: OptimizationTask[];
  onToggleOptimization: (taskId: string) => void;
}

export const OptimizationTasksList: React.FC<OptimizationTasksListProps> = ({
  optimizationTasks,
  onToggleOptimization
}) => {
  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-500/10 text-red-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      low: 'bg-green-500/10 text-green-500'
    };
    return colors[impact as keyof typeof colors] || colors.medium;
  };

  return (
    <>
      <div className="space-y-2">
        {optimizationTasks.map((task) => (
          <Card key={task.id} className="glass-card">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleOptimization(task.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </span>
                      <Badge className={`text-xs ${getImpactBadge(task.impact)}`}>
                        {task.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.effort} effort
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{task.description}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optimization Summary */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Optimization Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-glass-green">
                {optimizationTasks.filter(t => t.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-glass-blue">
                {optimizationTasks.filter(t => !t.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};