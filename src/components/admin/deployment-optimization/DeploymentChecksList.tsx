import React from 'react';
import { CheckCircle, AlertTriangle, Settings, Database, Shield, Zap, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeploymentCheck } from './types';

interface DeploymentChecksListProps {
  deploymentChecks: DeploymentCheck[];
}

export const DeploymentChecksList: React.FC<DeploymentChecksListProps> = ({
  deploymentChecks
}) => {
  const getStatusIcon = (status: DeploymentCheck['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-glass-green" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-glass-pink" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      security: Shield,
      performance: Zap,
      database: Database,
      features: Settings,
      optimization: Monitor
    };
    const Icon = icons[category as keyof typeof icons] || Settings;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-2">
      {deploymentChecks.map((check) => (
        <Card key={check.id} className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                {getCategoryIcon(check.category)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{check.name}</span>
                    {check.critical && (
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    )}
                    {check.automated && (
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{check.message}</div>
                </div>
              </div>
              <Badge variant={check.status === 'passed' ? 'default' : check.status === 'warning' ? 'secondary' : 'destructive'}>
                {check.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};