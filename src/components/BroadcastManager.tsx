
import { useState } from 'react';
import { Send, Plus, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, BroadcastRequest } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const BroadcastManager = () => {
  const [waIds, setWaIds] = useState<string[]>(['']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    successes: string[];
    failures: string[];
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const addWaIdField = () => {
    setWaIds([...waIds, '']);
  };

  const removeWaIdField = (index: number) => {
    if (waIds.length > 1) {
      setWaIds(waIds.filter((_, i) => i !== index));
    }
  };

  const updateWaId = (index: number, value: string) => {
    const updated = [...waIds];
    updated[index] = value;
    setWaIds(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validWaIds = waIds.filter(id => id.trim() !== '');
    
    if (validWaIds.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one WhatsApp ID",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.sendBroadcast({
        wa_ids: validWaIds,
        message: message.trim()
      });
      
      setLastResult({
        successes: result.successes,
        failures: result.failures,
        message: result.message
      });

      toast({
        title: "Broadcast Sent",
        description: result.message
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send broadcast",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Broadcast Message</CardTitle>
          <CardDescription>
            Send a message to multiple WhatsApp users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>WhatsApp IDs</Label>
              <div className="space-y-2 mt-1">
                {waIds.map((waId, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`WhatsApp ID ${index + 1}`}
                      value={waId}
                      onChange={(e) => updateWaId(index, e.target.value)}
                    />
                    {waIds.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeWaIdField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWaIdField}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another ID
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="broadcast-message">Message</Label>
              <Textarea
                id="broadcast-message"
                placeholder="Enter your broadcast message..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Broadcast
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Broadcast Results</CardTitle>
          <CardDescription>
            Results from your last broadcast
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lastResult ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  {lastResult.message}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">
                    Successful ({lastResult.successes.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {lastResult.successes.map((id, index) => (
                      <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                        {id}
                      </Badge>
                    ))}
                  </div>
                </div>

                {lastResult.failures.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">
                      Failed ({lastResult.failures.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {lastResult.failures.map((id, index) => (
                        <Badge key={index} variant="destructive">
                          {id}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Send a broadcast to see results here
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
