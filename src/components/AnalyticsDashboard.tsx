
import { useState, useEffect } from 'react';
import { Users, MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, Analytics } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const result = await apiService.getAnalytics();
      setAnalytics(result);
      setLastUpdated(new Date());
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    color = "blue" 
  }: { 
    title: string; 
    value: number; 
    description: string; 
    icon: any; 
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Overview of your chatbot performance</p>
        </div>
        <Button onClick={fetchAnalytics} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {lastUpdated && (
        <Alert>
          <AlertDescription>
            Last updated: {lastUpdated.toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Active Users"
            value={analytics.analytics.active_users}
            description="Total users with active conversations"
            icon={Users}
            color="blue"
          />
          
          <StatCard
            title="Total Messages"
            value={analytics.analytics.total_messages}
            description="Messages processed by the bot"
            icon={MessageSquare}
            color="green"
          />
          
          <StatCard
            title="Handovers"
            value={analytics.analytics.handovers}
            description="Conversations escalated to human agents"
            icon={AlertTriangle}
            color="orange"
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {loading ? "Loading analytics..." : "Failed to load analytics"}
          </p>
        </div>
      )}

      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>
              Performance insights for your WhatsApp bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Handover Rate</span>
                <span className="text-lg font-semibold">
                  {analytics.analytics.active_users > 0 
                    ? ((analytics.analytics.handovers / analytics.analytics.active_users) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Avg Messages per User</span>
                <span className="text-lg font-semibold">
                  {analytics.analytics.active_users > 0 
                    ? (analytics.analytics.total_messages / analytics.analytics.active_users).toFixed(1)
                    : 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Bot Success Rate</span>
                <span className="text-lg font-semibold text-green-600">
                  {analytics.analytics.active_users > 0 
                    ? (((analytics.analytics.active_users - analytics.analytics.handovers) / analytics.analytics.active_users) * 100).toFixed(1)
                    : 100}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
