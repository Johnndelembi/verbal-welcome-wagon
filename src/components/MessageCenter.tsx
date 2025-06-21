import { useState } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, MessageRequest, MessageResponse } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { ChatBubble } from '@/components/ChatBubble';

export const MessageCenter = () => {
  const [formData, setFormData] = useState<MessageRequest>({
    message_body: '',
    wa_id: '',
    name: ''
  });
  const [response, setResponse] = useState<MessageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);
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

    // Add user message to conversation
    const userMessage = {
      text: formData.message_body,
      isUser: true,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);

    setLoading(true);
    try {
      const result = await apiService.sendMessage(formData);
      setResponse(result);
      
      // Add AI response to conversation
      const aiMessage = {
        text: result.response,
        isUser: false,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);
      
      // Clear message input but keep wa_id and name
      setFormData(prev => ({ ...prev, message_body: '' }));
      
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
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Message to Assistant
          </CardTitle>
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
          <CardTitle>Chat Conversation</CardTitle>
          <CardDescription>
            Live conversation with the AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
            {conversation.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Start a conversation to see messages here</p>
                </div>
              </div>
            ) : (
              conversation.map((message, index) => (
                <ChatBubble
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))
            )}
            {loading && (
              <ChatBubble
                message="..."
                isUser={false}
                timestamp={new Date()}
                isLoading={true}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
