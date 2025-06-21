
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export const ChatBubble = ({ message, isUser, timestamp, isLoading }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm",
        isUser 
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md" 
          : "bg-white text-gray-800 rounded-bl-md border"
      )}>
        {isLoading ? (
          <div className="flex space-x-1 items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap">{message}</p>
            <p className={cn(
              "text-xs mt-1",
              isUser ? "text-blue-100" : "text-gray-500"
            )}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
