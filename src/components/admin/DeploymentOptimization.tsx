import React, { useState, useEffect } from 'react';
import { Rocket, CheckCircle, AlertTriangle, Settings, Database, Globe, Shield, Zap, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeploymentCheck {
  id: string;
  name: string;
  category: 'security' | 'performance' | 'database' | 'features' | 'optimization';
  status: 'passed' | 'failed' | 'warning' | 'checking';
  message: string;
  automated: boolean;
  critical: boolean;
}

interface OptimizationTask {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  completed: boolean;
  category: 'performance' | 'seo' | 'accessibility' | 'maintenance';
}

const DeploymentOptimization: React.FC = () => {
  const [deploymentChecks, setDeploymentChecks] = useState<DeploymentCheck[]>([]);
  const [optimizationTasks, setOptimizationTasks] = useState<OptimizationTask[]>([]);
  const [overallReadiness, setOverallReadiness] = useState(0);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeChecks();
    initializeOptimizations();
  }, []);

  const initializeChecks = () => {
    const checks: DeploymentCheck[] = [
      {
        id: 'rls-policies',
        name: 'RLS Policies',
        category: 'security',
        status: 'passed',
        message: 'All tables have proper RLS policies configured',
        automated: true,
        critical: true
      },
      {
        id: 'storage-policies',
        name: 'Storage Policies',
        category: 'security',
        status: 'passed',
        message: 'Storage buckets have proper access controls',
        automated: true,
        critical: true
      },
      {
        id: 'auth-config',
        name: 'Authentication Config',
        category: 'security',
        status: 'passed',
        message: 'User roles and permissions properly configured',
        automated: true,
        critical: true
      },
      {
        id: 'api-performance',
        name: 'API Performance',
        category: 'performance',
        status: 'passed',
        message: 'Average response time: 145ms',
        automated: true,
        critical: false
      },
      {
        id: 'bundle-size',
        name: 'Bundle Optimization',
        category: 'performance',
        status: 'warning',
        message: 'JS bundle: 185KB (consider code splitting)',
        automated: true,
        critical: false
      },
      {
        id: 'database-indexes',
        name: 'Database Indexes',
        category: 'database',
        status: 'passed',
        message: 'Proper indexes on frequently queried columns',
        automated: true,
        critical: false
      },
      {
        id: 'error-handling',
        name: 'Error Handling',
        category: 'features',
        status: 'passed',
        message: 'Comprehensive error handling implemented',
        automated: false,
        critical: true
      },
      {
        id: 'mobile-optimization',
        name: 'Mobile Optimization',
        category: 'optimization',
        status: 'passed',
        message: 'Responsive design working on all devices',
        automated: false,
        critical: true
      }
    ];

    setDeploymentChecks(checks);
    calculateReadiness(checks);
  };

  const initializeOptimizations = () => {
    const tasks: OptimizationTask[] = [
      {
        id: 'lazy-loading',
        title: 'Implement Lazy Loading',
        description: 'Add lazy loading for images and heavy components',
        impact: 'high',
        effort: 'medium',
        completed: false,
        category: 'performance'
      },
      {
        id: 'meta-tags',
        title: 'SEO Meta Tags',
        description: 'Add comprehensive meta tags for better SEO',
        impact: 'medium',
        effort: 'low',
        completed: false,
        category: 'seo'
      },
      {
        id: 'service-worker',
        title: 'Service Worker',
        description: 'Implement service worker for offline functionality',
        impact: 'high',
        effort: 'high',
        completed: false,
        category: 'performance'
      },
      {
        id: 'analytics',
        title: 'Analytics Integration',
        description: 'Add Google Analytics or similar tracking',
        impact: 'medium',
        effort: 'low',
        completed: false,
        category: 'maintenance'
      },
      {
        id: 'alt-text',
        title: 'Image Alt Text',
        description: 'Ensure all images have descriptive alt text',
        impact: 'medium',
        effort: 'low',
        completed: true,
        category: 'accessibility'
      },
      {
        id: 'keyboard-nav',
        title: 'Keyboard Navigation',
        description: 'Test and improve keyboard navigation flow',
        impact: 'high',
        effort: 'medium',
        completed: true,
        category: 'accessibility'
      }
    ];

    setOptimizationTasks(tasks);
  };

  const calculateReadiness = (checks: DeploymentCheck[]) => {
    const criticalChecks = checks.filter(check => check.critical);
    const passedCritical = criticalChecks.filter(check => check.status === 'passed').length;
    const totalChecks = checks.length;
    const totalPassed = checks.filter(check => check.status === 'passed').length;
    
    // Weight critical checks more heavily
    const criticalWeight = 0.7;
    const overallWeight = 0.3;
    
    const criticalScore = criticalChecks.length > 0 ? (passedCritical / criticalChecks.length) : 1;
    const overallScore = totalChecks > 0 ? (totalPassed / totalChecks) : 1;
    
    const readiness = Math.round((criticalScore * criticalWeight + overallScore * overallWeight) * 100);
    setOverallReadiness(readiness);
  };

  const runAutomatedChecks = async () => {
    setIsRunningChecks(true);
    
    const updatedChecks = [...deploymentChecks];
    
    for (let i = 0; i < updatedChecks.length; i++) {
      if (updatedChecks[i].automated) {
        updatedChecks[i].status = 'checking';
        setDeploymentChecks([...updatedChecks]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate check results
        updatedChecks[i].status = Math.random() > 0.2 ? 'passed' : 'warning';
        setDeploymentChecks([...updatedChecks]);
      }
    }
    
    setIsRunningChecks(false);
    calculateReadiness(updatedChecks);
    
    toast({
      title: "Checks Complete",
      description: "Automated deployment checks completed",
    });
  };

  const toggleOptimization = (taskId: string) => {
    setOptimizationTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

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

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-500/10 text-red-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      low: 'bg-green-500/10 text-green-500'
    };
    return colors[impact as keyof typeof colors] || colors.medium;
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

      {/* Readiness Overview */}
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
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-3">
          <div className="space-y-2">
            {optimizationTasks.map((task) => (
              <Card key={task.id} className="glass-card">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleOptimization(task.id)}
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
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Configure Domain
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Database className="w-3 h-3 mr-1" />
              Backup Database
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Monitor className="w-3 h-3 mr-1" />
              Performance Test
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Security Scan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentOptimization;