import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare } from 'lucide-react';
import { Chat } from '@/types/chat';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

export const ChatSidebar = ({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  isLoading 
}: ChatSidebarProps) => {
  const getChatTitle = (chat: Chat) => {
    if (chat.title) return chat.title;
    if (chat.chat.length > 0) {
      const firstMessage = chat.chat[0];
      return firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
    }
    return `Conversa ${chat.id.slice(0, 8)}`;
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Button 
          onClick={onNewChat}
          disabled={isLoading}
          className="w-full gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Nova Conversa
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              className={`p-3 cursor-pointer transition-colors hover:bg-sidebar-accent ${
                currentChatId === chat.id 
                  ? 'bg-sidebar-accent border-sidebar-primary' 
                  : 'border-sidebar-border'
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-sidebar-foreground/70" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {getChatTitle(chat)}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 mt-1">
                    {chat.chat.length} mensagem{chat.chat.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Card>
          ))}
          
          {chats.length === 0 && (
            <div className="text-center py-8 text-sidebar-foreground/70">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma conversa ainda</p>
              <p className="text-xs mt-1">Clique em "Nova Conversa" para começar</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};