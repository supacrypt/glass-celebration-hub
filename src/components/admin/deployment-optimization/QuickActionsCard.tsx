import React from 'react';
import { Globe, Database, Monitor, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const QuickActionsCard: React.FC = () => {
  return (
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
  );
};