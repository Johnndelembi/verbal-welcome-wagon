
import { useState } from 'react';
import { Search, RotateCcw, Trash2, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, ConversationHistory } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const ConversationManager = () => {
  const [waId, setWaId] = useState('');
  const [conversation, setConversation] = useState<ConversationHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetHistory = async () => {
    if (!waId) {
      toast({
        title: "Error",
        description: "Please enter a WhatsApp ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.getConversationHistory(waId);
      setConversation(result);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get conversation history",
        variant: "destructive"
      });
      setConversation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResetHandover = async () => {
    if (!waId) return;

    setActionLoading('reset');
    try {
      await apiService.resetHandover(waId);
      toast({
        title: "Success",
        description: "Handover reset successfully"
      });
      // Refresh conversation data
      await handleGetHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset handover",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConversation = async () => {
    if (!waId) return;

    setActionLoading('delete');
    try {
      await apiService.deleteConversation(waId);
      toast({
        title: "Success",
        description: "Conversation deleted successfully"
      });
      setConversation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete conversation",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversation Management</CardTitle>
          <CardDescription>
            Search and manage user conversations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search-wa-id">WhatsApp ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="search-wa-id"
                placeholder="Enter WhatsApp ID to search"
                value={waId}
                onChange={(e) => setWaId(e.target.value)}
              />
              <Button onClick={handleGetHistory} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {conversation && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetHandover}
                  disabled={actionLoading === 'reset'}
                >
                  {actionLoading === 'reset' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-2 h-4 w-4" />
                  )}
                  Reset Handover
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDeleteConversation}
                  disabled={actionLoading === 'delete'}
                >
                  {actionLoading === 'delete' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Details</CardTitle>
          <CardDescription>
            View conversation history and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {conversation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex gap-2">
                  <Badge variant={conversation.handover_triggered ? "destructive" : "default"}>
                    {conversation.handover_triggered ? "Handover Active" : "AI Active"}
                  </Badge>
                  <Badge variant="outline">
                    Fallbacks: {conversation.fallback_count}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recent Messages:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {conversation.last_messages.length > 0 ? (
                    conversation.last_messages.map((message, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant={message.role === 'user' ? 'secondary' : 'default'}>
                            {message.role}
                          </Badge>
                          {message.timestamp && (
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No messages found</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Search for a WhatsApp ID to view conversation details
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
