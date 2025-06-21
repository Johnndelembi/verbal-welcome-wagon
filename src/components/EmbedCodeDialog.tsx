
import { useState } from 'react';
import { Copy, CheckCircle, Code } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EmbedCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmbedCodeDialog = ({ open, onOpenChange }: EmbedCodeDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
        wa_id: 'your-unique-id',
        name: 'Website Visitor'
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

  const shareableLink = `${window.location.origin}/chat?share=true`;

  const copyShareableLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Link copied!",
        description: "Shareable chat link has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the link manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Embed ChatBot Widget
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Widget Code */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Widget Code</h3>
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
            <p className="text-sm text-gray-600 mt-2">
              Copy this code and paste it into your website's HTML before the closing &lt;/body&gt; tag.
            </p>
          </div>

          {/* Shareable Link */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Shareable Chat Link</h3>
              <Button
                onClick={copyShareableLink}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <code className="text-sm break-all">{shareableLink}</code>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this link with anyone to let them chat with your AI assistant.
            </p>
          </div>

          {/* Preview */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Your chat widget will appear like this:</p>
              <div className="relative bg-white border rounded-lg p-4 h-32 flex items-center justify-center">
                <div className="absolute bottom-4 right-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                    <Code className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Your website content here...</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
