import React from 'react';
import { Rocket, CheckCircle, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DeploymentReadinessCard,
  DeploymentChecksList,
  OptimizationTasksList,
  QuickActionsCard,
  useDeploymentData
} from './deployment-optimization';

const DeploymentOptimization: React.FC = () => {
  const {
    deploymentChecks,
    optimizationTasks,
    overallReadiness,
    isRunningChecks,
    runAutomatedChecks,
    toggleOptimization
  } = useDeploymentData();

  return (
    <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '580px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-wedding-navy" />
          <h3 className="font-semibold text-wedding-navy">Deployment & Optimization</h3>
        </div>
        <Button onClick={runAutomatedChecks} disabled={isRunningChecks}>
          {isRunningChecks ? (
            <div className="w-4 h-4 animate-spin rounded-full border border-current border-t-transparent mr-2" />
          ) : (
            <CheckCircle className="w-3 h-3 mr-2" />
          )}
          Run Checks
        </Button>
      </div>

      <DeploymentReadinessCard overallReadiness={overallReadiness} />

      <Tabs defaultValue="checks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checks">
            <Shield className="w-3 h-3 mr-1" />
            Deployment Checks
          </TabsTrigger>
          <TabsTrigger value="optimizations">
            <Zap className="w-3 h-3 mr-1" />
            Optimizations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="space-y-3">
          <DeploymentChecksList deploymentChecks={deploymentChecks} />
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-3">
          <OptimizationTasksList 
            optimizationTasks={optimizationTasks}
            onToggleOptimization={toggleOptimization}
          />
        </TabsContent>
      </Tabs>

      <QuickActionsCard />
    </div>
  );
};

export default DeploymentOptimization;