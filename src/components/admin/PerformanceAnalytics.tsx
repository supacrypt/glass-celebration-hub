import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Clock, Users, Database, Globe, Monitor, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface PageMetrics {
  path: string;
  loadTime: number;
  visitors: number;
  bounceRate: number;
  performance: number;
}

const PerformanceAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [pageMetrics, setPageMetrics] = useState<PageMetrics[]>([]);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = () => {
    // Simulate performance metrics - in real app, this would come from analytics APIs
    const mockMetrics: PerformanceMetric[] = [
      {
        name: 'Page Load Time',
        value: 1.2,
        unit: 's',
        trend: 'down',
        trendValue: 8.5,
        status: 'good',
        description: 'Average time to load pages'
      },
      {
        name: 'First Contentful Paint',
        value: 0.8,
        unit: 's',
        trend: 'down',
        trendValue: 12.3,
        status: 'good',
        description: 'Time to first meaningful content'
      },
      {
        name: 'Time to Interactive',
        value: 2.1,
        unit: 's',
        trend: 'up',
        trendValue: 5.2,
        status: 'warning',
        description: 'Time until page becomes interactive'
      },
      {
        name: 'Core Web Vitals Score',
        value: 87,
        unit: '/100',
        trend: 'stable',
        trendValue: 0,
        status: 'good',
        description: 'Overall performance score'
      },
      {
        name: 'API Response Time',
        value: 145,
        unit: 'ms',
        trend: 'down',
        trendValue: 15.8,
        status: 'good',
        description: 'Average API endpoint response time'
      },
      {
        name: 'Database Query Time',
        value: 23,
        unit: 'ms',
        trend: 'up',
        trendValue: 3.2,
        status: 'good',
        description: 'Average database query execution time'
      },
      {
        name: 'Memory Usage',
        value: 68,
        unit: '%',
        trend: 'up',
        trendValue: 12.5,
        status: 'warning',
        description: 'Current memory utilization'
      },
      {
        name: 'Cache Hit Rate',
        value: 94,
        unit: '%',
        trend: 'up',
        trendValue: 7.8,
        status: 'good',
        description: 'Percentage of requests served from cache'
      }
    ];

    const mockPageMetrics: PageMetrics[] = [
      {
        path: '/',
        loadTime: 1.1,
        visitors: 1247,
        bounceRate: 23,
        performance: 92
      },
      {
        path: '/social',
        loadTime: 1.8,
        visitors: 856,
        bounceRate: 18,
        performance: 87
      },
      {
        path: '/gallery',
        loadTime: 2.3,
        visitors: 723,
        bounceRate: 31,
        performance: 78
      },
      {
        path: '/venue',
        loadTime: 1.4,
        visitors: 634,
        bounceRate: 15,
        performance: 89
      },
      {
        path: '/rsvp',
        loadTime: 1.0,
        visitors: 445,
        bounceRate: 8,
        performance: 95
      }
    ];

    setPerformanceMetrics(mockMetrics);
    setPageMetrics(mockPageMetrics);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-glass-green bg-green-500/10';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'critical':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getTrendIcon = (trend: string, trendValue: number) => {
    if (trend === 'stable') return '→';
    if (trend === 'up') return trendValue > 0 ? '↗' : '↖';
    if (trend === 'down') return trendValue > 0 ? '↘' : '↙';
    return '→';
  };

  const getTrendColor = (trend: string, metricName: string) => {
    // For some metrics, "up" is bad (like load time), for others it's good (like cache hit rate)
    const badWhenUp = ['Page Load Time', 'Time to Interactive', 'API Response Time', 'Database Query Time', 'Memory Usage'];
    const isBadWhenUp = badWhenUp.some(metric => metricName.includes(metric));
    
    if (trend === 'stable') return 'text-muted-foreground';
    if (trend === 'up') return isBadWhenUp ? 'text-red-500' : 'text-glass-green';
    if (trend === 'down') return isBadWhenUp ? 'text-glass-green' : 'text-red-500';
    return 'text-muted-foreground';
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-glass-green' };
    if (score >= 80) return { grade: 'B', color: 'text-glass-blue' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-500' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '580px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-wedding-navy" />
          <h3 className="font-semibold text-wedding-navy">Performance Analytics</h3>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">1h</SelectItem>
            <SelectItem value="24h">24h</SelectItem>
            <SelectItem value="7d">7d</SelectItem>
            <SelectItem value="30d">30d</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-glass-blue" />
                <span className="text-sm font-medium">Performance Score</span>
              </div>
              <span className="text-lg font-bold text-glass-blue">87/100</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-glass-green" />
                <span className="text-sm font-medium">Avg Load Time</span>
              </div>
              <span className="text-lg font-bold text-glass-green">1.2s</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">
            <Monitor className="w-3 h-3 mr-1" />
            Core Metrics
          </TabsTrigger>
          <TabsTrigger value="pages">
            <Globe className="w-3 h-3 mr-1" />
            Page Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-3">
          <div className="grid gap-2">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {metric.value}{metric.unit}
                      </span>
                      {metric.trend !== 'stable' && (
                        <span className={`text-xs ${getTrendColor(metric.trend, metric.name)}`}>
                          {getTrendIcon(metric.trend, metric.trendValue)} {Math.abs(metric.trendValue)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.description}
                  </div>
                  
                  {/* Progress bar for percentage metrics */}
                  {metric.unit === '%' && (
                    <div className="mt-2">
                      <Progress value={metric.value} className="w-full h-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-3">
          <div className="space-y-2">
            {pageMetrics.map((page, index) => {
              const grade = getPerformanceGrade(page.performance);
              return (
                <Card key={index} className="glass-card">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{page.path}</span>
                        <Badge className={`text-xs ${grade.color} bg-current/10`}>
                          {grade.grade}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {page.visitors}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {page.loadTime}s
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">Performance Score</div>
                        <div className="flex items-center gap-2">
                          <Progress value={page.performance} className="w-full h-1" />
                          <span className="font-medium">{page.performance}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Bounce Rate</div>
                        <div className="flex items-center gap-2">
                          <Progress value={page.bounceRate} className="w-full h-1" />
                          <span className="font-medium">{page.bounceRate}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance Summary */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-glass-green">
                    {pageMetrics.filter(p => p.performance >= 90).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Excellent (A)</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-glass-blue">
                    {pageMetrics.filter(p => p.performance >= 80 && p.performance < 90).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Good (B)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;