
import { useState, useEffect } from 'react';
import { MessageSquare, Users, BarChart3, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCenter } from '@/components/MessageCenter';
import { ConversationManager } from '@/components/ConversationManager';
import { BroadcastManager } from '@/components/BroadcastManager';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Bot Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your WhatsApp chatbot conversations and analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Broadcast
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <MessageCenter />
          </TabsContent>

          <TabsContent value="conversations">
            <ConversationManager />
          </TabsContent>

          <TabsContent value="broadcast">
            <BroadcastManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
