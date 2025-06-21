
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, MessageRequest, MessageResponse } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const MessageCenter = () => {
  const [formData, setFormData] = useState<MessageRequest>({
    message_body: '',
    wa_id: '',
    name: ''
  });
  const [response, setResponse] = useState<MessageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof MessageRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message_body || !formData.wa_id || !formData.name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.sendMessage(formData);
      setResponse(result);
      toast({
        title: "Success",
        description: "Message sent successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
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
          <CardTitle>Send Message to Assistant</CardTitle>
          <CardDescription>
            Send a message to the OpenAI Assistant and get a response
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="wa_id">WhatsApp ID</Label>
              <Input
                id="wa_id"
                placeholder="Enter WhatsApp ID"
                value={formData.wa_id}
                onChange={(e) => handleInputChange('wa_id', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter user name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message..."
                rows={4}
                value={formData.message_body}
                onChange={(e) => handleInputChange('message_body', e.target.value)}
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
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>
            Assistant response will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {response ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Status:</strong> {response.status}
                </AlertDescription>
              </Alert>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Response:</p>
                <p>{response.response}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Send a message to see the response here
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
