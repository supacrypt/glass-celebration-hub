import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DeploymentReadinessCardProps {
  overallReadiness: number;
}

export const DeploymentReadinessCard: React.FC<DeploymentReadinessCardProps> = ({
  overallReadiness
}) => {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Deployment Readiness</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{overallReadiness}%</span>
            {overallReadiness >= 90 && <CheckCircle className="w-5 h-5 text-glass-green" />}
            {overallReadiness < 90 && overallReadiness >= 75 && <AlertTriangle className="w-5 h-5 text-glass-pink" />}
            {overallReadiness < 75 && <AlertTriangle className="w-5 h-5 text-red-500" />}
          </div>
        </div>
        <Progress value={overallReadiness} className="w-full mb-3" />
        <div className="text-xs text-muted-foreground">
          {overallReadiness >= 90 && "Ready for production deployment"}
          {overallReadiness < 90 && overallReadiness >= 75 && "Almost ready - address warnings before deployment"}
          {overallReadiness < 75 && "Critical issues need attention before deployment"}
        </div>
      </CardContent>
    </Card>
  );
};