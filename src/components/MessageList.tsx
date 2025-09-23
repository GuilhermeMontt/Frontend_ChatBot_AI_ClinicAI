import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Message } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Pronto para conversar!</h3>
          <p className="text-sm">Envie uma mensagem para começar a conversa</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`flex gap-3 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div className={`flex flex-col ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                <Card className={`p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </Card>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <Card className="p-3 bg-card">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse delay-150"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Digitando...</span>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};