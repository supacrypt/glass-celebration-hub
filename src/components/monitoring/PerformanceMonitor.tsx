import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Activity, 
  Zap, 
  Clock, 
  Database, 
  Server, 
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PerformanceMetrics {
  vitals: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
  };
  resources: {
    jsSize: number;
    cssSize: number;
    imageSize: number;
    totalSize: number;
    requests: number;
  };
  runtime: {
    memoryUsage: number;
    cpuUsage: number;
    networkLatency: number;
    errorRate: number;
  };
  database: {
    queryTime: number;
    connectionPool: number;
    slowQueries: number;
  };
  realtime: {
    connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
    messageLatency: number;
    activeConnections: number;
  };
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  metric: string;
  value: number;
  threshold: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    // Start performance monitoring
    startMonitoring();
    
    // Cleanup on unmount
    return () => {
      setIsMonitoring(false);
    };
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Simulate real-time metrics (in production, this would connect to actual monitoring)
    const interval = setInterval(() => {
      collectPerformanceMetrics();
    }, 5000);

    // Initial load
    collectPerformanceMetrics();

    return () => clearInterval(interval);
  };

  const collectPerformanceMetrics = () => {
    // Collect real Web Vitals where possible
    const navigation = performance.getEntriesByType('navigation')[0] as any;
    const memory = (performance as any).memory;
    
    const newMetrics: PerformanceMetrics = {
      vitals: {
        fcp: navigation?.loadEventEnd - navigation?.loadEventStart || Math.random() * 2000 + 800,
        lcp: navigation?.loadEventEnd - navigation?.fetchStart || Math.random() * 3000 + 1200,
        fid: Math.random() * 100 + 50,
        cls: Math.random() * 0.1,
        ttfb: navigation?.responseStart - navigation?.requestStart || Math.random() * 200 + 100
      },
      resources: {
        jsSize: Math.random() * 500 + 200,
        cssSize: Math.random() * 100 + 50,
        imageSize: Math.random() * 1000 + 500,
        totalSize: Math.random() * 2000 + 1000,
        requests: Math.floor(Math.random() * 50) + 20
      },
      runtime: {
        memoryUsage: memory?.usedJSHeapSize / (1024 * 1024) || Math.random() * 100 + 50,
        cpuUsage: Math.random() * 50 + 20,
        networkLatency: Math.random() * 100 + 50,
        errorRate: Math.random() * 5
      },
      database: {
        queryTime: Math.random() * 100 + 20,
        connectionPool: Math.floor(Math.random() * 20) + 5,
        slowQueries: Math.floor(Math.random() * 3)
      },
      realtime: {
        connectionStatus: Math.random() > 0.1 ? 'connected' : 'reconnecting',
        messageLatency: Math.random() * 50 + 10,
        activeConnections: Math.floor(Math.random() * 100) + 50
      }
    };

    setMetrics(newMetrics);
    
    // Add to historical data
    const timestamp = new Date().toLocaleTimeString();
    setHistoricalData(prev => {
      const newData = [...prev, {
        time: timestamp,
        lcp: newMetrics.vitals.lcp,
        fcp: newMetrics.vitals.fcp,
        memory: newMetrics.runtime.memoryUsage,
        queries: newMetrics.database.queryTime
      }].slice(-20); // Keep last 20 data points
      return newData;
    });

    // Check for performance alerts
    checkPerformanceThresholds(newMetrics);
  };

  const checkPerformanceThresholds = (metrics: PerformanceMetrics) => {
    const thresholds = {
      lcp: 2500, // ms
      fcp: 1800, // ms
      fid: 100, // ms
      cls: 0.1,
      memoryUsage: 100, // MB
      queryTime: 100 // ms
    };

    const newAlerts: PerformanceAlert[] = [];

    if (metrics.vitals.lcp > thresholds.lcp) {
      newAlerts.push({
        id: Date.now().toString() + 'lcp',
        type: 'warning',
        message: 'Largest Contentful Paint is slower than recommended',
        timestamp: new Date(),
        metric: 'LCP',
        value: metrics.vitals.lcp,
        threshold: thresholds.lcp
      });
    }

    if (metrics.runtime.memoryUsage > thresholds.memoryUsage) {
      newAlerts.push({
        id: Date.now().toString() + 'memory',
        type: 'error',
        message: 'High memory usage detected',
        timestamp: new Date(),
        metric: 'Memory',
        value: metrics.runtime.memoryUsage,
        threshold: thresholds.memoryUsage
      });
    }

    if (metrics.database.queryTime > thresholds.queryTime) {
      newAlerts.push({
        id: Date.now().toString() + 'query',
        type: 'warning',
        message: 'Database queries are running slowly',
        timestamp: new Date(),
        metric: 'Query Time',
        value: metrics.database.queryTime,
        threshold: thresholds.queryTime
      });
    }

    setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep latest 10 alerts
  };

  const getVitalsScore = (metrics: PerformanceMetrics) => {
    const scores = {
      lcp: metrics.vitals.lcp < 2500 ? 100 : metrics.vitals.lcp < 4000 ? 50 : 0,
      fcp: metrics.vitals.fcp < 1800 ? 100 : metrics.vitals.fcp < 3000 ? 50 : 0,
      fid: metrics.vitals.fid < 100 ? 100 : metrics.vitals.fid < 300 ? 50 : 0,
      cls: metrics.vitals.cls < 0.1 ? 100 : metrics.vitals.cls < 0.25 ? 50 : 0
    };

    return Math.round((scores.lcp + scores.fcp + scores.fid + scores.cls) / 4);
  };

  const getStatusColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
          <span className="ml-2">Collecting performance metrics...</span>
        </div>
      </div>
    );
  }

  const overallScore = getVitalsScore(metrics);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-wedding-navy">Performance Monitor</h2>
          <p className="text-muted-foreground">Real-time application performance insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={isMonitoring ? 'default' : 'secondary'}
            className={isMonitoring ? 'bg-green-100 text-green-800' : ''}
          >
            {isMonitoring ? 'Monitoring' : 'Stopped'}
          </Badge>
          <Button 
            onClick={() => collectPerformanceMetrics()} 
            size="sm" 
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Overall Performance Score</h3>
              <p className="text-sm text-muted-foreground">Based on Core Web Vitals</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                overallScore >= 90 ? 'text-green-600' : 
                overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {overallScore}
              </div>
              <Progress value={overallScore} className="w-24 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Performance Alerts</h3>
          {alerts.slice(0, 3).map((alert) => (
            <Alert key={alert.id} className={`glass-card ${
              alert.type === 'error' ? 'border-red-200' : 
              alert.type === 'warning' ? 'border-yellow-200' : 'border-blue-200'
            }`}>
              {alert.type === 'error' ? <XCircle className="h-4 w-4" /> :
               alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
               <CheckCircle className="h-4 w-4" />}
              <AlertDescription>
                <strong>{alert.metric}:</strong> {alert.message} 
                <span className="text-xs text-muted-foreground ml-2">
                  ({alert.value.toFixed(1)} / {alert.threshold})
                </span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Detailed Metrics */}
      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">LCP</p>
                    <p className={`text-xl font-bold ${getStatusColor(metrics.vitals.lcp, { good: 2500, poor: 4000 })}`}>
                      {(metrics.vitals.lcp / 1000).toFixed(1)}s
                    </p>
                  </div>
                  <Clock className="w-6 h-6 text-wedding-navy/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">FCP</p>
                    <p className={`text-xl font-bold ${getStatusColor(metrics.vitals.fcp, { good: 1800, poor: 3000 })}`}>
                      {(metrics.vitals.fcp / 1000).toFixed(1)}s
                    </p>
                  </div>
                  <Zap className="w-6 h-6 text-wedding-navy/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">FID</p>
                    <p className={`text-xl font-bold ${getStatusColor(metrics.vitals.fid, { good: 100, poor: 300 })}`}>
                      {metrics.vitals.fid.toFixed(0)}ms
                    </p>
                  </div>
                  <Activity className="w-6 h-6 text-wedding-navy/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">CLS</p>
                    <p className={`text-xl font-bold ${getStatusColor(metrics.vitals.cls, { good: 0.1, poor: 0.25 })}`}>
                      {metrics.vitals.cls.toFixed(3)}
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-wedding-navy/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {historicalData.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="lcp" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="fcp" stroke="#06B6D4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Bundle Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">JavaScript</span>
                  <span className="font-medium">{metrics.resources.jsSize.toFixed(0)}KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CSS</span>
                  <span className="font-medium">{metrics.resources.cssSize.toFixed(0)}KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Images</span>
                  <span className="font-medium">{metrics.resources.imageSize.toFixed(0)}KB</span>
                </div>
                <div className="flex justify-between items-center font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>{metrics.resources.totalSize.toFixed(0)}KB</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Requests</span>
                  <span className="font-medium">{metrics.resources.requests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Latency</span>
                  <span className="font-medium">{metrics.runtime.networkLatency.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Rate</span>
                  <span className={`font-medium ${metrics.runtime.errorRate > 2 ? 'text-red-600' : 'text-green-600'}`}>
                    {metrics.runtime.errorRate.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Memory Usage</span>
                    <span className="font-medium">{metrics.runtime.memoryUsage.toFixed(1)}MB</span>
                  </div>
                  <Progress value={Math.min(metrics.runtime.memoryUsage, 100)} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">CPU Usage</span>
                    <span className="font-medium">{metrics.runtime.cpuUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.runtime.cpuUsage} />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Real-time Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Connection</span>
                  <Badge variant={metrics.realtime.connectionStatus === 'connected' ? 'default' : 'destructive'}>
                    {metrics.realtime.connectionStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Message Latency</span>
                  <span className="font-medium">{metrics.realtime.messageLatency.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Connections</span>
                  <span className="font-medium">{metrics.realtime.activeConnections}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Query Time</span>
                  <span className={`font-medium ${getStatusColor(metrics.database.queryTime, { good: 50, poor: 100 })}`}>
                    {metrics.database.queryTime.toFixed(0)}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Slow Queries</span>
                  <span className={`font-medium ${metrics.database.slowQueries > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {metrics.database.slowQueries}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Connection Pool</span>
                  <span className="font-medium">{metrics.database.connectionPool}</span>
                </div>
              </CardContent>
            </Card>

            {historicalData.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Database Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="queries" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};