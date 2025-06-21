
import { useState } from 'react';
import { Send, Loader2, MessageSquare, Code, Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiService, MessageRequest, MessageResponse } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { ChatBubble } from '@/components/ChatBubble';

export const MessageCenter = () => {
  const [formData, setFormData] = useState<MessageRequest>({
    message_body: '',
    wa_id: '',
    name: ''
  });
  const [widgetConfig, setWidgetConfig] = useState({
    name: '',
    wa_id: ''
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);
  const [showWidgetDialog, setShowWidgetDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleConfigChange = (field: keyof typeof widgetConfig, value: string) => {
    setWidgetConfig(prev => ({ ...prev, [field]: value }));
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !formData.wa_id || !formData.name) {
      toast({
        title: "Error",
        description: "Please fill in name, wa_id, and message",
        variant: "destructive"
      });
      return;
    }

    const userMessage = {
      text: currentMessage,
      isUser: true,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);

    setLoading(true);
    try {
      const result = await apiService.sendMessage({
        message_body: currentMessage,
        wa_id: formData.wa_id,
        name: formData.name
      });
      
      const aiMessage = {
        text: result.response,
        isUser: false,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);
      setCurrentMessage('');
      
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateWidgetCode = () => {
    if (!widgetConfig.name || !widgetConfig.wa_id) {
      toast({
        title: "Error",
        description: "Please specify name and wa_id first",
        variant: "destructive"
      });
      return;
    }
    setShowWidgetDialog(true);
  };

  const embedCode = `<!-- ChatBot Pro Widget -->
<div id="chatbot-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget.js';
    script.async = true;
    script.onload = function() {
      new ChatBotWidget({
        apiUrl: '${import.meta.env.VITE_API_URL || 'http://localhost:8000'}',
        position: 'bottom-right',
        wa_id: '${widgetConfig.wa_id}',
        name: '${widgetConfig.name}'
      });
    };
    document.head.appendChild(script);
  })();
</script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: "Code copied!",
        description: "Widget code has been copied to your clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the code manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat Configuration
          </CardTitle>
          <CardDescription>
            Configure your chat settings and test the widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="config-name">Name</Label>
            <Input
              id="config-name"
              placeholder="Enter user name"
              value={widgetConfig.name}
              onChange={(e) => handleConfigChange('name', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="config-wa-id">WhatsApp ID</Label>
            <Input
              id="config-wa-id"
              placeholder="Enter WhatsApp ID"
              value={widgetConfig.wa_id}
              onChange={(e) => handleConfigChange('wa_id', e.target.value)}
            />
          </div>

          <Button 
            onClick={generateWidgetCode}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Code className="mr-2 h-4 w-4" />
            Get Widget Code
          </Button>
        </CardContent>
      </Card>

      {/* Chat Widget */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle>Chat Widget Preview</CardTitle>
          <CardDescription>
            Test your chat widget here
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg mb-4">
            {conversation.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Configure settings and start chatting</p>
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

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-full border-gray-200 focus:border-blue-500"
              disabled={loading || !formData.name || !formData.wa_id}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !currentMessage.trim() || !formData.name || !formData.wa_id}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-2 h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Widget Code Dialog */}
      <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Widget Code
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Embed Code</h3>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
            <Textarea
              value={embedCode}
              readOnly
              className="h-40 font-mono text-sm"
            />
            <p className="text-sm text-gray-600">
              Copy this code and paste it into your website's HTML before the closing &lt;/body&gt; tag.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
