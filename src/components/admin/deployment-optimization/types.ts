export interface DeploymentCheck {
  id: string;
  name: string;
  category: 'security' | 'performance' | 'database' | 'features' | 'optimization';
  status: 'passed' | 'failed' | 'warning' | 'checking';
  message: string;
  automated: boolean;
  critical: boolean;
}

export interface OptimizationTask {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  completed: boolean;
  category: 'performance' | 'seo' | 'accessibility' | 'maintenance';
}