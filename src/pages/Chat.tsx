
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWidget } from '@/components/ChatWidget';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isShared = searchParams.get('share') === 'true';
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Show chat widget after a brief delay for animation
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
      {/* Header for shared chat */}
      {isShared && (
        <div className="absolute top-6 left-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      )}

      {/* Welcome Message */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <MessageSquare className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isShared ? 'Welcome to Our Chat' : 'Chat with AI Assistant'}
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          {isShared 
            ? 'Start a conversation with our AI assistant. We\'re here to help!'
            : 'Experience the power of AI conversation. Ask anything!'
          }
        </p>
      </div>

      {/* Chat Widget */}
      {showChat && (
        <ChatWidget 
          position="center"
          wa_id={isShared ? `shared-${Date.now()}` : 'direct-chat'}
          name={isShared ? 'Shared User' : 'Chat User'}
        />
      )}

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-sm text-gray-500">
        <p>Powered by RafikiBot</p>
      </div>
    </div>
  );
};

export default Chat;
